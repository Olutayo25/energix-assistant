import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  COUNTRIES, SPACE_TYPES, GENERATOR_SIZES,
  DEFAULT_USAGE_TIMES, HOUR_OPTIONS, USAGE_PRESETS, DAYS_PER_WEEK_PRESETS,
  CUSTOM_EQUIPMENT_SUGGESTIONS,
  getSolarRecommendations, estimateSolarPrice, computeEnergyProfileV2,
  getUsageHoursMultiSlot, getSolarOverlapMultiSlot, getBatteryHoursMultiSlot,
  isHourInAnySlot, formatHour,
  getRoomsForSpace, expandRooms, SPACE_ROOM_COUNTS,
} from './data/constants';
import type { CountryData, EquipmentDef, EnergyProfile, TimeSlot } from './data/constants';

// ============== TYPES ==============
interface EquipmentState {
  enabled: boolean;
  selections: Record<string, string>;
  quantity: number;
  timeSlots: TimeSlot[];
  daysPerWeek: number;
}

interface CustomEquipmentItem {
  id: string;
  name: string;
  icon: string;
  wattage: number;
}

interface GeneratorState {
  enabled: boolean;
  size: string;
  fuelType: string;
  frequency: string;
  hoursPerDay: number;
  fuelPrice: number;
  litresPerFill: number;
  fillsPerWeek: number;
  maintenance: number;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
}

function getDefaultEquipmentState(eqId: string): EquipmentState {
  const defaults = DEFAULT_USAGE_TIMES[eqId] || { start: 18, end: 23, is24h: false };
  return {
    enabled: false,
    selections: {},
    quantity: 1,
    timeSlots: [{ start: defaults.start, end: defaults.end, is24h: defaults.is24h }],
    daysPerWeek: 7,
  };
}

const eqKey = (instanceId: string, eqId: string) => `${instanceId}::${eqId}`;

// Convert CustomEquipmentItem to EquipmentDef for unified rendering
function customToEqDef(ceq: CustomEquipmentItem): EquipmentDef {
  return {
    id: `custom-${ceq.id}`,
    name: ceq.name,
    icon: ceq.icon,
    fields: [],
    getWattage: (_sel, qty) => ceq.wattage * qty,
  };
}

// ============== MAIN APP ==============
export function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedSpaceType, setSelectedSpaceType] = useState('');
  const [roomCounts, setRoomCounts] = useState<Record<string, number>>({});
  const [hasBQ, setHasBQ] = useState(false);
  const [activeRoom, setActiveRoom] = useState('');
  const [equipment, setEquipment] = useState<Record<string, EquipmentState>>({});
  const [customEquipment, setCustomEquipment] = useState<Record<string, CustomEquipmentItem[]>>({});
  const [showAddEquipment, setShowAddEquipment] = useState('');
  const [newEqName, setNewEqName] = useState('');
  const [newEqWattage, setNewEqWattage] = useState(100);
  const [newEqIcon, setNewEqIcon] = useState('🔌');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDisco, setSelectedDisco] = useState('');
  const [selectedTariff, setSelectedTariff] = useState<number>(0);
  const [powerHours, setPowerHours] = useState(12);
  const [generator, setGenerator] = useState<GeneratorState>({
    enabled: false, size: '2.5', fuelType: 'petrol', frequency: 'daily',
    hoursPerDay: 5, fuelPrice: 700, litresPerFill: 10, fillsPerWeek: 2, maintenance: 10000,
  });
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [selectedSolarPkg, setSelectedSolarPkg] = useState<number>(1); // 0=Essential, 1=Standard, 2=Premium
  const [quoteNotes, setQuoteNotes] = useState('');
  const [formAddress, setFormAddress] = useState('');

  const TOTAL_STEPS = 8;
  const stepLabels = ['Country', 'Space', 'Equipment', 'Usage', 'Analysis', 'Costs', 'Solar', 'Report'];

  // ============== SPACE-AWARE ROOMS ==============
  const currentRooms = useMemo(() => {
    if (!selectedSpaceType) return getRoomsForSpace('1bed');
    return getRoomsForSpace(selectedSpaceType);
  }, [selectedSpaceType]);

  const expandedRooms = useMemo(() => {
    return expandRooms(currentRooms, roomCounts, hasBQ);
  }, [currentRooms, roomCounts, hasBQ]);

  useEffect(() => {
    if (expandedRooms.length > 0 && !expandedRooms.find(r => r.instanceId === activeRoom)) {
      setActiveRoom(expandedRooms[0].instanceId);
    }
  }, [expandedRooms, activeRoom]);

  // ============== SPACE TYPE SELECTION ==============
  const selectSpaceType = useCallback((spaceId: string) => {
    setSelectedSpaceType(spaceId);
    const config = SPACE_ROOM_COUNTS[spaceId];
    const counts: Record<string, number> = {};
    if (config) config.rooms.forEach(r => { counts[r.roomId] = r.default; });
    setRoomCounts(counts);
    setHasBQ(false);
    setEquipment({});
    setCustomEquipment({});
  }, []);

  const updateRoomCount = useCallback((roomId: string, delta: number) => {
    setRoomCounts(prev => {
      const config = SPACE_ROOM_COUNTS[selectedSpaceType];
      const rc = config?.rooms.find(r => r.roomId === roomId);
      if (!rc) return prev;
      const current = prev[roomId] ?? rc.default;
      const next = Math.max(rc.min, Math.min(rc.max, current + delta));
      return { ...prev, [roomId]: next };
    });
  }, [selectedSpaceType]);

  // ============== EQUIPMENT HELPERS ==============
  const getEqState = useCallback((key: string, baseEqId: string): EquipmentState => {
    return equipment[key] || getDefaultEquipmentState(baseEqId);
  }, [equipment]);

  const toggleEquipment = useCallback((key: string, baseEqId: string) => {
    setEquipment(prev => {
      const current = prev[key] || getDefaultEquipmentState(baseEqId);
      return { ...prev, [key]: { ...current, enabled: !current.enabled } };
    });
  }, []);

  const updateEquipmentField = useCallback((key: string, baseEqId: string, field: string, value: string) => {
    setEquipment(prev => {
      const current = prev[key] || getDefaultEquipmentState(baseEqId);
      return { ...prev, [key]: { ...current, selections: { ...current.selections, [field]: value } } };
    });
  }, []);

  const updateQuantity = useCallback((key: string, baseEqId: string, delta: number) => {
    setEquipment(prev => {
      const current = prev[key] || getDefaultEquipmentState(baseEqId);
      const newQty = Math.max(1, Math.min(20, current.quantity + delta));
      return { ...prev, [key]: { ...current, quantity: newQty } };
    });
  }, []);

  // Multi-slot time management
  const updateTimeSlot = useCallback((key: string, baseEqId: string, slotIdx: number, start: number, end: number, is24h: boolean) => {
    setEquipment(prev => {
      const current = prev[key] || getDefaultEquipmentState(baseEqId);
      const slots = [...current.timeSlots];
      if (is24h) {
        return { ...prev, [key]: { ...current, timeSlots: [{ start: 0, end: 0, is24h: true }] } };
      }
      slots[slotIdx] = { start, end, is24h: false };
      return { ...prev, [key]: { ...current, timeSlots: slots } };
    });
  }, []);

  const addTimeSlot = useCallback((key: string, baseEqId: string) => {
    setEquipment(prev => {
      const current = prev[key] || getDefaultEquipmentState(baseEqId);
      if (current.timeSlots.length >= 4 || current.timeSlots.some(s => s.is24h)) return prev;
      const newSlots = [...current.timeSlots, { start: 12, end: 14, is24h: false }];
      return { ...prev, [key]: { ...current, timeSlots: newSlots } };
    });
  }, []);

  const removeTimeSlot = useCallback((key: string, baseEqId: string, slotIdx: number) => {
    setEquipment(prev => {
      const current = prev[key] || getDefaultEquipmentState(baseEqId);
      if (current.timeSlots.length <= 1) return prev;
      const newSlots = current.timeSlots.filter((_, i) => i !== slotIdx);
      return { ...prev, [key]: { ...current, timeSlots: newSlots } };
    });
  }, []);

  const updateDaysPerWeek = useCallback((key: string, baseEqId: string, days: number) => {
    setEquipment(prev => {
      const current = prev[key] || getDefaultEquipmentState(baseEqId);
      return { ...prev, [key]: { ...current, daysPerWeek: Math.max(1, Math.min(7, days)) } };
    });
  }, []);

  // Custom equipment management
  const addCustomEq = useCallback((roomInstanceId: string) => {
    if (!newEqName.trim() || newEqWattage <= 0) return;
    const ceq: CustomEquipmentItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: newEqName.trim(),
      icon: newEqIcon,
      wattage: newEqWattage,
    };
    setCustomEquipment(prev => ({
      ...prev,
      [roomInstanceId]: [...(prev[roomInstanceId] || []), ceq],
    }));
    // Auto-enable
    const key = eqKey(roomInstanceId, `custom-${ceq.id}`);
    setEquipment(prev => ({
      ...prev,
      [key]: { enabled: true, selections: {}, quantity: 1, timeSlots: [{ start: 8, end: 18, is24h: false }], daysPerWeek: 7 },
    }));
    setNewEqName('');
    setNewEqWattage(100);
    setNewEqIcon('🔌');
    setShowAddEquipment('');
  }, [newEqName, newEqWattage, newEqIcon]);

  const removeCustomEq = useCallback((roomInstanceId: string, ceqId: string) => {
    setCustomEquipment(prev => ({
      ...prev,
      [roomInstanceId]: (prev[roomInstanceId] || []).filter(c => c.id !== ceqId),
    }));
    const key = eqKey(roomInstanceId, `custom-${ceqId}`);
    setEquipment(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // Copy equipment from one room instance to all other instances of same type
  const copyToAllInstances = useCallback((sourceInstanceId: string, roomTypeId: string) => {
    const sourcePrefix = `${sourceInstanceId}::`;
    const targetRooms = expandedRooms.filter(r => r.roomTypeId === roomTypeId && r.instanceId !== sourceInstanceId);
    if (targetRooms.length === 0) return;
    setEquipment(prev => {
      const next = { ...prev };
      const sourceEntries = Object.entries(prev).filter(([k]) => k.startsWith(sourcePrefix));
      for (const targetRoom of targetRooms) {
        for (const [sourceKey, sourceState] of sourceEntries) {
          const eId = sourceKey.split('::')[1];
          next[`${targetRoom.instanceId}::${eId}`] = { ...sourceState };
        }
      }
      return next;
    });
  }, [expandedRooms]);

  // ============== CALCULATIONS ==============
  const activeEquipment = useMemo(() => {
    const items: { eq: EquipmentDef; state: EquipmentState; roomName: string; wattage: number; key: string }[] = [];
    expandedRooms.forEach(room => {
      // Regular equipment
      room.equipment.forEach(eq => {
        const key = eqKey(room.instanceId, eq.id);
        const state = equipment[key] || getDefaultEquipmentState(eq.id);
        if (state.enabled) {
          items.push({ eq, state, roomName: room.name, wattage: eq.getWattage(state.selections, state.quantity), key });
        }
      });
      // Custom equipment
      (customEquipment[room.instanceId] || []).forEach(ceq => {
        const eqDef = customToEqDef(ceq);
        const key = eqKey(room.instanceId, eqDef.id);
        const state = equipment[key] || getDefaultEquipmentState(eqDef.id);
        if (state.enabled) {
          items.push({ eq: eqDef, state, roomName: room.name, wattage: eqDef.getWattage(state.selections, state.quantity), key });
        }
      });
    });
    return items;
  }, [equipment, expandedRooms, customEquipment]);

  const sunStart = selectedCountry?.sunStart ?? 6;
  const sunEnd = selectedCountry?.sunEnd ?? 18;

  const energyProfile: EnergyProfile = useMemo(() => {
    if (activeEquipment.length === 0) return { totalWatts: 0, dailyKwh: 0, solarKwh: 0, batteryKwh: 0, solarRatio: 0 };
    return computeEnergyProfileV2(
      activeEquipment.map(item => ({
        wattage: item.wattage,
        timeSlots: item.state.timeSlots,
        daysPerWeek: item.state.daysPerWeek,
      })),
      sunStart, sunEnd,
    );
  }, [activeEquipment, sunStart, sunEnd]);

  const monthlyKwh = useMemo(() => energyProfile.dailyKwh * 30, [energyProfile]);
  const gridRatio = powerHours / 24;
  const monthlyGridKwh = monthlyKwh * gridRatio;
  const monthlyElecCost = useMemo(() => {
    if (!selectedCountry || !selectedTariff) return 0;
    return Math.round(monthlyGridKwh * selectedTariff);
  }, [monthlyGridKwh, selectedTariff, selectedCountry]);

  const generatorCosts = useMemo(() => {
    if (!generator.enabled) return { weekly: 0, monthly: 0, annual: 0, totalMonthly: 0 };
    const weekly = generator.fuelPrice * generator.litresPerFill * generator.fillsPerWeek;
    const monthly = weekly * 4;
    const annual = monthly * 12;
    const totalMonthly = monthly + generator.maintenance;
    return { weekly, monthly, annual, totalMonthly };
  }, [generator]);

  const formatCurrency = useCallback((amount: number) => {
    if (!selectedCountry) return `${amount}`;
    return `${selectedCountry.currencySymbol}${amount.toLocaleString()}`;
  }, [selectedCountry]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const canProceed = useCallback((step: number): boolean => {
    switch (step) {
      case 1: return selectedCountry !== null;
      case 2: return selectedSpaceType !== '';
      case 3: return activeEquipment.length > 0;
      default: return true;
    }
  }, [selectedCountry, selectedSpaceType, activeEquipment]);

  // ============== HOURLY LOAD PROFILE ==============
  const hourlyProfile = useMemo(() => {
    const hours = Array.from({ length: 24 }, () => ({ totalWatts: 0, solarWatts: 0, batteryWatts: 0 }));
    activeEquipment.forEach(({ state, wattage }) => {
      for (let h = 0; h < 24; h++) {
        if (isHourInAnySlot(h, state.timeSlots)) {
          hours[h].totalWatts += wattage;
          if (h >= sunStart && h < sunEnd) hours[h].solarWatts += wattage;
          else hours[h].batteryWatts += wattage;
        }
      }
    });
    return hours;
  }, [activeEquipment, sunStart, sunEnd]);

  const peakHourLoad = useMemo(() => Math.max(...hourlyProfile.map(h => h.totalWatts), 0), [hourlyProfile]);

  const topConsumers = useMemo(() => {
    return [...activeEquipment]
      .map(item => {
        const hrs = getUsageHoursMultiSlot(item.state.timeSlots);
        const dayFactor = item.state.daysPerWeek / 7;
        return { ...item, dailyKwh: (item.wattage * hrs * dayFactor) / 1000 };
      })
      .sort((a, b) => b.dailyKwh - a.dailyKwh)
      .slice(0, 5);
  }, [activeEquipment]);

  const solarPackages = useMemo(() => {
    if (!selectedCountry || energyProfile.totalWatts === 0) return [];
    return getSolarRecommendations(energyProfile, selectedCountry);
  }, [selectedCountry, energyProfile]);

  const filteredCountries = useMemo(() => {
    if (countrySearch.trim()) return COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()));
    if (!showAllCountries) return COUNTRIES.slice(0, 8);
    return COUNTRIES;
  }, [countrySearch, showAllCountries]);

  const spaceConfig = SPACE_ROOM_COUNTS[selectedSpaceType];

  // ============== RENDER ==============
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 font-[Inter]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-2xl font-bold text-white">⚡ EnergiX</h1>
            <p className="text-xs text-emerald-400">AI-Powered Energy Intelligence</p>
          </div>
          <div className="text-right text-xs text-slate-400">Step {currentStep} of {TOTAL_STEPS}</div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="mx-auto max-w-4xl px-4 py-4">
        <div className="h-2 overflow-hidden rounded-full bg-slate-700">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }} />
        </div>
        <div className="mt-2 flex justify-between">
          {stepLabels.map((label, i) => (
            <button key={label} onClick={() => { if (i + 1 <= currentStep) goToStep(i + 1); }}
              className={`flex flex-col items-center gap-1 transition-all ${i + 1 === currentStep ? 'scale-110' : ''} ${i + 1 <= currentStep ? 'cursor-pointer' : 'cursor-default'}`}>
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                i + 1 < currentStep ? 'bg-emerald-500 text-white' :
                i + 1 === currentStep ? 'bg-emerald-400 text-slate-900 ring-2 ring-emerald-400/50 ring-offset-2 ring-offset-slate-900' :
                'bg-slate-700 text-slate-400'
              }`}>{i + 1 < currentStep ? '✓' : i + 1}</div>
              <span className={`hidden text-[10px] sm:block ${i + 1 <= currentStep ? 'text-emerald-400' : 'text-slate-500'}`}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 pb-8">

        {/* =============== STEP 1: Country =============== */}
        {currentStep === 1 && (
          <StepCard>
            <AiBubble>👋 Welcome to EnergiX! Let's start by selecting your country for accurate energy calculations, tariffs, and solar recommendations.</AiBubble>
            <h2 className="mb-1 text-xl font-bold text-white">🌍 Where are you located?</h2>
            <p className="mb-4 text-sm text-slate-400">Select your country ({COUNTRIES.length} countries supported)</p>
            <div className="relative mb-4">
              <input type="text" placeholder="🔍 Search countries..." value={countrySearch}
                onChange={e => { setCountrySearch(e.target.value); setShowAllCountries(true); }}
                className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {filteredCountries.map(country => (
                <button key={country.code} onClick={() => { setSelectedCountry(country); setGenerator(prev => ({ ...prev, fuelPrice: country.fuelPricePerLitre })); }}
                  className={`group relative overflow-hidden rounded-xl border-2 p-3 text-center transition-all hover:scale-[1.02] ${
                    selectedCountry?.code === country.code ? 'border-emerald-400 bg-emerald-400/10 shadow-lg shadow-emerald-500/20' : 'border-slate-600/50 bg-slate-800/50 hover:border-slate-500'
                  }`}>
                  <div className="text-2xl">{country.flag}</div>
                  <div className="mt-1 text-xs font-semibold text-white leading-tight">{country.name}</div>
                  <div className="mt-0.5 text-[10px] text-slate-400">{country.currencySymbol} • ☀️{country.sunHours}h</div>
                  {selectedCountry?.code === country.code && <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[10px] text-slate-900">✓</div>}
                </button>
              ))}
            </div>
            {!showAllCountries && !countrySearch && COUNTRIES.length > 8 && (
              <button onClick={() => setShowAllCountries(true)} className="mt-4 w-full rounded-xl border border-slate-600 bg-slate-700/30 py-3 text-sm font-medium text-emerald-400 transition-all hover:bg-slate-700/60">
                Show all {COUNTRIES.length} countries ↓
              </button>
            )}
            {filteredCountries.length === 0 && <div className="py-8 text-center text-sm text-slate-400">No countries match your search.</div>}
            <NavButtons onNext={() => goToStep(2)} nextDisabled={!canProceed(1)} />
          </StepCard>
        )}

        {/* =============== STEP 2: Space Type + Room Config =============== */}
        {currentStep === 2 && (
          <StepCard>
            <AiBubble>Great{selectedCountry ? `, you're in ${selectedCountry.name}` : ''}! Now tell me about your space — I'll configure the right rooms and equipment for you.</AiBubble>
            <h2 className="mb-1 text-xl font-bold text-white">🏠 What type of space?</h2>
            <p className="mb-6 text-sm text-slate-400">Select the option that best describes your space</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {SPACE_TYPES.map(space => (
                <button key={space.id} onClick={() => selectSpaceType(space.id)}
                  className={`rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.01] ${
                    selectedSpaceType === space.id ? 'border-emerald-400 bg-emerald-400/10' : 'border-slate-600/50 bg-slate-800/50 hover:border-slate-500'
                  }`}>
                  <div className="text-2xl">{space.icon}</div>
                  <div className="mt-2 text-sm font-semibold text-white">{space.name}</div>
                  <div className="mt-1 text-xs text-slate-400">{space.description}</div>
                  {selectedSpaceType === space.id && <div className="mt-2 text-xs font-medium text-emerald-400">✓ Selected</div>}
                </button>
              ))}
            </div>
            {selectedSpaceType && spaceConfig && spaceConfig.rooms.length > 0 && (
              <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 animate-fadeIn">
                <h3 className="mb-1 text-base font-bold text-white">🏗️ Configure Your Rooms</h3>
                <p className="mb-4 text-xs text-slate-400">Adjust the number of each room type</p>
                <div className="space-y-3">
                  {spaceConfig.rooms.map(rc => {
                    const count = roomCounts[rc.roomId] ?? rc.default;
                    return (
                      <div key={rc.roomId} className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{rc.icon}</span>
                          <div>
                            <span className="text-sm font-semibold text-white">{rc.label}{count > 1 ? 's' : ''}</span>
                            <span className="ml-2 text-[10px] text-slate-400">(min {rc.min}, max {rc.max})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-700 px-2 py-1">
                          <button onClick={() => updateRoomCount(rc.roomId, -1)} disabled={count <= rc.min} className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-600 text-lg font-bold text-white transition-all hover:bg-slate-500 disabled:opacity-30">−</button>
                          <span className="min-w-[2.5rem] text-center text-lg font-bold text-emerald-400">{count}</span>
                          <button onClick={() => updateRoomCount(rc.roomId, 1)} disabled={count >= rc.max} className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-600 text-lg font-bold text-white transition-all hover:bg-slate-500 disabled:opacity-30">+</button>
                        </div>
                      </div>
                    );
                  })}
                  {spaceConfig.bqAvailable && (
                    <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🏠</span>
                        <div>
                          <div className="text-sm font-semibold text-white">BQ (Boys' Quarters)</div>
                          <div className="text-[10px] text-slate-400">Staff quarters / separate unit</div>
                        </div>
                      </div>
                      <ToggleSwitch checked={hasBQ} onChange={() => setHasBQ(v => !v)} />
                    </div>
                  )}
                </div>
                <div className="mt-4 rounded-lg bg-slate-800/40 p-3">
                  <div className="text-xs text-slate-400 mb-1">Your space will have:</div>
                  <div className="flex flex-wrap gap-2">
                    {expandedRooms.map(room => (
                      <span key={room.instanceId} className="rounded-full bg-slate-700 px-2.5 py-1 text-[11px] font-medium text-white">{room.icon} {room.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {selectedSpaceType === 'studio' && (
              <div className="mt-4 rounded-lg bg-slate-800/40 border border-slate-700/50 p-3 text-xs text-slate-400">
                💡 <strong className="text-white">Studio/Self-Contain</strong>: Living area and bedroom in one main room, with a kitchenette and bathroom.
              </div>
            )}
            <NavButtons onBack={() => goToStep(1)} onNext={() => goToStep(3)} nextDisabled={!canProceed(2)} />
          </StepCard>
        )}

        {/* =============== STEP 3: Equipment Selection =============== */}
        {currentStep === 3 && (
          <StepCard>
            <AiBubble>
              {selectedSpaceType === 'studio' ? "Your studio has a Main Room, Kitchenette, and Bathroom. Toggle on equipment you have — and add any custom items at the bottom!" :
               selectedSpaceType === 'church' ? "I've set up rooms for your worship center. Toggle equipment and add any custom items!" :
               `I've set up ${expandedRooms.length} rooms. Toggle equipment, and use ➕ Add Custom Equipment for anything not listed!`}
            </AiBubble>
            <h2 className="mb-1 text-xl font-bold text-white">🔌 Your Equipment</h2>
            <p className="mb-4 text-sm text-slate-400">Select equipment in each room — use "Add Custom" for unlisted items</p>

            {/* Room Tabs */}
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
              {expandedRooms.map(room => {
                const roomEqCount = room.equipment.filter(eq => {
                  const key = eqKey(room.instanceId, eq.id);
                  return (equipment[key] || getDefaultEquipmentState(eq.id)).enabled;
                }).length + (customEquipment[room.instanceId] || []).filter(ceq => {
                  const key = eqKey(room.instanceId, `custom-${ceq.id}`);
                  return (equipment[key])?.enabled;
                }).length;
                return (
                  <button key={room.instanceId} onClick={() => setActiveRoom(room.instanceId)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      activeRoom === room.instanceId ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}>
                    <span className="text-sm">{room.icon}</span>
                    <span className="whitespace-nowrap">{room.name}</span>
                    {roomEqCount > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">{roomEqCount}</span>}
                  </button>
                );
              })}
            </div>

            {/* Equipment Cards */}
            {expandedRooms.filter(r => r.instanceId === activeRoom).map(room => (
              <div key={room.instanceId} className="space-y-3">
                {room.totalInstances > 1 && room.instanceNum === 1 && (
                  <div className="flex items-center justify-between rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-2">
                    <span className="text-xs text-blue-300">💡 Configure this room first, then copy to all others</span>
                    <button onClick={() => copyToAllInstances(room.instanceId, room.roomTypeId)}
                      className="shrink-0 rounded-lg bg-blue-500/20 px-3 py-1.5 text-xs font-medium text-blue-300 hover:bg-blue-500/30">
                      📋 Copy to all {room.totalInstances - 1} others
                    </button>
                  </div>
                )}

                {/* Regular Equipment */}
                {room.equipment.map(eq => {
                  const key = eqKey(room.instanceId, eq.id);
                  const state = getEqState(key, eq.id);
                  const wattage = eq.getWattage(state.selections, state.quantity);
                  return (
                    <div key={key} className={`overflow-hidden rounded-xl border transition-all ${state.enabled ? 'border-emerald-500/50 bg-slate-800/80' : 'border-slate-700/50 bg-slate-800/30'}`}>
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{eq.icon}</span>
                          <span className={`text-sm font-semibold ${state.enabled ? 'text-white' : 'text-slate-400'}`}>{eq.name}</span>
                        </div>
                        <ToggleSwitch checked={state.enabled} onChange={() => toggleEquipment(key, eq.id)} />
                      </div>
                      {state.enabled && (
                        <div className="border-t border-slate-700/50 px-4 py-4">
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {eq.fields.map(field => (
                              <div key={field.key}>
                                <label className="mb-1 block text-xs font-medium text-slate-400">{field.label}</label>
                                <select value={state.selections[field.key] || ''} onChange={e => updateEquipmentField(key, eq.id, field.key, e.target.value)}
                                  className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none">
                                  <option value="" disabled>Select</option>
                                  {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                              </div>
                            ))}
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-400">Quantity</label>
                              <div className="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-700 px-2 py-1">
                                <button onClick={() => updateQuantity(key, eq.id, -1)} className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-600 text-white hover:bg-slate-500">−</button>
                                <span className="min-w-[2rem] text-center text-sm font-bold text-white">{state.quantity}</span>
                                <button onClick={() => updateQuantity(key, eq.id, 1)} className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-600 text-white hover:bg-slate-500">+</button>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between rounded-lg bg-emerald-500/10 px-4 py-2">
                            <span className="text-xs text-emerald-400">Estimated Power</span>
                            <span className="text-lg font-bold text-emerald-400">{wattage > 0 ? `${wattage} W` : '-- W'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Custom Equipment Cards */}
                {(customEquipment[room.instanceId] || []).map(ceq => {
                  const eqDef = customToEqDef(ceq);
                  const key = eqKey(room.instanceId, eqDef.id);
                  const state = getEqState(key, eqDef.id);
                  return (
                    <div key={key} className={`overflow-hidden rounded-xl border transition-all ${state.enabled ? 'border-purple-500/50 bg-slate-800/80' : 'border-slate-700/50 bg-slate-800/30'}`}>
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{ceq.icon}</span>
                          <div>
                            <span className={`text-sm font-semibold ${state.enabled ? 'text-white' : 'text-slate-400'}`}>{ceq.name}</span>
                            <span className="ml-2 rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] text-purple-300">Custom • {ceq.wattage}W</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => removeCustomEq(room.instanceId, ceq.id)} className="rounded-md p-1 text-slate-400 hover:text-red-400" title="Remove">✕</button>
                          <ToggleSwitch checked={state.enabled} onChange={() => toggleEquipment(key, eqDef.id)} />
                        </div>
                      </div>
                      {state.enabled && (
                        <div className="border-t border-slate-700/50 px-4 py-3">
                          <div className="flex items-center gap-4">
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-400">Quantity</label>
                              <div className="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-700 px-2 py-1">
                                <button onClick={() => updateQuantity(key, eqDef.id, -1)} className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-600 text-white hover:bg-slate-500">−</button>
                                <span className="min-w-[2rem] text-center text-sm font-bold text-white">{state.quantity}</span>
                                <button onClick={() => updateQuantity(key, eqDef.id, 1)} className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-600 text-white hover:bg-slate-500">+</button>
                              </div>
                            </div>
                            <div className="flex-1 rounded-lg bg-purple-500/10 px-4 py-2 text-right">
                              <span className="text-xs text-purple-300">Total Power</span>
                              <div className="text-lg font-bold text-purple-400">{ceq.wattage * state.quantity} W</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add Custom Equipment */}
                {showAddEquipment === room.instanceId ? (
                  <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4 animate-fadeIn">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-white">➕ Add Custom Equipment</h4>
                      <button onClick={() => setShowAddEquipment('')} className="text-slate-400 hover:text-white text-sm">✕ Close</button>
                    </div>

                    {/* Suggestions */}
                    <div className="mb-3">
                      <p className="mb-2 text-xs text-slate-400">Quick suggestions (tap to select):</p>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                        {CUSTOM_EQUIPMENT_SUGGESTIONS.map(s => (
                          <button key={s.name} onClick={() => { setNewEqName(s.name); setNewEqWattage(s.defaultWattage); setNewEqIcon(s.icon); }}
                            className={`rounded-md px-2 py-1 text-[11px] font-medium transition-all ${
                              newEqName === s.name ? 'bg-purple-500 text-white' : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600'
                            }`}>
                            {s.icon} {s.name} <span className="text-slate-400">({s.defaultWattage}W)</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Manual input */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="mb-1 block text-xs font-medium text-slate-400">Equipment Name</label>
                        <input type="text" value={newEqName} onChange={e => setNewEqName(e.target.value)} placeholder="e.g., Pumping Machine"
                          className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-400">Wattage (W)</label>
                        <input type="number" value={newEqWattage} onChange={e => setNewEqWattage(parseInt(e.target.value) || 0)} min={1} max={50000}
                          className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none" />
                      </div>
                    </div>
                    <button onClick={() => addCustomEq(room.instanceId)} disabled={!newEqName.trim() || newEqWattage <= 0}
                      className="mt-3 w-full rounded-lg bg-purple-500 py-2.5 text-sm font-bold text-white transition-all hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed">
                      ➕ Add "{newEqName || '...'}" ({newEqWattage}W)
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setShowAddEquipment(room.instanceId); setNewEqName(''); setNewEqWattage(100); }}
                    className="w-full rounded-xl border-2 border-dashed border-slate-600 py-3 text-sm font-medium text-slate-400 transition-all hover:border-purple-500/50 hover:text-purple-400 hover:bg-purple-500/5">
                    ➕ Add Custom Equipment
                  </button>
                )}
              </div>
            ))}

            {/* Total Summary */}
            {activeEquipment.length > 0 && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400">Total Equipment</div>
                    <div className="text-lg font-bold text-white">{activeEquipment.length} items across {new Set(activeEquipment.map(a => a.roomName)).size} rooms</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Total Power Load</div>
                    <div className="text-xl font-bold text-emerald-400">{energyProfile.totalWatts.toLocaleString()} W</div>
                  </div>
                </div>
              </div>
            )}
            <NavButtons onBack={() => goToStep(2)} onNext={() => goToStep(4)} nextDisabled={!canProceed(3)} nextLabel="Set Usage Times →" />
          </StepCard>
        )}

        {/* =============== STEP 4: Usage Patterns =============== */}
        {currentStep === 4 && (
          <StepCard>
            <AiBubble>
              ⏰ Now set <strong>when</strong> and <strong>how often</strong> you use each equipment. You can add <strong>multiple time periods</strong> (e.g., microwave in morning AND evening), and specify <strong>days per week</strong>. This is key for accurate solar sizing!
            </AiBubble>
            <h2 className="mb-1 text-xl font-bold text-white">⏰ Usage Patterns</h2>
            <p className="mb-2 text-sm text-slate-400">Solar hours: {formatHour(sunStart)} — {formatHour(sunEnd)}</p>

            <div className="mb-4 flex items-center gap-4 rounded-lg bg-slate-800/50 px-4 py-2 text-xs">
              <div className="flex items-center gap-1.5"><div className="h-3 w-6 rounded bg-amber-400/60" /><span className="text-slate-300">☀️ Solar</span></div>
              <div className="flex items-center gap-1.5"><div className="h-3 w-6 rounded bg-indigo-500/50" /><span className="text-slate-300">🌙 Battery</span></div>
              <div className="flex items-center gap-1.5"><div className="h-3 w-6 rounded bg-slate-700" /><span className="text-slate-300">Off</span></div>
            </div>

            {activeEquipment.length === 0 ? (
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-8 text-center">
                <p className="text-slate-400">No equipment selected. Go back to add equipment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeEquipment.map(({ eq, state, roomName, wattage, key }) => {
                  const usageHrs = getUsageHoursMultiSlot(state.timeSlots);
                  const solarHrs = getSolarOverlapMultiSlot(state.timeSlots, sunStart, sunEnd);
                  const battHrs = getBatteryHoursMultiSlot(state.timeSlots, sunStart, sunEnd);
                  const dayFactor = state.daysPerWeek / 7;
                  const dailyKwhItem = (wattage * usageHrs * dayFactor) / 1000;

                  return (
                    <div key={key} className="rounded-xl border border-slate-700/50 bg-slate-800/50 overflow-hidden">
                      <div className="flex items-center justify-between p-4 pb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{eq.icon}</span>
                          <div>
                            <div className="text-sm font-semibold text-white">{eq.name} {state.quantity > 1 ? `(×${state.quantity})` : ''}</div>
                            <div className="text-xs text-slate-400">{roomName} • {wattage}W</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-emerald-400">{dailyKwhItem.toFixed(2)} kWh/day</div>
                          <div className="text-[10px] text-slate-400">{usageHrs}h × {state.daysPerWeek}d/wk</div>
                        </div>
                      </div>

                      <div className="px-4 pb-4 space-y-3">

                        {/* ===== DAYS PER WEEK ===== */}
                        <div>
                          <label className="mb-1.5 block text-[10px] font-medium text-slate-400 uppercase tracking-wider">📅 How often?</label>
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {DAYS_PER_WEEK_PRESETS.map(preset => (
                              <button key={preset.id} onClick={() => updateDaysPerWeek(key, eq.id, preset.days)}
                                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                                  state.daysPerWeek === preset.days ? 'bg-emerald-500 text-white' : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600'
                                }`}>{preset.label}</button>
                            ))}
                            {/* Custom stepper */}
                            <div className="flex items-center gap-1 rounded-md border border-slate-600 bg-slate-700 px-1 py-0.5 ml-1">
                              <button onClick={() => updateDaysPerWeek(key, eq.id, state.daysPerWeek - 1)}
                                className="flex h-5 w-5 items-center justify-center rounded text-xs text-white hover:bg-slate-600">−</button>
                              <span className="min-w-[1.5rem] text-center text-xs font-bold text-emerald-400">{state.daysPerWeek}</span>
                              <button onClick={() => updateDaysPerWeek(key, eq.id, state.daysPerWeek + 1)}
                                className="flex h-5 w-5 items-center justify-center rounded text-xs text-white hover:bg-slate-600">+</button>
                              <span className="text-[10px] text-slate-400 ml-0.5">d/wk</span>
                            </div>
                          </div>
                        </div>

                        {/* ===== TIME PRESETS ===== */}
                        <div>
                          <label className="mb-1.5 block text-[10px] font-medium text-slate-400 uppercase tracking-wider">⏰ When?</label>
                          <div className="flex flex-wrap gap-1.5">
                            {USAGE_PRESETS.map(preset => {
                              const isActive = preset.id === '24h'
                                ? state.timeSlots.some(s => s.is24h)
                                : state.timeSlots.length === 1 && !state.timeSlots[0].is24h && state.timeSlots[0].start === preset.start && state.timeSlots[0].end === preset.end;
                              return (
                                <button key={preset.id} onClick={() => {
                                  if (preset.id === '24h') {
                                    updateTimeSlot(key, eq.id, 0, 0, 0, true);
                                  } else {
                                    updateTimeSlot(key, eq.id, 0, preset.start, preset.end, false);
                                    // Remove extra slots when selecting a preset
                                    setEquipment(prev => {
                                      const cur = prev[key];
                                      if (cur && cur.timeSlots.length > 1) {
                                        return { ...prev, [key]: { ...cur, timeSlots: [{ start: preset.start, end: preset.end, is24h: false }] } };
                                      }
                                      return prev;
                                    });
                                  }
                                }}
                                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                                    isActive ? 'bg-emerald-500 text-white' : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600'
                                  }`}>{preset.label}</button>
                              );
                            })}
                          </div>
                        </div>

                        {/* ===== TIME SLOTS ===== */}
                        {!state.timeSlots.some(s => s.is24h) && (
                          <div className="space-y-2">
                            {state.timeSlots.map((slot, slotIdx) => (
                              <div key={slotIdx} className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 w-6">#{slotIdx + 1}</span>
                                <select value={slot.start} onChange={e => updateTimeSlot(key, eq.id, slotIdx, parseInt(e.target.value), slot.end, false)}
                                  className="flex-1 rounded-lg border border-slate-600 bg-slate-700 px-2 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none">
                                  {HOUR_OPTIONS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
                                </select>
                                <span className="text-slate-400 font-bold text-xs">→</span>
                                <select value={slot.end} onChange={e => updateTimeSlot(key, eq.id, slotIdx, slot.start, parseInt(e.target.value), false)}
                                  className="flex-1 rounded-lg border border-slate-600 bg-slate-700 px-2 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none">
                                  {HOUR_OPTIONS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
                                </select>
                                {state.timeSlots.length > 1 && (
                                  <button onClick={() => removeTimeSlot(key, eq.id, slotIdx)}
                                    className="flex h-6 w-6 items-center justify-center rounded-md bg-red-500/20 text-red-400 text-xs hover:bg-red-500/40">✕</button>
                                )}
                              </div>
                            ))}
                            {state.timeSlots.length < 4 && (
                              <button onClick={() => addTimeSlot(key, eq.id)}
                                className="w-full rounded-md border border-dashed border-slate-600 py-1.5 text-[11px] text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400 transition-all">
                                ➕ Add another time period (e.g., morning & evening)
                              </button>
                            )}
                          </div>
                        )}

                        {/* 24h timeline */}
                        <div>
                          <div className="flex h-7 overflow-hidden rounded-lg">
                            {Array.from({ length: 24 }, (_, h) => {
                              const isUsed = isHourInAnySlot(h, state.timeSlots);
                              const isSolar = h >= sunStart && h < sunEnd;
                              let bg = 'bg-slate-800/80';
                              if (isUsed && isSolar) bg = 'bg-amber-400/70';
                              else if (isUsed && !isSolar) bg = 'bg-indigo-500/60';
                              else if (!isUsed && isSolar) bg = 'bg-slate-700/50';
                              return (
                                <div key={h} className={`flex-1 border-r border-slate-900/30 ${bg} flex items-center justify-center transition-colors`}
                                  title={`${formatHour(h)} - ${isUsed ? 'In use' : 'Off'} (${isSolar ? 'Solar' : 'Night'})`}>
                                  {(h === 0 || h === 6 || h === 12 || h === 18) && (
                                    <span className="text-[8px] font-bold text-white/60">
                                      {h === 0 ? '🌙' : h === 6 ? '🌅' : h === 12 ? '☀️' : '🌆'}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-1 flex justify-between text-[9px] text-slate-500">
                            <span>12AM</span><span>6AM</span><span>12PM</span><span>6PM</span><span>12AM</span>
                          </div>
                        </div>

                        {/* Solar/Battery split */}
                        <div className="flex gap-2">
                          <div className="flex-1 rounded-lg bg-amber-500/10 px-3 py-1.5 text-center">
                            <div className="text-[10px] text-amber-300">☀️ Solar</div>
                            <div className="text-sm font-bold text-amber-400">{solarHrs}h</div>
                          </div>
                          <div className="flex-1 rounded-lg bg-indigo-500/10 px-3 py-1.5 text-center">
                            <div className="text-[10px] text-indigo-300">🌙 Battery</div>
                            <div className="text-sm font-bold text-indigo-400">{battHrs}h</div>
                          </div>
                          <div className="flex-1 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-center">
                            <div className="text-[10px] text-emerald-300">⚡ Total</div>
                            <div className="text-sm font-bold text-emerald-400">{usageHrs}h</div>
                          </div>
                          <div className="flex-1 rounded-lg bg-slate-700/50 px-3 py-1.5 text-center">
                            <div className="text-[10px] text-slate-300">📅 Days</div>
                            <div className="text-sm font-bold text-white">{state.daysPerWeek}/wk</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Profile Summary */}
                <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-amber-500/5 to-indigo-500/5 p-4">
                  <h3 className="mb-3 text-sm font-bold text-white">📊 Energy Profile Summary</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-lg bg-slate-800/60 p-3 text-center">
                      <div className="text-[10px] text-slate-400 uppercase">Total Load</div>
                      <div className="mt-1 text-lg font-bold text-white">{energyProfile.totalWatts.toLocaleString()}W</div>
                    </div>
                    <div className="rounded-lg bg-amber-500/10 p-3 text-center">
                      <div className="text-[10px] text-amber-300 uppercase">☀️ Solar</div>
                      <div className="mt-1 text-lg font-bold text-amber-400">{energyProfile.solarKwh.toFixed(1)} kWh</div>
                      <div className="text-[10px] text-amber-300/60">{(energyProfile.solarRatio * 100).toFixed(0)}%</div>
                    </div>
                    <div className="rounded-lg bg-indigo-500/10 p-3 text-center">
                      <div className="text-[10px] text-indigo-300 uppercase">🌙 Battery</div>
                      <div className="mt-1 text-lg font-bold text-indigo-400">{energyProfile.batteryKwh.toFixed(1)} kWh</div>
                    </div>
                    <div className="rounded-lg bg-emerald-500/10 p-3 text-center">
                      <div className="text-[10px] text-emerald-300 uppercase">⚡ Avg Daily</div>
                      <div className="mt-1 text-lg font-bold text-emerald-400">{energyProfile.dailyKwh.toFixed(1)} kWh</div>
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg bg-slate-800/40 p-3">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {energyProfile.solarRatio > 0.6 ? '💡 Most usage is during solar hours — more panels, fewer batteries = lower cost!'
                       : energyProfile.solarRatio > 0.35 ? '💡 Balanced day/night usage. Good mix of panels and batteries.'
                       : '💡 Heavy evening/night usage. Consider shifting some appliance use to daytime to reduce battery costs.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <NavButtons onBack={() => goToStep(3)} onNext={() => goToStep(5)} nextLabel="View Analysis →" />
          </StepCard>
        )}

        {/* =============== STEP 5: Energy Analysis =============== */}
        {currentStep === 5 && (
          <StepCard>
            <AiBubble>🎉 Analysis complete! Here's your comprehensive energy profile with hourly consumption patterns.</AiBubble>
            <h2 className="mb-6 text-xl font-bold text-white">📊 Your Energy Profile</h2>

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Peak Load', value: `${energyProfile.totalWatts.toLocaleString()} W`, sub: `Peak hour: ${peakHourLoad.toLocaleString()}W`, color: 'from-blue-500 to-cyan-500' },
                { label: 'Avg Daily', value: `${energyProfile.dailyKwh.toFixed(1)} kWh`, sub: `${activeEquipment.length} items`, color: 'from-emerald-500 to-teal-500' },
                { label: 'Monthly', value: `${monthlyKwh.toFixed(0)} kWh`, sub: `${(monthlyKwh * 12).toFixed(0)} kWh/yr`, color: 'from-amber-500 to-orange-500' },
                { label: 'Solar Ratio', value: `${(energyProfile.solarRatio * 100).toFixed(0)}%`, sub: energyProfile.solarRatio > 0.6 ? '🎯 Great!' : '⚖️ Balanced', color: 'from-purple-500 to-pink-500' },
              ].map(card => (
                <div key={card.label} className={`rounded-xl bg-gradient-to-br ${card.color} p-4 text-white shadow-lg`}>
                  <div className="text-[10px] font-medium opacity-80 uppercase tracking-wider">{card.label}</div>
                  <div className="mt-1 text-xl font-bold">{card.value}</div>
                  <div className="mt-0.5 text-[10px] opacity-70">{card.sub}</div>
                </div>
              ))}
            </div>

            {/* 24-Hour Load Profile */}
            <div className="mb-6 rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
              <h3 className="mb-1 text-sm font-bold text-white">⏰ 24-Hour Load Profile</h3>
              <p className="mb-4 text-xs text-slate-400">Average power consumption by hour</p>
              <div className="flex items-end gap-[2px] h-36">
                {hourlyProfile.map((hour, h) => {
                  const maxW = peakHourLoad || 1;
                  const totalPct = (hour.totalWatts / maxW) * 100;
                  const solarPct = (hour.solarWatts / maxW) * 100;
                  return (
                    <div key={h} className="group relative flex-1 flex flex-col items-stretch justify-end h-full" title={`${formatHour(h)}: ${hour.totalWatts}W`}>
                      <div className="flex flex-col justify-end h-full">
                        {hour.batteryWatts > 0 && <div className="bg-indigo-500/70 rounded-t-sm transition-all" style={{ height: `${totalPct - solarPct}%`, minHeight: '2px' }} />}
                        {hour.solarWatts > 0 && <div className={`bg-amber-400/80 ${hour.batteryWatts === 0 ? 'rounded-t-sm' : ''} transition-all`} style={{ height: `${solarPct}%`, minHeight: '2px' }} />}
                        {hour.totalWatts === 0 && <div className="bg-slate-700/30 rounded-t-sm" style={{ height: '3px' }} />}
                      </div>
                      {(h % 3 === 0) && (
                        <div className={`mt-1 text-center text-[8px] ${h >= sunStart && h < sunEnd ? 'text-amber-400/60' : 'text-slate-500'}`}>
                          {h === 0 ? '12a' : h === 6 ? '6a' : h === 9 ? '9a' : h === 12 ? '12p' : h === 15 ? '3p' : h === 18 ? '6p' : h === 21 ? '9p' : ''}
                        </div>
                      )}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[10px] text-white shadow-xl border border-slate-600">
                        <div className="font-bold">{formatHour(h)}</div>
                        <div>{hour.totalWatts.toLocaleString()}W</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 flex justify-center gap-4 text-xs">
                <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-5 rounded bg-amber-400/80" /> Solar</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-5 rounded bg-indigo-500/70" /> Battery/Grid</span>
              </div>
            </div>

            {/* Solar/Battery Split */}
            <div className="mb-6 rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
              <h3 className="mb-3 text-sm font-bold text-white">☀️ Solar vs 🌙 Battery Split</h3>
              <div className="h-7 flex overflow-hidden rounded-full">
                <div className="bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center text-[10px] font-bold text-slate-900"
                  style={{ width: `${Math.max(energyProfile.solarRatio * 100, 8)}%` }}>☀️ {(energyProfile.solarRatio * 100).toFixed(0)}%</div>
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ width: `${Math.max((1 - energyProfile.solarRatio) * 100, 8)}%` }}>🌙 {((1 - energyProfile.solarRatio) * 100).toFixed(0)}%</div>
              </div>
            </div>

            {/* Top Consumers */}
            {topConsumers.length > 0 && (
              <div className="mb-6 rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                <h3 className="mb-3 text-sm font-bold text-white">🔥 Top Energy Consumers</h3>
                <div className="space-y-2">
                  {topConsumers.map((item, idx) => {
                    const pct = energyProfile.dailyKwh > 0 ? (item.dailyKwh / energyProfile.dailyKwh) * 100 : 0;
                    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
                    return (
                      <div key={item.key} className="flex items-center gap-3">
                        <span className="text-sm">{medals[idx]}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs text-white font-medium">{item.eq.icon} {item.eq.name}</span>
                            <span className="text-xs font-bold text-emerald-400">{item.dailyKwh.toFixed(2)} kWh/day</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                            <div className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" style={{ width: `${pct}%` }} />
                          </div>
                          <div className="mt-0.5 flex justify-between text-[10px] text-slate-400">
                            <span>{item.roomName} • {item.wattage}W • {item.state.daysPerWeek}d/wk</span>
                            <span>{pct.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Room Breakdown */}
            <div className="mb-4 rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
              <h3 className="mb-4 text-sm font-bold text-white">🏠 Room-by-Room Breakdown</h3>
              {expandedRooms.map(room => {
                const roomItems = activeEquipment.filter(item => item.roomName === room.name);
                if (roomItems.length === 0) return null;
                const roomWattage = roomItems.reduce((sum, item) => sum + item.wattage, 0);
                const roomKwh = roomItems.reduce((sum, item) => {
                  const hrs = getUsageHoursMultiSlot(item.state.timeSlots);
                  return sum + (item.wattage * hrs * item.state.daysPerWeek / 7) / 1000;
                }, 0);
                const pct = energyProfile.totalWatts > 0 ? (roomWattage / energyProfile.totalWatts) * 100 : 0;
                return (
                  <div key={room.instanceId} className="mb-4 last:mb-0">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm text-white">{room.icon} {room.name} <span className="text-slate-500 text-xs">({roomItems.length})</span></span>
                      <span className="text-sm font-semibold text-emerald-400">{roomWattage}W • {roomKwh.toFixed(1)} kWh</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-700">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Equipment Table */}
            <div className="overflow-hidden rounded-xl border border-slate-700/50">
              <div className="px-4 py-3 bg-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">📋 Full Equipment List</h3>
                <span className="text-xs text-slate-400">{activeEquipment.length} items</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-400">Equipment</th>
                      <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-400">Room</th>
                      <th className="px-3 py-2.5 text-right text-xs font-medium text-slate-400">W</th>
                      <th className="px-3 py-2.5 text-right text-xs font-medium text-slate-400">d/wk</th>
                      <th className="px-3 py-2.5 text-right text-xs font-medium text-amber-400">☀️</th>
                      <th className="px-3 py-2.5 text-right text-xs font-medium text-indigo-400">🌙</th>
                      <th className="px-3 py-2.5 text-right text-xs font-medium text-emerald-400">kWh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50 bg-slate-800/30">
                    {activeEquipment.map(({ eq, state, roomName, wattage, key }) => {
                      const hrs = getUsageHoursMultiSlot(state.timeSlots);
                      const sH = getSolarOverlapMultiSlot(state.timeSlots, sunStart, sunEnd);
                      const bH = hrs - sH;
                      const dayFactor = state.daysPerWeek / 7;
                      return (
                        <tr key={key} className="hover:bg-slate-700/30">
                          <td className="px-3 py-2 text-white text-xs">{eq.icon} {eq.name} {state.quantity > 1 ? <span className="text-emerald-400">×{state.quantity}</span> : ''}</td>
                          <td className="px-3 py-2 text-slate-400 text-xs">{roomName}</td>
                          <td className="px-3 py-2 text-right text-slate-300 text-xs font-medium">{wattage.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right text-slate-300 text-xs">{state.daysPerWeek}</td>
                          <td className="px-3 py-2 text-right text-amber-400 text-xs">{sH}h</td>
                          <td className="px-3 py-2 text-right text-indigo-400 text-xs">{bH}h</td>
                          <td className="px-3 py-2 text-right font-bold text-emerald-400 text-xs">{((wattage * hrs * dayFactor) / 1000).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-800 border-t-2 border-emerald-500/30">
                    <tr>
                      <td colSpan={2} className="px-3 py-3 font-bold text-white text-xs">TOTAL</td>
                      <td className="px-3 py-3 text-right font-bold text-white text-xs">{energyProfile.totalWatts.toLocaleString()}W</td>
                      <td className="px-3 py-3 text-right text-xs text-slate-400">—</td>
                      <td className="px-3 py-3 text-right font-bold text-amber-400 text-xs">{energyProfile.solarKwh.toFixed(1)}</td>
                      <td className="px-3 py-3 text-right font-bold text-indigo-400 text-xs">{energyProfile.batteryKwh.toFixed(1)}</td>
                      <td className="px-3 py-3 text-right font-bold text-emerald-400 text-xs">{energyProfile.dailyKwh.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <NavButtons onBack={() => goToStep(4)} onNext={() => goToStep(6)} nextLabel="Calculate Costs 💰" />
          </StepCard>
        )}

        {/* =============== STEP 6: Costs & Generator =============== */}
        {currentStep === 6 && selectedCountry && (
          <StepCard>
            <AiBubble>💰 Let's calculate your real energy costs — grid electricity, generator expenses, and show where solar saves money!</AiBubble>
            <h2 className="mb-1 text-xl font-bold text-white">📍 Location & Utility Costs</h2>
            <p className="mb-6 text-sm text-slate-400">Your tariffs, fuel prices, and solar irradiance</p>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">State/Region</label>
                <select value={selectedState} onChange={e => setSelectedState(e.target.value)} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none">
                  <option value="">Select your state/region</option>
                  {selectedCountry.states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">Power Company</label>
                <select value={selectedDisco} onChange={e => setSelectedDisco(e.target.value)} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none">
                  <option value="">Select power company</option>
                  {selectedCountry.powerCompanies.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">Tariff Band</label>
                <select value={selectedTariff} onChange={e => setSelectedTariff(parseFloat(e.target.value))} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none">
                  <option value={0}>Select tariff band</option>
                  {selectedCountry.tariffBands.map(t => <option key={t.label} value={t.rate}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">Daily power supply: <span className="text-emerald-400">{powerHours}h</span></label>
                <input type="range" min={0} max={24} value={powerHours} onChange={e => setPowerHours(parseInt(e.target.value))} className="mt-1 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-emerald-500" />
                <div className="mt-1 flex justify-between text-xs text-slate-500"><span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>24h</span></div>
              </div>
            </div>

            {powerHours < 24 && (
              <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                <h3 className="mb-2 text-sm font-bold text-white">⚡ Power Supply Gap</h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-4 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 flex items-center justify-center text-[9px] font-bold text-white" style={{ width: `${(powerHours / 24) * 100}%` }}>{powerHours}h</div>
                    <div className="bg-red-500/60 flex items-center justify-center text-[9px] font-bold text-white" style={{ width: `${((24 - powerHours) / 24) * 100}%` }}>{24 - powerHours}h gap</div>
                  </div>
                </div>
              </div>
            )}

            {selectedTariff > 0 && (
              <div className="mt-6 rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
                <h3 className="mb-3 text-sm font-bold text-white">💡 Grid Electricity Cost</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-slate-800/50 p-3 text-center">
                    <div className="text-xs text-slate-400">Daily</div>
                    <div className="mt-1 text-sm font-bold text-white">{formatCurrency(Math.round(energyProfile.dailyKwh * gridRatio * selectedTariff))}</div>
                  </div>
                  <div className="rounded-lg bg-slate-800/50 p-3 text-center">
                    <div className="text-xs text-slate-400">Monthly</div>
                    <div className="mt-1 text-sm font-bold text-amber-400">{formatCurrency(monthlyElecCost)}</div>
                  </div>
                  <div className="rounded-lg bg-slate-800/50 p-3 text-center">
                    <div className="text-xs text-slate-400">Annual</div>
                    <div className="mt-1 text-sm font-bold text-red-400">{formatCurrency(monthlyElecCost * 12)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Generator */}
            <div className="mt-6 rounded-xl border border-slate-700/50 bg-slate-800/50 overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">⛽</span>
                  <span className="text-sm font-semibold text-white">Do you use a Generator?</span>
                </div>
                <ToggleSwitch checked={generator.enabled} onChange={() => setGenerator(prev => ({ ...prev, enabled: !prev.enabled }))} />
              </div>
              {generator.enabled && (
                <div className="border-t border-slate-700/50 p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-400">Generator Size</label>
                      <select value={generator.size} onChange={e => setGenerator(prev => ({ ...prev, size: e.target.value }))} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none">
                        {GENERATOR_SIZES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-400">Fuel Type</label>
                      <select value={generator.fuelType} onChange={e => setGenerator(prev => ({ ...prev, fuelType: e.target.value }))} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:outline-none">
                        <option value="petrol">Petrol</option><option value="diesel">Diesel</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-400">Frequency</label>
                      <select value={generator.frequency} onChange={e => setGenerator(prev => ({ ...prev, frequency: e.target.value }))} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:outline-none">
                        <option value="daily">Daily</option><option value="weekdays">Weekdays</option><option value="weekends">Weekends</option><option value="few-times">Few times/wk</option><option value="rarely">Rarely</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-slate-400">Hours/day: <span className="font-bold text-emerald-400">{generator.hoursPerDay}h</span></label>
                    <input type="range" min={1} max={24} value={generator.hoursPerDay} onChange={e => setGenerator(prev => ({ ...prev, hoursPerDay: parseInt(e.target.value) }))} className="h-2 w-full accent-emerald-500 rounded-full bg-slate-700" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">⛽ Fuel Costs</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="mb-1 block text-xs text-slate-400">{selectedCountry.currencySymbol}/L</label>
                      <input type="number" value={generator.fuelPrice} onChange={e => setGenerator(prev => ({ ...prev, fuelPrice: parseFloat(e.target.value) || 0 }))} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-slate-400">Litres/Fill</label>
                      <input type="number" value={generator.litresPerFill} onChange={e => setGenerator(prev => ({ ...prev, litresPerFill: parseFloat(e.target.value) || 0 }))} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-slate-400">Fills/Week</label>
                      <select value={generator.fillsPerWeek} onChange={e => setGenerator(prev => ({ ...prev, fillsPerWeek: parseInt(e.target.value) }))} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:outline-none">
                        {[1,2,3,4,5,7].map(n => <option key={n} value={n}>{n === 7 ? 'Daily' : `${n}×`}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 space-y-1">
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Weekly</span><span className="font-semibold text-white">{formatCurrency(generatorCosts.weekly)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Monthly</span><span className="font-semibold text-amber-400">{formatCurrency(generatorCosts.monthly)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Annual</span><span className="font-semibold text-red-400">{formatCurrency(generatorCosts.annual)}</span></div>
                  </div>
                  <h4 className="text-sm font-semibold text-white">🔧 Monthly Maintenance</h4>
                  <input type="number" value={generator.maintenance} onChange={e => setGenerator(prev => ({ ...prev, maintenance: parseFloat(e.target.value) || 0 }))} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:outline-none" />
                  <div className="flex gap-2 flex-wrap">
                    {[5000, 10000, 15000, 20000].map(v => (
                      <button key={v} onClick={() => setGenerator(prev => ({ ...prev, maintenance: v }))}
                        className={`rounded-md px-3 py-1 text-xs font-medium ${generator.maintenance === v ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-slate-300 hover:bg-slate-500'}`}>
                        {formatCurrency(v)}
                      </button>
                    ))}
                  </div>
                  <div className="rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 p-4">
                    <div className="flex justify-between text-base">
                      <span className="font-semibold text-white">Total Monthly Generator</span>
                      <span className="text-lg font-bold text-red-400">{formatCurrency(generatorCosts.totalMonthly)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {(selectedTariff > 0 || generator.enabled) && (() => {
              const totalMo = monthlyElecCost + generatorCosts.totalMonthly;
              const totalYr = totalMo * 12;
              const total5 = totalYr * 5;
              return (
                <div className="mt-6 space-y-4">
                  <div className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 border border-emerald-500/30 p-5">
                    <h3 className="mb-4 text-sm font-bold text-white">📊 Total Energy Cost Summary</h3>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                        <div className="text-[10px] text-amber-300 uppercase">Monthly</div>
                        <div className="mt-1 text-xl font-bold text-amber-400">{formatCurrency(totalMo)}</div>
                      </div>
                      <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                        <div className="text-[10px] text-red-300 uppercase">Annual</div>
                        <div className="mt-1 text-xl font-bold text-red-400">{formatCurrency(totalYr)}</div>
                      </div>
                      <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                        <div className="text-[10px] text-red-300 uppercase">5 Years</div>
                        <div className="mt-1 text-xl font-bold text-red-400">{formatCurrency(total5)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/30 p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💡</span>
                      <div>
                        <h4 className="text-sm font-bold text-emerald-400">Why Solar?</h4>
                        <p className="mt-1 text-xs text-slate-300">
                          You spend <strong className="text-white">{formatCurrency(totalYr)}/year</strong> on energy.
                          Over 5 years = <strong className="text-red-400">{formatCurrency(total5)}</strong>.
                          {generator.enabled && ` Generator alone: ${formatCurrency(generatorCosts.totalMonthly * 12)}/yr — solar eliminates this.`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
            <NavButtons onBack={() => goToStep(5)} onNext={() => goToStep(7)} nextLabel="Solar Options ☀️" />
          </StepCard>
        )}

        {/* =============== STEP 7: Solar =============== */}
        {currentStep === 7 && selectedCountry && (() => {
          const totalCurrentMonthly = monthlyElecCost + generatorCosts.totalMonthly;
          const totalCurrentAnnual = totalCurrentMonthly * 12;
          return (
          <StepCard>
            <AiBubble>🌞 Based on your {energyProfile.totalWatts.toLocaleString()}W peak load and {energyProfile.dailyKwh.toFixed(1)} kWh daily usage ({(energyProfile.solarRatio * 100).toFixed(0)}% during solar hours), I've sized three solar packages optimized for your usage patterns!</AiBubble>
            <h2 className="mb-2 text-xl font-bold text-white">☀️ Solar System Recommendations</h2>

            {/* Sizing Intelligence Card */}
            <div className="mb-6 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-indigo-500/5 p-4">
              <h3 className="mb-2 text-sm font-bold text-white">🧠 Smart Sizing Intelligence</h3>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="rounded-lg bg-slate-800/50 p-2 text-center">
                  <div className="text-[10px] text-amber-300">☀️ Daytime Load</div>
                  <div className="text-sm font-bold text-amber-400">{energyProfile.solarKwh.toFixed(1)} kWh</div>
                  <div className="text-[10px] text-slate-400">{(energyProfile.solarRatio * 100).toFixed(0)}% of total</div>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-2 text-center">
                  <div className="text-[10px] text-indigo-300">🌙 Nighttime Load</div>
                  <div className="text-sm font-bold text-indigo-400">{energyProfile.batteryKwh.toFixed(1)} kWh</div>
                  <div className="text-[10px] text-slate-400">{((1 - energyProfile.solarRatio) * 100).toFixed(0)}% of total</div>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-2 text-center">
                  <div className="text-[10px] text-emerald-300">☀️ Sun Hours</div>
                  <div className="text-sm font-bold text-emerald-400">{selectedCountry.sunHours}h/day</div>
                  <div className="text-[10px] text-slate-400">{formatHour(sunStart)}-{formatHour(sunEnd)}</div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {energyProfile.solarRatio > 0.6
                  ? '🎯 Great news! Most of your power usage happens during solar hours. This means more panels, fewer batteries — reducing your total cost and maximizing direct solar usage.'
                  : energyProfile.solarRatio > 0.35
                  ? '⚖️ Your usage is balanced between day and night. The system is sized with adequate panels for daytime and sufficient batteries for evening/night use.'
                  : '🌙 Most of your usage is in the evening/night. The system prioritizes battery storage to ensure reliable power after sunset. Consider shifting some usage to daytime to reduce costs.'}
              </p>
            </div>

            {/* Current Cost vs Solar Comparison */}
            {totalCurrentMonthly > 0 && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <h3 className="mb-3 text-sm font-bold text-white">💸 Your Current Energy Spending</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {monthlyElecCost > 0 && (
                    <div className="rounded-lg bg-slate-800/50 p-3 text-center">
                      <div className="text-[10px] text-slate-400">Grid Electricity</div>
                      <div className="text-sm font-bold text-amber-400">{formatCurrency(monthlyElecCost)}/mo</div>
                    </div>
                  )}
                  {generator.enabled && (
                    <div className="rounded-lg bg-slate-800/50 p-3 text-center">
                      <div className="text-[10px] text-slate-400">Generator</div>
                      <div className="text-sm font-bold text-red-400">{formatCurrency(generatorCosts.totalMonthly)}/mo</div>
                    </div>
                  )}
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center">
                    <div className="text-[10px] text-red-300">Total Monthly</div>
                    <div className="text-sm font-bold text-red-400">{formatCurrency(totalCurrentMonthly)}</div>
                  </div>
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center">
                    <div className="text-[10px] text-red-300">5-Year Total</div>
                    <div className="text-sm font-bold text-red-400">{formatCurrency(totalCurrentAnnual * 5)}</div>
                  </div>
                </div>
              </div>
            )}

            {solarPackages.length === 0 ? (
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-8 text-center"><p className="text-slate-400">Complete equipment selection first.</p></div>
            ) : (
              <div className="space-y-5">
                {solarPackages.map((pkg, index) => {
                  const price = estimateSolarPrice(pkg, selectedCountry);
                  const annualSaving = totalCurrentAnnual;
                  const paybackYears = annualSaving > 0 ? price / annualSaving : 0;
                  const paybackDisplay = paybackYears > 0 ? paybackYears.toFixed(1) : '—';
                  const fiveYearSavings = (annualSaving * 5) - price;
                  const tenYearSavings = (annualSaving * 10) - price;
                  const isSelected = selectedSolarPkg === index;
                  const tierColors = [
                    { border: 'border-blue-500', bg: 'from-blue-500/10 to-blue-600/5', badge: 'bg-blue-500', accent: 'text-blue-400', ring: 'ring-blue-500/30' },
                    { border: 'border-emerald-500', bg: 'from-emerald-500/10 to-teal-500/5', badge: 'bg-emerald-500', accent: 'text-emerald-400', ring: 'ring-emerald-500/30' },
                    { border: 'border-amber-500', bg: 'from-amber-500/10 to-orange-500/5', badge: 'bg-amber-500', accent: 'text-amber-400', ring: 'ring-amber-500/30' },
                  ][index];

                  // Component cost breakdown (approximate)
                  const panelTotal = pkg.panelCount * pkg.panelWatts;
                  const systemKw = (panelTotal / 1000).toFixed(1);

                  return (
                    <div key={pkg.name}
                      onClick={() => setSelectedSolarPkg(index)}
                      className={`relative cursor-pointer rounded-2xl border-2 transition-all hover:scale-[1.005] ${
                        isSelected ? `${tierColors.border} bg-gradient-to-br ${tierColors.bg} ring-2 ${tierColors.ring} shadow-xl` : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600'
                      }`}>
                      {/* Selection indicator */}
                      <div className={`absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full transition-all ${
                        isSelected ? `${tierColors.badge} text-white text-xs font-bold` : 'border-2 border-slate-600 bg-slate-800'
                      }`}>
                        {isSelected && '✓'}
                      </div>

                      {/* Recommended badge */}
                      {index === 1 && (
                        <div className="absolute -top-3 left-6">
                          <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-emerald-500/30">⭐ Recommended</span>
                        </div>
                      )}

                      <div className="p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between pr-8">
                          <div>
                            <span className={`inline-block rounded-full ${tierColors.badge} px-4 py-1 text-sm font-bold text-white`}>
                              {index === 0 ? '🔋' : index === 1 ? '☀️' : '🏆'} {pkg.name}
                            </span>
                            <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-md">{pkg.description}</p>
                          </div>
                        </div>

                        {/* System Specs */}
                        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                          <div className="rounded-xl bg-slate-800/60 p-3">
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Solar Panels</div>
                            <div className="mt-1 text-base font-bold text-white">{pkg.panelCount} × {pkg.panelWatts}W</div>
                            <div className="text-[10px] text-slate-400">{systemKw} kW system</div>
                          </div>
                          <div className="rounded-xl bg-slate-800/60 p-3">
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Battery Storage</div>
                            <div className="mt-1 text-base font-bold text-white">{pkg.batteryKwh} kWh</div>
                            <div className="text-[10px] text-slate-400">{pkg.batteryCount} unit{pkg.batteryCount > 1 ? 's' : ''} (Lithium)</div>
                          </div>
                          <div className="rounded-xl bg-slate-800/60 p-3">
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Inverter</div>
                            <div className="mt-1 text-base font-bold text-white">{pkg.inverterKva} kVA</div>
                            <div className="text-[10px] text-slate-400">Hybrid MPPT</div>
                          </div>
                          <div className="rounded-xl bg-slate-800/60 p-3">
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Accessories</div>
                            <div className="mt-1 text-[11px] font-medium text-white leading-tight">MC4 cables, mounting, breakers, combiner box</div>
                          </div>
                        </div>

                        {/* Price and Savings */}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className={`rounded-xl p-4 text-center ${isSelected ? 'bg-slate-900/60 border border-slate-600' : 'bg-slate-800/40'}`}>
                            <div className="text-xs text-slate-400">System Cost (Installed)</div>
                            <div className={`mt-1 text-2xl font-bold ${tierColors.accent}`}>{formatCurrency(price)}</div>
                            <div className="mt-1 text-[10px] text-slate-400">Including installation & warranty</div>
                          </div>
                          {totalCurrentMonthly > 0 && (
                            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                              <div className="text-xs text-emerald-300">Payback Period</div>
                              <div className="mt-1 text-2xl font-bold text-emerald-400">{paybackDisplay} years</div>
                              <div className="mt-1 text-[10px] text-emerald-300/60">
                                Save {formatCurrency(totalCurrentMonthly)}/mo after payback
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Savings Timeline */}
                        {totalCurrentMonthly > 0 && (
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="rounded-lg bg-slate-800/40 p-2 text-center">
                              <div className="text-[10px] text-slate-400">Monthly Savings</div>
                              <div className="text-sm font-bold text-emerald-400">{formatCurrency(totalCurrentMonthly)}</div>
                            </div>
                            <div className="rounded-lg bg-slate-800/40 p-2 text-center">
                              <div className="text-[10px] text-slate-400">5-Year Net</div>
                              <div className={`text-sm font-bold ${fiveYearSavings > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {fiveYearSavings > 0 ? '+' : ''}{formatCurrency(fiveYearSavings)}
                              </div>
                            </div>
                            <div className="rounded-lg bg-slate-800/40 p-2 text-center">
                              <div className="text-[10px] text-slate-400">10-Year Net</div>
                              <div className="text-sm font-bold text-emerald-400">+{formatCurrency(Math.max(0, tenYearSavings))}</div>
                            </div>
                          </div>
                        )}

                        {/* Visual cost comparison bar */}
                        {totalCurrentMonthly > 0 && annualSaving > 0 && (
                          <div className="mt-3 rounded-lg bg-slate-800/40 p-3">
                            <div className="text-[10px] text-slate-400 mb-2">5-Year Cost Comparison</div>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-red-300 w-20">Without Solar</span>
                                <div className="flex-1 h-4 rounded-full bg-red-500/40 flex items-center justify-end px-2">
                                  <span className="text-[9px] font-bold text-white">{formatCurrency(totalCurrentAnnual * 5)}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-emerald-300 w-20">With Solar</span>
                                <div className="h-4 rounded-full bg-emerald-500/40 flex items-center justify-end px-2"
                                  style={{ width: `${Math.max(15, (price / (totalCurrentAnnual * 5)) * 100)}%` }}>
                                  <span className="text-[9px] font-bold text-white">{formatCurrency(price)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* What's included */}
                        <div className="mt-3 rounded-lg bg-slate-800/40 p-3">
                          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">✅ Included in Package</div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            {[
                              'Professional installation',
                              'System design & engineering',
                              'All wiring & accessories',
                              'Mounting structure',
                              'Changeover switch',
                              'System monitoring app',
                              index >= 1 ? '2-year workmanship warranty' : '1-year workmanship warranty',
                              index === 2 ? '25-year panel warranty' : '10-year panel warranty',
                            ].map((item, i) => (
                              <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                                <span className="text-emerald-400 mt-0.5">✓</span>{item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* No Generator Needed Card */}
            {generator.enabled && (
              <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🚫⛽</span>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-400">Say Goodbye to Generator Costs!</h4>
                    <p className="mt-1 text-xs text-slate-300">
                      You currently spend <strong className="text-red-400">{formatCurrency(generatorCosts.totalMonthly)}/month</strong> on generator fuel and maintenance.
                      With solar, you eliminate this entirely — that's <strong className="text-emerald-400">{formatCurrency(generatorCosts.annual)}/year</strong> saved,
                      plus no noise pollution, no fumes, and zero maintenance hassle.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <NavButtons onBack={() => goToStep(6)} onNext={() => goToStep(8)} nextLabel="Request Quote & Report 📄" />
          </StepCard>
          );
        })()}

        {/* =============== STEP 8: Report & Quote =============== */}
        {currentStep === 8 && selectedCountry && (() => {
          const chosenPkg = solarPackages[selectedSolarPkg];
          const chosenPrice = chosenPkg ? estimateSolarPrice(chosenPkg, selectedCountry) : 0;
          const totalCurrentMonthly = monthlyElecCost + generatorCosts.totalMonthly;
          return (
          <StepCard>
            {!submitted ? (
              <>
                <AiBubble>🎊 Your personalized energy report is ready! Review the summary below, fill in your details, and we'll send you a detailed report with a formal quotation for your selected solar package.</AiBubble>
                <h2 className="mb-1 text-xl font-bold text-white">📄 Your Energy Report & Quotation Request</h2>
                <p className="mb-6 text-sm text-slate-400">Review summary, then submit to receive your detailed report</p>

                {/* ===== REPORT PREVIEW ===== */}
                <div className="mb-6 rounded-2xl border border-slate-700/50 bg-slate-800/30 overflow-hidden">
                  {/* Report Header */}
                  <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-emerald-500/20 px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white">⚡ EnergiX Energy Assessment Report</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Reference</div>
                        <div className="text-xs font-mono text-emerald-400">EX-{Date.now().toString(36).toUpperCase().slice(-6)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* Section 1: Location & Space */}
                    <div>
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">📍 Location & Space</h4>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">Country</span><span className="text-white">{selectedCountry.flag} {selectedCountry.name}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Region</span><span className="text-white">{selectedState || '—'}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Space Type</span><span className="text-white">{SPACE_TYPES.find(s => s.id === selectedSpaceType)?.icon} {SPACE_TYPES.find(s => s.id === selectedSpaceType)?.name}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Rooms</span><span className="text-white">{expandedRooms.length} configured</span></div>
                      </div>
                    </div>

                    <hr className="border-slate-700/50" />

                    {/* Section 2: Energy Profile */}
                    <div>
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">⚡ Energy Profile</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="rounded-lg bg-slate-800/50 p-2.5 text-center">
                          <div className="text-[10px] text-slate-400">Equipment</div>
                          <div className="text-sm font-bold text-white">{activeEquipment.length} items</div>
                        </div>
                        <div className="rounded-lg bg-slate-800/50 p-2.5 text-center">
                          <div className="text-[10px] text-slate-400">Peak Load</div>
                          <div className="text-sm font-bold text-white">{energyProfile.totalWatts.toLocaleString()}W</div>
                        </div>
                        <div className="rounded-lg bg-amber-500/10 p-2.5 text-center">
                          <div className="text-[10px] text-amber-300">☀️ Solar kWh</div>
                          <div className="text-sm font-bold text-amber-400">{energyProfile.solarKwh.toFixed(1)}</div>
                        </div>
                        <div className="rounded-lg bg-indigo-500/10 p-2.5 text-center">
                          <div className="text-[10px] text-indigo-300">🌙 Battery kWh</div>
                          <div className="text-sm font-bold text-indigo-400">{energyProfile.batteryKwh.toFixed(1)}</div>
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <span className="text-xs text-slate-400">Daily avg:</span>
                        <span className="ml-1 text-sm font-bold text-emerald-400">{energyProfile.dailyKwh.toFixed(1)} kWh</span>
                        <span className="mx-2 text-slate-600">|</span>
                        <span className="text-xs text-slate-400">Monthly:</span>
                        <span className="ml-1 text-sm font-bold text-emerald-400">{monthlyKwh.toFixed(0)} kWh</span>
                        <span className="mx-2 text-slate-600">|</span>
                        <span className="text-xs text-slate-400">Solar ratio:</span>
                        <span className="ml-1 text-sm font-bold text-amber-400">{(energyProfile.solarRatio * 100).toFixed(0)}%</span>
                      </div>
                    </div>

                    <hr className="border-slate-700/50" />

                    {/* Section 3: Current Costs */}
                    <div>
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">💰 Current Energy Costs</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-lg bg-slate-800/50 p-2.5 text-center">
                          <div className="text-[10px] text-slate-400">Grid ({selectedDisco || 'Utility'})</div>
                          <div className="text-sm font-bold text-amber-400">{formatCurrency(monthlyElecCost)}/mo</div>
                        </div>
                        <div className="rounded-lg bg-slate-800/50 p-2.5 text-center">
                          <div className="text-[10px] text-slate-400">Generator</div>
                          <div className="text-sm font-bold text-red-400">{generator.enabled ? formatCurrency(generatorCosts.totalMonthly) : 'N/A'}/mo</div>
                        </div>
                        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-2.5 text-center">
                          <div className="text-[10px] text-red-300">Total</div>
                          <div className="text-sm font-bold text-red-400">{formatCurrency(totalCurrentMonthly)}/mo</div>
                        </div>
                      </div>
                    </div>

                    <hr className="border-slate-700/50" />

                    {/* Section 4: Selected Solar Package */}
                    {chosenPkg && (
                      <div>
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">☀️ Selected Solar Package — {chosenPkg.name}</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div className="rounded-lg bg-slate-800/50 p-2.5 text-center">
                            <div className="text-[10px] text-slate-400">Panels</div>
                            <div className="text-xs font-bold text-white">{chosenPkg.panelCount}×{chosenPkg.panelWatts}W</div>
                          </div>
                          <div className="rounded-lg bg-slate-800/50 p-2.5 text-center">
                            <div className="text-[10px] text-slate-400">Battery</div>
                            <div className="text-xs font-bold text-white">{chosenPkg.batteryKwh} kWh</div>
                          </div>
                          <div className="rounded-lg bg-slate-800/50 p-2.5 text-center">
                            <div className="text-[10px] text-slate-400">Inverter</div>
                            <div className="text-xs font-bold text-white">{chosenPkg.inverterKva} kVA</div>
                          </div>
                          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-center">
                            <div className="text-[10px] text-emerald-300">Est. Cost</div>
                            <div className="text-xs font-bold text-emerald-400">{formatCurrency(chosenPrice)}</div>
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-slate-400 text-center italic">
                          Final pricing will be confirmed after site assessment. This is an indicative estimate.
                        </p>
                      </div>
                    )}

                    {/* Top Equipment */}
                    <div>
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">🔌 Top Equipment ({activeEquipment.length} total)</h4>
                      <div className="space-y-1">
                        {topConsumers.slice(0, 3).map((item, idx) => (
                          <div key={item.key} className="flex items-center justify-between text-xs">
                            <span className="text-slate-300">{['🥇','🥈','🥉'][idx]} {item.eq.icon} {item.eq.name} <span className="text-slate-500">({item.roomName})</span></span>
                            <span className="font-semibold text-white">{item.wattage}W — {item.dailyKwh.toFixed(2)} kWh/day</span>
                          </div>
                        ))}
                        {activeEquipment.length > 3 && <div className="text-[10px] text-slate-500 text-center">... and {activeEquipment.length - 3} more items (full list in report)</div>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===== CHANGE PACKAGE ===== */}
                <div className="mb-6 rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                  <h4 className="mb-3 text-sm font-bold text-white">📦 Requesting quote for:</h4>
                  <div className="flex gap-2">
                    {solarPackages.map((pkg, i) => (
                      <button key={pkg.name} onClick={() => setSelectedSolarPkg(i)}
                        className={`flex-1 rounded-xl p-3 text-center transition-all border-2 ${
                          selectedSolarPkg === i
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                        }`}>
                        <div className={`text-sm font-bold ${selectedSolarPkg === i ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {i === 0 ? '🔋' : i === 1 ? '☀️' : '🏆'} {pkg.name}
                        </div>
                        <div className={`text-xs mt-0.5 ${selectedSolarPkg === i ? 'text-white' : 'text-slate-500'}`}>
                          {formatCurrency(estimateSolarPrice(pkg, selectedCountry))}
                        </div>
                        {selectedSolarPkg === i && <div className="mt-1 text-[10px] text-emerald-400">✓ Selected</div>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ===== CONTACT FORM ===== */}
                <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                  <h4 className="text-sm font-bold text-white">📝 Your Contact Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-400">Full Name <span className="text-red-400">*</span></label>
                      <input type="text" required minLength={2} value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name" className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-400">Phone Number <span className="text-red-400">*</span></label>
                      <input type="tel" required value={formData.phone} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+234 ..." className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-400">Email Address <span className="text-red-400">*</span></label>
                    <input type="email" required value={formData.email} onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com" className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-400">Installation Address</label>
                    <input type="text" value={formAddress} onChange={e => setFormAddress(e.target.value)}
                      placeholder="Where would the solar be installed? (optional)" className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-400">Additional Notes / Questions</label>
                    <textarea value={quoteNotes} onChange={e => setQuoteNotes(e.target.value)} rows={3}
                      placeholder="Any specific requirements, questions, or preferences..." className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none resize-none" />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => goToStep(7)} className="rounded-xl border border-slate-600 bg-slate-700 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-600">← Back</button>
                    <button type="submit" className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all">
                      📩 Submit Report & Request Quotation
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="py-6 text-center animate-fadeIn">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30">
                  <span className="text-5xl">🎉</span>
                </div>
                <h2 className="mb-2 text-2xl font-bold text-white">Quotation Request Submitted!</h2>
                <p className="mb-6 text-slate-400">Thank you, <strong className="text-white">{formData.name}</strong>!</p>

                <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-left">
                  <h3 className="mb-4 text-sm font-bold text-emerald-400">📋 What happens next?</h3>
                  <div className="space-y-3">
                    {[
                      { step: '1', title: 'Report Delivery', desc: `Detailed energy report sent to ${formData.email}`, time: 'Within 24 hours', icon: '📧' },
                      { step: '2', title: 'Expert Review', desc: 'Solar engineers review your energy profile and requirements', time: '1-2 business days', icon: '👷' },
                      { step: '3', title: 'Formal Quotation', desc: `Custom quotation for the ${chosenPkg?.name || 'selected'} package with exact pricing`, time: '2-3 business days', icon: '📋' },
                      { step: '4', title: 'Site Assessment', desc: 'Free on-site assessment at your convenience to confirm specifications', time: 'At your schedule', icon: '🏠' },
                      { step: '5', title: 'Installation', desc: 'Professional installation by certified technicians', time: '1-3 days typical', icon: '⚡' },
                    ].map(item => (
                      <div key={item.step} className="flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-sm">{item.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-white">{item.title}</span>
                            <span className="text-[10px] text-emerald-400">{item.time}</span>
                          </div>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary card */}
                <div className="mb-6 rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 text-left">
                  <h4 className="mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Your Submission Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-slate-400">Package:</div>
                    <div className="text-emerald-400 font-semibold">{chosenPkg?.name || '—'} ({chosenPkg ? formatCurrency(chosenPrice) : '—'})</div>
                    <div className="text-slate-400">System Size:</div>
                    <div className="text-white">{chosenPkg ? `${chosenPkg.panelCount}×${chosenPkg.panelWatts}W panels + ${chosenPkg.batteryKwh}kWh battery` : '—'}</div>
                    <div className="text-slate-400">Contact:</div>
                    <div className="text-white">{formData.phone}</div>
                    <div className="text-slate-400">Location:</div>
                    <div className="text-white">{selectedCountry.flag} {selectedState || selectedCountry.name}{formAddress ? ` — ${formAddress}` : ''}</div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button onClick={() => { setSubmitted(false); setCurrentStep(1); setEquipment({}); setCustomEquipment({}); setSelectedSpaceType(''); setSelectedCountry(null); }}
                    className="flex-1 rounded-xl bg-slate-700 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-600 transition-all">
                    🔄 Start New Assessment
                  </button>
                  <button onClick={() => { setSubmitted(false); goToStep(7); }}
                    className="flex-1 rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all">
                    ↩ Review Different Package
                  </button>
                </div>
              </div>
            )}
          </StepCard>
          );
        })()}
      </main>

      <footer className="border-t border-white/5 bg-slate-900/50 px-4 py-6 text-center text-xs text-slate-500">
        <p>⚡ EnergiX — AI-Powered Energy Intelligence Platform</p>
        <p className="mt-1">© 2024 EnergiX. All rights reserved.</p>
      </footer>
    </div>
  );
}

// ============== REUSABLE COMPONENTS ==============
function StepCard({ children }: { children: React.ReactNode }) {
  return <div className="animate-fadeIn rounded-2xl border border-white/10 bg-slate-800/50 p-6 shadow-2xl backdrop-blur-sm">{children}</div>;
}

function AiBubble({ children }: { children: React.ReactNode }) {
  return <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"><div className="text-sm leading-relaxed text-slate-300">{children}</div></div>;
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`relative h-7 w-12 rounded-full transition-all ${checked ? 'bg-emerald-500' : 'bg-slate-600'}`} role="switch" aria-checked={checked}>
      <div className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-lg transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

function NavButtons({ onBack, onNext, nextDisabled, nextLabel }: { onBack?: () => void; onNext?: () => void; nextDisabled?: boolean; nextLabel?: string }) {
  return (
    <div className="mt-6 flex gap-3">
      {onBack && <button onClick={onBack} className="rounded-xl border border-slate-600 bg-slate-700 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-600">← Back</button>}
      {onNext && (
        <button onClick={onNext} disabled={nextDisabled}
          className={`flex-1 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-all ${
            nextDisabled ? 'cursor-not-allowed bg-slate-600 opacity-50 shadow-none' : 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/25 hover:shadow-emerald-500/40'
          }`}>{nextLabel || 'Continue →'}</button>
      )}
    </div>
  );
}
