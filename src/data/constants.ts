// ============== COUNTRY DATA ==============
export interface CountryData {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  avgTariff: number;
  fuelPricePerLitre: number;
  sunHours: number;
  sunStart: number; // hour when solar production begins
  sunEnd: number;   // hour when solar production ends
  states: string[];
  powerCompanies: string[];
  tariffBands: { label: string; rate: number }[];
}

export interface SpaceType {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultRooms: string[];
}

export const SPACE_TYPES: SpaceType[] = [
  { id: 'studio', name: 'Studio/Self-Contain', icon: '🏠', description: 'Combined living & bedroom + kitchenette', defaultRooms: ['main-room', 'kitchenette', 'bathroom'] },
  { id: '1bed', name: '1 Bedroom Flat', icon: '🏡', description: '1 bedroom + living room', defaultRooms: ['living', 'bedroom', 'kitchen', 'bathroom'] },
  { id: '2bed', name: '2 Bedroom Flat', icon: '🏘️', description: '2 bedrooms + living room', defaultRooms: ['living', 'bedroom-1', 'bedroom-2', 'kitchen', 'bathroom'] },
  { id: '3bed', name: '3 Bedroom House', icon: '🏗️', description: '3 bedrooms + living areas', defaultRooms: ['living', 'bedroom-1', 'bedroom-2', 'bedroom-3', 'kitchen', 'bathroom', 'general'] },
  { id: '4bed', name: '4+ Bedroom House', icon: '🏛️', description: 'Large family house', defaultRooms: ['living', 'bedroom-1', 'bedroom-2', 'bedroom-3', 'bedroom-4', 'kitchen', 'bathroom-1', 'bathroom-2', 'general'] },
  { id: 'duplex', name: 'Duplex', icon: '🏢', description: 'Multi-floor dwelling', defaultRooms: ['living', 'dining', 'bedroom-1', 'bedroom-2', 'bedroom-3', 'bedroom-4', 'kitchen', 'bathroom-1', 'bathroom-2', 'general'] },
  { id: 'office', name: 'Office Space', icon: '🏬', description: 'Commercial office', defaultRooms: ['reception', 'office-1', 'office-2', 'meeting-room', 'kitchen', 'bathroom', 'server-room'] },
  { id: 'church', name: 'Church/Worship Center', icon: '⛪', description: 'Place of worship', defaultRooms: ['auditorium', 'office', 'classroom-1', 'kitchen', 'bathroom', 'general'] },
  { id: 'shop', name: 'Shop/Store', icon: '🏪', description: 'Retail space', defaultRooms: ['main-area', 'storage', 'bathroom'] },
];

export const COUNTRIES: CountryData[] = [
  // ===== WEST AFRICA =====
  {
    code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', currencySymbol: '₦',
    avgTariff: 68, fuelPricePerLitre: 700, sunHours: 5.5, sunStart: 7, sunEnd: 18,
    states: ['Lagos', 'Abuja (FCT)', 'Rivers', 'Ogun', 'Kano', 'Kaduna', 'Oyo', 'Enugu', 'Delta', 'Anambra', 'Edo', 'Kwara', 'Ondo', 'Osun', 'Ekiti', 'Abia', 'Imo', 'Benue', 'Plateau', 'Bauchi', 'Cross River', 'Akwa Ibom', 'Adamawa', 'Bayelsa', 'Borno', 'Ebonyi', 'Gombe', 'Jigawa', 'Katsina', 'Kebbi', 'Kogi', 'Nasarawa', 'Niger', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'],
    powerCompanies: ['Ikeja Electric (IE)', 'Eko Electricity (EKEDC)', 'Ibadan Electricity (IBEDC)', 'Abuja Electricity (AEDC)', 'Enugu Electricity (EEDC)', 'Port Harcourt Electricity (PHED)', 'Kaduna Electricity (KAEDCO)', 'Kano Electricity (KEDCO)', 'Jos Electricity (JED)', 'Benin Electricity (BEDC)', 'Yola Electricity (YEDC)', 'Other'],
    tariffBands: [
      { label: 'Band A (20+ hrs supply) - ₦225/kWh', rate: 225 },
      { label: 'Band B (16-20 hrs supply) - ₦63/kWh', rate: 63 },
      { label: 'Band C (12-16 hrs supply) - ₦50/kWh', rate: 50 },
      { label: 'Band D (8-12 hrs supply) - ₦43/kWh', rate: 43 },
      { label: 'Band E (4-8 hrs supply) - ₦40/kWh', rate: 40 },
    ],
  },
  {
    code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS', currencySymbol: 'GH₵',
    avgTariff: 1.2, fuelPricePerLitre: 14, sunHours: 5.0, sunStart: 6, sunEnd: 18,
    states: ['Greater Accra', 'Ashanti', 'Western', 'Eastern', 'Central', 'Northern', 'Volta', 'Upper East', 'Upper West', 'Brong Ahafo', 'Others'],
    powerCompanies: ['ECG (Electricity Company of Ghana)', 'NEDCo (Northern Electricity)', 'Other'],
    tariffBands: [
      { label: 'Residential (0-300 kWh) - GH₵0.95/kWh', rate: 0.95 },
      { label: 'Residential (301-600 kWh) - GH₵1.20/kWh', rate: 1.2 },
      { label: 'Residential (600+ kWh) - GH₵1.55/kWh', rate: 1.55 },
      { label: 'Commercial - GH₵1.80/kWh', rate: 1.8 },
    ],
  },
  {
    code: 'SN', name: 'Senegal', flag: '🇸🇳', currency: 'XOF', currencySymbol: 'CFA',
    avgTariff: 115, fuelPricePerLitre: 790, sunHours: 6.0, sunStart: 7, sunEnd: 19,
    states: ['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Kaolack', 'Others'],
    powerCompanies: ['SENELEC', 'Other'],
    tariffBands: [
      { label: 'Residential (0-150 kWh) - CFA 90/kWh', rate: 90 },
      { label: 'Residential (150+ kWh) - CFA 115/kWh', rate: 115 },
      { label: 'Commercial - CFA 130/kWh', rate: 130 },
    ],
  },
  {
    code: 'CM', name: 'Cameroon', flag: '🇨🇲', currency: 'XAF', currencySymbol: 'CFA',
    avgTariff: 80, fuelPricePerLitre: 630, sunHours: 5.0, sunStart: 6, sunEnd: 18,
    states: ['Centre', 'Littoral', 'West', 'South West', 'North West', 'Far North', 'Others'],
    powerCompanies: ['ENEO', 'Other'],
    tariffBands: [
      { label: 'Residential (0-110 kWh) - CFA 50/kWh', rate: 50 },
      { label: 'Residential (110+ kWh) - CFA 80/kWh', rate: 80 },
      { label: 'Commercial - CFA 99/kWh', rate: 99 },
    ],
  },
  {
    code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', currency: 'XOF', currencySymbol: 'CFA',
    avgTariff: 80, fuelPricePerLitre: 735, sunHours: 5.5, sunStart: 6, sunEnd: 18,
    states: ['Abidjan', 'Yamoussoukro', 'Bouaké', 'San Pedro', 'Others'],
    powerCompanies: ['CIE (Compagnie Ivoirienne d\'Electricité)', 'Other'],
    tariffBands: [
      { label: 'Social (0-80 kWh) - CFA 36/kWh', rate: 36 },
      { label: 'Domestic (80+ kWh) - CFA 80/kWh', rate: 80 },
      { label: 'Commercial - CFA 100/kWh', rate: 100 },
    ],
  },
  // ===== EAST AFRICA =====
  {
    code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', currencySymbol: 'KSh',
    avgTariff: 25, fuelPricePerLitre: 200, sunHours: 5.5, sunStart: 6, sunEnd: 18,
    states: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Nyeri', 'Machakos', 'Others'],
    powerCompanies: ['Kenya Power (KPLC)', 'Other'],
    tariffBands: [
      { label: 'Domestic (0-100 kWh) - KSh12/kWh', rate: 12 },
      { label: 'Domestic (101-1500 kWh) - KSh25/kWh', rate: 25 },
      { label: 'Commercial - KSh22/kWh', rate: 22 },
    ],
  },
  {
    code: 'TZ', name: 'Tanzania', flag: '🇹🇿', currency: 'TZS', currencySymbol: 'TSh',
    avgTariff: 350, fuelPricePerLitre: 3200, sunHours: 5.5, sunStart: 6, sunEnd: 18,
    states: ['Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza', 'Zanzibar', 'Others'],
    powerCompanies: ['TANESCO', 'ZECO (Zanzibar)', 'Other'],
    tariffBands: [
      { label: 'Domestic (0-75 kWh) - TSh 100/kWh', rate: 100 },
      { label: 'Domestic (75+ kWh) - TSh 350/kWh', rate: 350 },
      { label: 'Commercial - TSh 502/kWh', rate: 502 },
    ],
  },
  {
    code: 'UG', name: 'Uganda', flag: '🇺🇬', currency: 'UGX', currencySymbol: 'USh',
    avgTariff: 780, fuelPricePerLitre: 5500, sunHours: 5.0, sunStart: 7, sunEnd: 19,
    states: ['Kampala', 'Jinja', 'Entebbe', 'Gulu', 'Mbarara', 'Others'],
    powerCompanies: ['UMEME', 'Other'],
    tariffBands: [
      { label: 'Domestic - USh 780/kWh', rate: 780 },
      { label: 'Commercial - USh 680/kWh', rate: 680 },
    ],
  },
  {
    code: 'RW', name: 'Rwanda', flag: '🇷🇼', currency: 'RWF', currencySymbol: 'RF',
    avgTariff: 182, fuelPricePerLitre: 1550, sunHours: 4.5, sunStart: 6, sunEnd: 18,
    states: ['Kigali', 'Eastern', 'Western', 'Northern', 'Southern'],
    powerCompanies: ['REG (Rwanda Energy Group)', 'Other'],
    tariffBands: [
      { label: 'Residential (0-15 kWh) - RF 89/kWh', rate: 89 },
      { label: 'Residential (15+ kWh) - RF 182/kWh', rate: 182 },
      { label: 'Commercial - RF 167/kWh', rate: 167 },
    ],
  },
  {
    code: 'ET', name: 'Ethiopia', flag: '🇪🇹', currency: 'ETB', currencySymbol: 'Br',
    avgTariff: 2.0, fuelPricePerLitre: 65, sunHours: 5.5, sunStart: 6, sunEnd: 18,
    states: ['Addis Ababa', 'Oromia', 'Amhara', 'SNNPR', 'Tigray', 'Others'],
    powerCompanies: ['Ethiopian Electric Utility (EEU)', 'Other'],
    tariffBands: [
      { label: 'Domestic (0-50 kWh) - Br 0.27/kWh', rate: 0.27 },
      { label: 'Domestic (50+ kWh) - Br 2.0/kWh', rate: 2.0 },
      { label: 'Commercial - Br 2.12/kWh', rate: 2.12 },
    ],
  },
  // ===== SOUTHERN AFRICA =====
  {
    code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', currencySymbol: 'R',
    avgTariff: 3.5, fuelPricePerLitre: 25, sunHours: 5.5, sunStart: 6, sunEnd: 18,
    states: ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'],
    powerCompanies: ['Eskom', 'City Power (Joburg)', 'Cape Town Electricity', 'Other Municipality'],
    tariffBands: [
      { label: 'Residential Block 1 - R2.50/kWh', rate: 2.5 },
      { label: 'Residential Block 2 - R3.50/kWh', rate: 3.5 },
      { label: 'Commercial - R3.20/kWh', rate: 3.2 },
    ],
  },
  {
    code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', currency: 'ZWL', currencySymbol: 'ZWL$',
    avgTariff: 0.13, fuelPricePerLitre: 1.6, sunHours: 6.0, sunStart: 6, sunEnd: 18,
    states: ['Harare', 'Bulawayo', 'Manicaland', 'Mashonaland', 'Others'],
    powerCompanies: ['ZESA/ZETDC', 'Other'],
    tariffBands: [
      { label: 'Domestic (0-200 kWh) - $0.10/kWh', rate: 0.10 },
      { label: 'Domestic (200+ kWh) - $0.13/kWh', rate: 0.13 },
      { label: 'Commercial - $0.12/kWh', rate: 0.12 },
    ],
  },
  {
    code: 'ZM', name: 'Zambia', flag: '🇿🇲', currency: 'ZMW', currencySymbol: 'ZK',
    avgTariff: 1.2, fuelPricePerLitre: 27, sunHours: 6.0, sunStart: 6, sunEnd: 18,
    states: ['Lusaka', 'Copperbelt', 'Southern', 'Central', 'Others'],
    powerCompanies: ['ZESCO', 'Copperbelt Energy Corp', 'Other'],
    tariffBands: [
      { label: 'Residential (0-300 kWh) - ZK 0.53/kWh', rate: 0.53 },
      { label: 'Residential (300+ kWh) - ZK 1.20/kWh', rate: 1.20 },
      { label: 'Commercial - ZK 1.77/kWh', rate: 1.77 },
    ],
  },
  // ===== NORTH AFRICA =====
  {
    code: 'EG', name: 'Egypt', flag: '🇪🇬', currency: 'EGP', currencySymbol: 'E£',
    avgTariff: 2.0, fuelPricePerLitre: 12.5, sunHours: 6.5, sunStart: 6, sunEnd: 18,
    states: ['Cairo', 'Alexandria', 'Giza', 'Sharm el-Sheikh', 'Luxor', 'Others'],
    powerCompanies: ['Egyptian Electricity Holding', 'North Cairo EDC', 'South Cairo EDC', 'Other'],
    tariffBands: [
      { label: 'Residential (0-200 kWh) - E£0.88/kWh', rate: 0.88 },
      { label: 'Residential (200-350 kWh) - E£1.38/kWh', rate: 1.38 },
      { label: 'Residential (350+ kWh) - E£2.00/kWh', rate: 2.00 },
      { label: 'Commercial - E£2.27/kWh', rate: 2.27 },
    ],
  },
  {
    code: 'MA', name: 'Morocco', flag: '🇲🇦', currency: 'MAD', currencySymbol: 'MAD',
    avgTariff: 1.6, fuelPricePerLitre: 14.5, sunHours: 6.0, sunStart: 6, sunEnd: 19,
    states: ['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier', 'Others'],
    powerCompanies: ['ONEE', 'Lydec (Casablanca)', 'Other'],
    tariffBands: [
      { label: 'Residential (0-100 kWh) - MAD 0.90/kWh', rate: 0.90 },
      { label: 'Residential (100+ kWh) - MAD 1.60/kWh', rate: 1.60 },
      { label: 'Commercial - MAD 1.44/kWh', rate: 1.44 },
    ],
  },
  // ===== MIDDLE EAST =====
  {
    code: 'AE', name: 'UAE', flag: '🇦🇪', currency: 'AED', currencySymbol: 'AED',
    avgTariff: 0.38, fuelPricePerLitre: 3.2, sunHours: 6.5, sunStart: 6, sunEnd: 18,
    states: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
    powerCompanies: ['DEWA (Dubai)', 'ADDC (Abu Dhabi)', 'SEWA (Sharjah)', 'FEWA', 'Other'],
    tariffBands: [
      { label: 'Residential (0-2000 kWh) - AED 0.23/kWh', rate: 0.23 },
      { label: 'Residential (2000+ kWh) - AED 0.38/kWh', rate: 0.38 },
      { label: 'Commercial - AED 0.44/kWh', rate: 0.44 },
    ],
  },
  {
    code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR', currencySymbol: 'SAR',
    avgTariff: 0.32, fuelPricePerLitre: 2.33, sunHours: 7.0, sunStart: 6, sunEnd: 18,
    states: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Others'],
    powerCompanies: ['Saudi Electricity Company (SEC)', 'Other'],
    tariffBands: [
      { label: 'Residential (0-6000 kWh) - SAR 0.18/kWh', rate: 0.18 },
      { label: 'Residential (6000+ kWh) - SAR 0.30/kWh', rate: 0.30 },
      { label: 'Commercial - SAR 0.32/kWh', rate: 0.32 },
    ],
  },
  // ===== EUROPE =====
  {
    code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', currencySymbol: '£',
    avgTariff: 0.28, fuelPricePerLitre: 1.5, sunHours: 3.5, sunStart: 7, sunEnd: 17,
    states: ['England - London', 'England - South East', 'England - South West', 'England - Midlands', 'England - North', 'Scotland', 'Wales', 'Northern Ireland'],
    powerCompanies: ['British Gas', 'EDF Energy', 'E.ON', 'Scottish Power', 'SSE', 'Octopus Energy', 'OVO Energy', 'Other'],
    tariffBands: [
      { label: 'Standard Variable - £0.28/kWh', rate: 0.28 },
      { label: 'Fixed Rate - £0.25/kWh', rate: 0.25 },
      { label: 'Economy 7 (Night) - £0.12/kWh', rate: 0.12 },
      { label: 'Economy 7 (Day) - £0.30/kWh', rate: 0.30 },
    ],
  },
  {
    code: 'DE', name: 'Germany', flag: '🇩🇪', currency: 'EUR', currencySymbol: '€',
    avgTariff: 0.32, fuelPricePerLitre: 1.8, sunHours: 3.5, sunStart: 7, sunEnd: 17,
    states: ['Berlin', 'Bavaria', 'Hamburg', 'North Rhine-Westphalia', 'Hesse', 'Baden-Württemberg', 'Others'],
    powerCompanies: ['E.ON', 'RWE', 'EnBW', 'Vattenfall', 'Local Provider', 'Other'],
    tariffBands: [
      { label: 'Household - €0.32/kWh', rate: 0.32 },
      { label: 'Reduced Rate - €0.28/kWh', rate: 0.28 },
      { label: 'Commercial - €0.22/kWh', rate: 0.22 },
    ],
  },
  {
    code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', currencySymbol: '€',
    avgTariff: 0.23, fuelPricePerLitre: 1.85, sunHours: 4.0, sunStart: 7, sunEnd: 18,
    states: ['Île-de-France (Paris)', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes', 'Occitanie', 'Others'],
    powerCompanies: ['EDF', 'Engie', 'TotalEnergies', 'Other'],
    tariffBands: [
      { label: 'Residential Base - €0.23/kWh', rate: 0.23 },
      { label: 'Off-Peak Hours - €0.17/kWh', rate: 0.17 },
      { label: 'Peak Hours - €0.27/kWh', rate: 0.27 },
    ],
  },
  // ===== AMERICAS =====
  {
    code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', currencySymbol: '$',
    avgTariff: 0.16, fuelPricePerLitre: 1.0, sunHours: 4.5, sunStart: 7, sunEnd: 18,
    states: ['California', 'Texas', 'Florida', 'New York', 'Illinois', 'Georgia', 'Arizona', 'Colorado', 'Ohio', 'Pennsylvania', 'North Carolina', 'Others'],
    powerCompanies: ['Local Utility Provider', 'Other'],
    tariffBands: [
      { label: 'Residential - $0.16/kWh', rate: 0.16 },
      { label: 'Time-of-Use Peak - $0.25/kWh', rate: 0.25 },
      { label: 'Time-of-Use Off-Peak - $0.10/kWh', rate: 0.10 },
      { label: 'Commercial - $0.13/kWh', rate: 0.13 },
    ],
  },
  {
    code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', currencySymbol: 'CA$',
    avgTariff: 0.13, fuelPricePerLitre: 1.6, sunHours: 3.5, sunStart: 7, sunEnd: 17,
    states: ['Ontario', 'British Columbia', 'Alberta', 'Quebec', 'Manitoba', 'Saskatchewan', 'Others'],
    powerCompanies: ['Hydro One (ON)', 'BC Hydro', 'Hydro-Québec', 'ATCO (AB)', 'Other'],
    tariffBands: [
      { label: 'Off-Peak - CA$0.09/kWh', rate: 0.09 },
      { label: 'Mid-Peak - CA$0.13/kWh', rate: 0.13 },
      { label: 'On-Peak - CA$0.18/kWh', rate: 0.18 },
    ],
  },
  {
    code: 'BR', name: 'Brazil', flag: '🇧🇷', currency: 'BRL', currencySymbol: 'R$',
    avgTariff: 0.85, fuelPricePerLitre: 6.0, sunHours: 5.5, sunStart: 6, sunEnd: 18,
    states: ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Brasília (DF)', 'Others'],
    powerCompanies: ['Enel (SP)', 'Light (RJ)', 'CEMIG (MG)', 'Other'],
    tariffBands: [
      { label: 'Green Flag - R$0.65/kWh', rate: 0.65 },
      { label: 'Yellow Flag - R$0.75/kWh', rate: 0.75 },
      { label: 'Red Flag - R$0.85/kWh', rate: 0.85 },
    ],
  },
  // ===== ASIA =====
  {
    code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', currencySymbol: '₹',
    avgTariff: 8, fuelPricePerLitre: 105, sunHours: 5.5, sunStart: 6, sunEnd: 18,
    states: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Uttar Pradesh', 'Rajasthan', 'West Bengal', 'Telangana', 'Kerala', 'Others'],
    powerCompanies: ['BSES Rajdhani', 'BSES Yamuna', 'Tata Power', 'Adani Electricity', 'MSEDCL', 'BESCOM', 'Other'],
    tariffBands: [
      { label: 'Residential (0-200 units) - ₹5/kWh', rate: 5 },
      { label: 'Residential (200+ units) - ₹8/kWh', rate: 8 },
      { label: 'Commercial - ₹10/kWh', rate: 10 },
    ],
  },
  {
    code: 'PK', name: 'Pakistan', flag: '🇵🇰', currency: 'PKR', currencySymbol: 'Rs',
    avgTariff: 45, fuelPricePerLitre: 290, sunHours: 5.5, sunStart: 6, sunEnd: 18,
    states: ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad', 'Others'],
    powerCompanies: ['LESCO (Lahore)', 'IESCO (Islamabad)', 'KESC/KE (Karachi)', 'FESCO', 'Other'],
    tariffBands: [
      { label: 'Protected (0-200 units) - Rs 24/kWh', rate: 24 },
      { label: 'Unprotected (200+ units) - Rs 45/kWh', rate: 45 },
      { label: 'Commercial - Rs 50/kWh', rate: 50 },
    ],
  },
  {
    code: 'PH', name: 'Philippines', flag: '🇵🇭', currency: 'PHP', currencySymbol: '₱',
    avgTariff: 12, fuelPricePerLitre: 65, sunHours: 5.0, sunStart: 6, sunEnd: 18,
    states: ['Metro Manila', 'Cebu', 'Davao', 'Calabarzon', 'Central Luzon', 'Others'],
    powerCompanies: ['Meralco', 'VECO (Visayas)', 'DLPC (Davao)', 'Other'],
    tariffBands: [
      { label: 'Residential - ₱12.00/kWh', rate: 12 },
      { label: 'Commercial - ₱11.50/kWh', rate: 11.50 },
    ],
  },
  {
    code: 'ID', name: 'Indonesia', flag: '🇮🇩', currency: 'IDR', currencySymbol: 'Rp',
    avgTariff: 1500, fuelPricePerLitre: 13000, sunHours: 5.0, sunStart: 6, sunEnd: 18,
    states: ['Jakarta', 'Java (West)', 'Java (East)', 'Bali', 'Sumatra', 'Kalimantan', 'Others'],
    powerCompanies: ['PLN (Perusahaan Listrik Negara)', 'Other'],
    tariffBands: [
      { label: 'R-1 (450VA) - Rp 415/kWh', rate: 415 },
      { label: 'R-1 (900VA) - Rp 1,352/kWh', rate: 1352 },
      { label: 'R-1 (1300VA+) - Rp 1,500/kWh', rate: 1500 },
    ],
  },
  // ===== OCEANIA =====
  {
    code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', currencySymbol: 'A$',
    avgTariff: 0.32, fuelPricePerLitre: 2.0, sunHours: 5.0, sunStart: 6, sunEnd: 18,
    states: ['New South Wales', 'Victoria', 'Queensland', 'South Australia', 'Western Australia', 'Tasmania', 'ACT', 'Northern Territory'],
    powerCompanies: ['AGL', 'Origin Energy', 'EnergyAustralia', 'Alinta Energy', 'Other'],
    tariffBands: [
      { label: 'Single Rate - A$0.32/kWh', rate: 0.32 },
      { label: 'Time-of-Use Peak - A$0.45/kWh', rate: 0.45 },
      { label: 'Time-of-Use Off-Peak - A$0.18/kWh', rate: 0.18 },
      { label: 'Solar Feed-in Tariff - A$0.05/kWh', rate: 0.05 },
    ],
  },
];

// ============== DEFAULT USAGE TIMES PER EQUIPMENT ==============
export interface DefaultUsageTime {
  start: number; // 0-23
  end: number;   // 0-23
  is24h: boolean;
}

export const DEFAULT_USAGE_TIMES: Record<string, DefaultUsageTime> = {
  'tv':              { start: 18, end: 23, is24h: false },
  'fan':             { start: 10, end: 22, is24h: false },
  'ac':              { start: 12, end: 22, is24h: false },
  'living-bulb':     { start: 18, end: 23, is24h: false },
  'sound':           { start: 18, end: 22, is24h: false },
  'bedroom-tv':      { start: 20, end: 23, is24h: false },
  'bedroom-ac':      { start: 21, end: 7,  is24h: false },
  'bedroom-fan':     { start: 20, end: 7,  is24h: false },
  'bedroom-bulb':    { start: 19, end: 23, is24h: false },
  'charger':         { start: 22, end: 6,  is24h: false },
  'laptop':          { start: 9,  end: 17, is24h: false },
  'refrigerator':    { start: 0,  end: 0,  is24h: true },
  'freezer':         { start: 0,  end: 0,  is24h: true },
  'microwave':       { start: 7,  end: 9,  is24h: false },
  'kettle':          { start: 6,  end: 9,  is24h: false },
  'blender':         { start: 7,  end: 9,  is24h: false },
  'cooker':          { start: 7,  end: 20, is24h: false },
  'kitchen-bulb':    { start: 18, end: 22, is24h: false },
  'water-heater':    { start: 5,  end: 8,  is24h: false },
  'bathroom-bulb':   { start: 18, end: 22, is24h: false },
  'hair-dryer':      { start: 6,  end: 9,  is24h: false },
  'exhaust-fan':     { start: 6,  end: 22, is24h: false },
  'washing-machine': { start: 8,  end: 12, is24h: false },
  'iron':            { start: 8,  end: 11, is24h: false },
  'water-pump':      { start: 6,  end: 18, is24h: false },
  'router':          { start: 0,  end: 0,  is24h: true },
  'decoder':         { start: 18, end: 23, is24h: false },
  'security-light':  { start: 18, end: 6,  is24h: false },
  'desktop':         { start: 9,  end: 17, is24h: false },
};

// ============== TIME HELPER FUNCTIONS ==============
export function isHourInRange(hour: number, start: number, end: number, is24h: boolean): boolean {
  if (is24h) return true;
  if (start === end) return false;
  if (start < end) return hour >= start && hour < end;
  return hour >= start || hour < end; // wraps around midnight
}

export function getUsageHours(start: number, end: number, is24h: boolean): number {
  if (is24h) return 24;
  if (start === end) return 0;
  if (end > start) return end - start;
  return (24 - start) + end; // wrap around midnight
}

export function getSolarOverlapHours(start: number, end: number, is24h: boolean, sunStart: number = 6, sunEnd: number = 18): number {
  let count = 0;
  for (let h = 0; h < 24; h++) {
    if (isHourInRange(h, start, end, is24h) && h >= sunStart && h < sunEnd) count++;
  }
  return count;
}

export function getBatteryHours(start: number, end: number, is24h: boolean, sunStart: number = 6, sunEnd: number = 18): number {
  const total = getUsageHours(start, end, is24h);
  const solar = getSolarOverlapHours(start, end, is24h, sunStart, sunEnd);
  return total - solar;
}

export function formatHour(hour: number): string {
  if (hour === 0 || hour === 24) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: formatHour(i),
}));

export const USAGE_PRESETS = [
  { id: 'morning', label: '🌅 Morning', start: 6, end: 12 },
  { id: 'afternoon', label: '☀️ Afternoon', start: 12, end: 18 },
  { id: 'evening', label: '🌆 Evening', start: 18, end: 23 },
  { id: 'night', label: '🌙 Night', start: 22, end: 6 },
  { id: 'daytime', label: '🏢 Business Hours', start: 8, end: 17 },
  { id: '24h', label: '🔄 24/7', start: 0, end: 0 },
];

// ============== ROOM DEFINITIONS ==============
export interface RoomDef {
  id: string;
  name: string;
  icon: string;
  equipment: EquipmentDef[];
}

export interface EquipmentDef {
  id: string;
  name: string;
  icon: string;
  fields: EquipmentField[];
  getWattage: (selections: Record<string, string>, qty: number) => number;
}

export interface EquipmentField {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

// Wattage calculation helpers
const tvWattage = (selections: Record<string, string>, qty: number): number => {
  const sizeMap: Record<string, number> = { '32': 40, '43': 60, '50': 80, '55': 100, '65': 120, '75': 150 };
  const typeMultiplier: Record<string, number> = { led: 1, oled: 1.2, qled: 1.1, smart: 1.05, plasma: 2.5 };
  const base = sizeMap[selections.size] || 80;
  const mult = typeMultiplier[selections.type] || 1;
  return Math.round(base * mult) * qty;
};

const fanWattage = (_sel: Record<string, string>, qty: number): number => {
  const typeMap: Record<string, number> = { ceiling: 75, standing: 55, table: 40, exhaust: 30 };
  return (typeMap[_sel.type] || 55) * qty;
};

const acWattage = (sel: Record<string, string>, qty: number): number => {
  const capMap: Record<string, number> = { '1': 900, '1.5': 1350, '2': 1800, '2.5': 2200 };
  const typeMultiplier: Record<string, number> = { split: 1, window: 1.2, portable: 1.1, inverter: 0.7 };
  const base = capMap[sel.capacity] || 1350;
  const mult = typeMultiplier[sel.type] || 1;
  return Math.round(base * mult) * qty;
};

const bulbWattage = (sel: Record<string, string>, qty: number): number => {
  return (parseInt(sel.wattage) || 12) * qty;
};

const soundWattage = (sel: Record<string, string>, qty: number): number => {
  const typeMap: Record<string, number> = { soundbar: 30, 'home-theater': 150, bluetooth: 15, hifi: 100 };
  return (typeMap[sel.type] || 50) * qty;
};

const fridgeWattage = (sel: Record<string, string>, qty: number): number => {
  const sizeMap: Record<string, number> = { '100': 80, '200': 120, '300': 150, '400': 180, '500': 220 };
  const typeMultiplier: Record<string, number> = { 'single-door': 1, 'double-door': 1.3, 'side-by-side': 1.5, mini: 0.6, inverter: 0.7 };
  const base = sizeMap[sel.size] || 150;
  const mult = typeMultiplier[sel.type] || 1;
  return Math.round(base * mult) * qty;
};

const freezerWattage = (sel: Record<string, string>, qty: number): number => {
  const sizeMap: Record<string, number> = { '100': 80, '200': 120, '300': 160, '400': 200 };
  const typeMultiplier: Record<string, number> = { chest: 1, upright: 1.2 };
  return Math.round((sizeMap[sel.size] || 120) * (typeMultiplier[sel.type] || 1)) * qty;
};

const microwaveWattage = (sel: Record<string, string>, qty: number): number => {
  const sizeMap: Record<string, number> = { small: 700, medium: 1000, large: 1200 };
  return (sizeMap[sel.size] || 1000) * qty;
};

const kettleWattage = (sel: Record<string, string>, qty: number): number => {
  const sizeMap: Record<string, number> = { small: 1200, medium: 1500, large: 2000 };
  return (sizeMap[sel.size] || 1500) * qty;
};

const blenderWattage = (sel: Record<string, string>, qty: number): number => {
  const typeMap: Record<string, number> = { small: 200, medium: 400, large: 700 };
  return (typeMap[sel.type] || 400) * qty;
};

const cookerWattage = (sel: Record<string, string>, qty: number): number => {
  const typeMap: Record<string, number> = { single: 1000, double: 2000, induction: 1800 };
  return (typeMap[sel.type] || 1500) * qty;
};

const heaterWattage = (sel: Record<string, string>, qty: number): number => {
  const typeMap: Record<string, number> = { instant: 3000, 'storage-25': 1500, 'storage-50': 2000, 'storage-100': 3000 };
  return (typeMap[sel.type] || 2000) * qty;
};

const hairDryerWattage = (sel: Record<string, string>, qty: number): number => {
  const typeMap: Record<string, number> = { standard: 1200, professional: 2000 };
  return (typeMap[sel.type] || 1200) * qty;
};

const exhaustFanWattage = (sel: Record<string, string>, qty: number): number => {
  const sizeMap: Record<string, number> = { small: 25, medium: 40 };
  return (sizeMap[sel.size] || 30) * qty;
};

const washerWattage = (sel: Record<string, string>, qty: number): number => {
  const typeMap: Record<string, number> = { 'top-manual': 300, 'top-auto': 500, 'front-auto': 500, 'front-inverter': 350 };
  return (typeMap[sel.type] || 500) * qty;
};

const ironWattage = (sel: Record<string, string>, qty: number): number => {
  const typeMap: Record<string, number> = { dry: 1000, steam: 1500, cordless: 1200 };
  return (typeMap[sel.type] || 1200) * qty;
};

const pumpWattage = (sel: Record<string, string>, qty: number): number => {
  const capMap: Record<string, number> = { '0.5': 375, '1': 750, '1.5': 1100, '2': 1500 };
  return (capMap[sel.capacity] || 750) * qty;
};

const routerWattage = (sel: Record<string, string>, qty: number): number => {
  const typeMap: Record<string, number> = { router: 12, 'modem-router': 18, mesh: 25 };
  return (typeMap[sel.type] || 15) * qty;
};

const decoderWattage = (_sel: Record<string, string>, qty: number): number => {
  return 25 * qty;
};

const chargerWattage = (sel: Record<string, string>, qty: number): number => {
  const typeMap: Record<string, number> = { standard: 5, fast: 18, 'super-fast': 45 };
  return (typeMap[sel.type] || 10) * qty;
};

const laptopWattage = (sel: Record<string, string>, qty: number): number => {
  const typeMap: Record<string, number> = { ultrabook: 45, standard: 65, gaming: 150 };
  return (typeMap[sel.type] || 65) * qty;
};

const desktopWattage = (sel: Record<string, string>, qty: number): number => {
  const typeMap: Record<string, number> = { basic: 200, gaming: 500, workstation: 400 };
  return (typeMap[sel.type] || 250) * qty;
};

const securityLightWattage = (sel: Record<string, string>, qty: number): number => {
  return (parseInt(sel.wattage) || 20) * qty;
};

// ============== ROOM DEFINITIONS ==============
export const ROOMS: RoomDef[] = [
  {
    id: 'living', name: 'Living Room', icon: '🛋️',
    equipment: [
      { id: 'tv', name: 'Television', icon: '📺', fields: [
        { key: 'brand', label: 'Brand', options: [{ value: 'samsung', label: 'Samsung' }, { value: 'lg', label: 'LG' }, { value: 'sony', label: 'Sony' }, { value: 'hisense', label: 'Hisense' }, { value: 'tcl', label: 'TCL' }, { value: 'other', label: 'Other' }] },
        { key: 'size', label: 'Size', options: [{ value: '32', label: '32"' }, { value: '43', label: '43"' }, { value: '50', label: '50"' }, { value: '55', label: '55"' }, { value: '65', label: '65"' }, { value: '75', label: '75"+' }] },
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'oled', label: 'OLED' }, { value: 'qled', label: 'QLED' }, { value: 'smart', label: 'Smart TV' }, { value: 'plasma', label: 'Plasma' }] },
      ], getWattage: tvWattage },
      { id: 'fan', name: 'Living Room Fan', icon: '🌀', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'ceiling', label: 'Ceiling Fan' }, { value: 'standing', label: 'Standing Fan' }, { value: 'table', label: 'Table Fan' }, { value: 'exhaust', label: 'Exhaust Fan' }] },
      ], getWattage: fanWattage },
      { id: 'ac', name: 'Air Conditioner', icon: '❄️', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'split', label: 'Split Unit' }, { value: 'window', label: 'Window Unit' }, { value: 'portable', label: 'Portable' }, { value: 'inverter', label: 'Inverter AC' }] },
        { key: 'capacity', label: 'Capacity', options: [{ value: '1', label: '1 HP' }, { value: '1.5', label: '1.5 HP' }, { value: '2', label: '2 HP' }, { value: '2.5', label: '2.5 HP' }] },
      ], getWattage: acWattage },
      { id: 'living-bulb', name: 'Light Bulbs', icon: '💡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'energy-saving', label: 'Energy Saving' }, { value: 'incandescent', label: 'Incandescent' }, { value: 'fluorescent', label: 'Fluorescent' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '5', label: '5W' }, { value: '9', label: '9W' }, { value: '12', label: '12W' }, { value: '15', label: '15W' }, { value: '20', label: '20W' }] },
      ], getWattage: bulbWattage },
      { id: 'sound', name: 'Sound System', icon: '🔊', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'soundbar', label: 'Soundbar' }, { value: 'home-theater', label: 'Home Theater' }, { value: 'bluetooth', label: 'Bluetooth Speaker' }, { value: 'hifi', label: 'Hi-Fi System' }] },
      ], getWattage: soundWattage },
    ],
  },
  {
    id: 'bedroom', name: 'Bedroom(s)', icon: '🛏️',
    equipment: [
      { id: 'bedroom-tv', name: 'Bedroom TV', icon: '📺', fields: [
        { key: 'brand', label: 'Brand', options: [{ value: 'samsung', label: 'Samsung' }, { value: 'lg', label: 'LG' }, { value: 'sony', label: 'Sony' }, { value: 'hisense', label: 'Hisense' }, { value: 'tcl', label: 'TCL' }, { value: 'other', label: 'Other' }] },
        { key: 'size', label: 'Size', options: [{ value: '32', label: '32"' }, { value: '43', label: '43"' }, { value: '50', label: '50"' }, { value: '55', label: '55"' }] },
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'smart', label: 'Smart TV' }] },
      ], getWattage: tvWattage },
      { id: 'bedroom-ac', name: 'Bedroom AC', icon: '❄️', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'split', label: 'Split Unit' }, { value: 'window', label: 'Window Unit' }, { value: 'inverter', label: 'Inverter AC' }] },
        { key: 'capacity', label: 'Capacity', options: [{ value: '1', label: '1 HP' }, { value: '1.5', label: '1.5 HP' }, { value: '2', label: '2 HP' }] },
      ], getWattage: acWattage },
      { id: 'bedroom-fan', name: 'Bedroom Fan', icon: '🌀', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'ceiling', label: 'Ceiling Fan' }, { value: 'standing', label: 'Standing Fan' }, { value: 'table', label: 'Table Fan' }] },
      ], getWattage: fanWattage },
      { id: 'bedroom-bulb', name: 'Bedroom Lights', icon: '💡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'energy-saving', label: 'Energy Saving' }, { value: 'incandescent', label: 'Incandescent' }, { value: 'fluorescent', label: 'Fluorescent' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '5', label: '5W' }, { value: '9', label: '9W' }, { value: '12', label: '12W' }, { value: '15', label: '15W' }, { value: '20', label: '20W' }] },
      ], getWattage: bulbWattage },
      { id: 'charger', name: 'Phone/Device Chargers', icon: '📱', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'standard', label: 'Standard (5W)' }, { value: 'fast', label: 'Fast Charger (18W)' }, { value: 'super-fast', label: 'Super Fast (45W)' }] },
      ], getWattage: chargerWattage },
      { id: 'laptop', name: 'Laptop', icon: '💻', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'ultrabook', label: 'Ultrabook (45W)' }, { value: 'standard', label: 'Standard (65W)' }, { value: 'gaming', label: 'Gaming (150W)' }] },
      ], getWattage: laptopWattage },
    ],
  },
  {
    id: 'kitchen', name: 'Kitchen', icon: '🍳',
    equipment: [
      { id: 'refrigerator', name: 'Refrigerator', icon: '🧊', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'single-door', label: 'Single Door' }, { value: 'double-door', label: 'Double Door' }, { value: 'side-by-side', label: 'Side by Side' }, { value: 'mini', label: 'Mini Fridge' }, { value: 'inverter', label: 'Inverter Fridge' }] },
        { key: 'size', label: 'Size', options: [{ value: '100', label: '<100L' }, { value: '200', label: '100-200L' }, { value: '300', label: '200-300L' }, { value: '400', label: '300-400L' }, { value: '500', label: '400L+' }] },
      ], getWattage: fridgeWattage },
      { id: 'freezer', name: 'Freezer', icon: '🧊', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'chest', label: 'Chest Freezer' }, { value: 'upright', label: 'Upright Freezer' }] },
        { key: 'size', label: 'Size', options: [{ value: '100', label: '<100L' }, { value: '200', label: '100-200L' }, { value: '300', label: '200-300L' }, { value: '400', label: '300L+' }] },
      ], getWattage: freezerWattage },
      { id: 'microwave', name: 'Microwave', icon: '🔥', fields: [
        { key: 'size', label: 'Size', options: [{ value: 'small', label: 'Small (20L)' }, { value: 'medium', label: 'Medium (25-30L)' }, { value: 'large', label: 'Large (30L+)' }] },
      ], getWattage: microwaveWattage },
      { id: 'kettle', name: 'Electric Kettle', icon: '☕', fields: [
        { key: 'size', label: 'Size', options: [{ value: 'small', label: 'Small (1L)' }, { value: 'medium', label: 'Medium (1.5-2L)' }, { value: 'large', label: 'Large (2L+)' }] },
      ], getWattage: kettleWattage },
      { id: 'blender', name: 'Blender', icon: '🫗', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'small', label: 'Small/Personal' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large/Commercial' }] },
      ], getWattage: blenderWattage },
      { id: 'cooker', name: 'Electric Cooker', icon: '🍳', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'single', label: 'Single Burner' }, { value: 'double', label: 'Double Burner' }, { value: 'induction', label: 'Induction Cooker' }] },
      ], getWattage: cookerWattage },
      { id: 'kitchen-bulb', name: 'Kitchen Lights', icon: '💡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'energy-saving', label: 'Energy Saving' }, { value: 'incandescent', label: 'Incandescent' }, { value: 'fluorescent', label: 'Fluorescent' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '5', label: '5W' }, { value: '9', label: '9W' }, { value: '12', label: '12W' }, { value: '15', label: '15W' }, { value: '20', label: '20W' }] },
      ], getWattage: bulbWattage },
    ],
  },
  {
    id: 'bathroom', name: 'Bathroom', icon: '🚿',
    equipment: [
      { id: 'water-heater', name: 'Water Heater', icon: '🔥', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'instant', label: 'Instant' }, { value: 'storage-25', label: 'Storage (25L)' }, { value: 'storage-50', label: 'Storage (50L)' }, { value: 'storage-100', label: 'Storage (100L)' }] },
      ], getWattage: heaterWattage },
      { id: 'bathroom-bulb', name: 'Bathroom Lights', icon: '💡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'energy-saving', label: 'Energy Saving' }, { value: 'incandescent', label: 'Incandescent' }, { value: 'fluorescent', label: 'Fluorescent' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '5', label: '5W' }, { value: '9', label: '9W' }, { value: '12', label: '12W' }, { value: '15', label: '15W' }, { value: '20', label: '20W' }] },
      ], getWattage: bulbWattage },
      { id: 'hair-dryer', name: 'Hair Dryer', icon: '💨', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'standard', label: 'Standard' }, { value: 'professional', label: 'Professional' }] },
      ], getWattage: hairDryerWattage },
      { id: 'exhaust-fan', name: 'Exhaust Fan', icon: '🌀', fields: [
        { key: 'size', label: 'Size', options: [{ value: 'small', label: 'Small (6-8")' }, { value: 'medium', label: 'Medium (10-12")' }] },
      ], getWattage: exhaustFanWattage },
    ],
  },
  {
    id: 'general', name: 'General', icon: '🏠',
    equipment: [
      { id: 'washing-machine', name: 'Washing Machine', icon: '👕', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'top-manual', label: 'Top Load (Manual)' }, { value: 'top-auto', label: 'Top Load (Auto)' }, { value: 'front-auto', label: 'Front Load (Auto)' }, { value: 'front-inverter', label: 'Front Load (Inverter)' }] },
      ], getWattage: washerWattage },
      { id: 'iron', name: 'Pressing Iron', icon: '👔', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'dry', label: 'Dry Iron' }, { value: 'steam', label: 'Steam Iron' }, { value: 'cordless', label: 'Cordless Iron' }] },
      ], getWattage: ironWattage },
      { id: 'water-pump', name: 'Water Pump', icon: '💧', fields: [
        { key: 'capacity', label: 'Capacity', options: [{ value: '0.5', label: '0.5 HP' }, { value: '1', label: '1 HP' }, { value: '1.5', label: '1.5 HP' }, { value: '2', label: '2 HP' }] },
      ], getWattage: pumpWattage },
      { id: 'router', name: 'WiFi Router/Modem', icon: '📡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'router', label: 'Standard Router' }, { value: 'modem-router', label: 'Modem + Router' }, { value: 'mesh', label: 'Mesh System' }] },
      ], getWattage: routerWattage },
      { id: 'decoder', name: 'Cable Decoder', icon: '📡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'dstv', label: 'DSTV' }, { value: 'gotv', label: 'GOTV' }, { value: 'startimes', label: 'StarTimes' }, { value: 'other', label: 'Other' }] },
      ], getWattage: decoderWattage },
      { id: 'security-light', name: 'Security/Outdoor Lights', icon: '🔦', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED Flood' }, { value: 'halogen', label: 'Halogen' }, { value: 'sensor', label: 'Motion Sensor' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '10', label: '10W' }, { value: '20', label: '20W' }, { value: '30', label: '30W' }, { value: '50', label: '50W' }, { value: '100', label: '100W' }] },
      ], getWattage: securityLightWattage },
      { id: 'desktop', name: 'Desktop Computer', icon: '🖥️', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'basic', label: 'Basic/Office' }, { value: 'gaming', label: 'Gaming PC' }, { value: 'workstation', label: 'Workstation' }] },
      ], getWattage: desktopWattage },
    ],
  },
];

// ============== SPACE-SPECIFIC ROOM CONFIGURATIONS ==============

// Studio/Self-Contain: Combined living+bedroom, kitchenette, bathroom
const STUDIO_ROOMS: RoomDef[] = [
  {
    id: 'main-room', name: 'Main Room', icon: '🛋️',
    equipment: [
      // TV from living
      { id: 'tv', name: 'Television', icon: '📺', fields: [
        { key: 'brand', label: 'Brand', options: [{ value: 'samsung', label: 'Samsung' }, { value: 'lg', label: 'LG' }, { value: 'sony', label: 'Sony' }, { value: 'hisense', label: 'Hisense' }, { value: 'tcl', label: 'TCL' }, { value: 'other', label: 'Other' }] },
        { key: 'size', label: 'Size', options: [{ value: '32', label: '32"' }, { value: '43', label: '43"' }, { value: '50', label: '50"' }, { value: '55', label: '55"' }, { value: '65', label: '65"' }] },
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'oled', label: 'OLED' }, { value: 'smart', label: 'Smart TV' }] },
      ], getWattage: tvWattage },
      // Fan
      { id: 'fan', name: 'Fan', icon: '🌀', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'ceiling', label: 'Ceiling Fan' }, { value: 'standing', label: 'Standing Fan' }, { value: 'table', label: 'Table Fan' }] },
      ], getWattage: fanWattage },
      // AC
      { id: 'ac', name: 'Air Conditioner', icon: '❄️', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'split', label: 'Split Unit' }, { value: 'window', label: 'Window Unit' }, { value: 'portable', label: 'Portable' }, { value: 'inverter', label: 'Inverter AC' }] },
        { key: 'capacity', label: 'Capacity', options: [{ value: '1', label: '1 HP' }, { value: '1.5', label: '1.5 HP' }] },
      ], getWattage: acWattage },
      // Light bulbs
      { id: 'main-bulb', name: 'Light Bulbs', icon: '💡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'energy-saving', label: 'Energy Saving' }, { value: 'incandescent', label: 'Incandescent' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '5', label: '5W' }, { value: '9', label: '9W' }, { value: '12', label: '12W' }, { value: '15', label: '15W' }] },
      ], getWattage: bulbWattage },
      // Sound
      { id: 'sound', name: 'Sound System/Speaker', icon: '🔊', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'soundbar', label: 'Soundbar' }, { value: 'bluetooth', label: 'Bluetooth Speaker' }, { value: 'hifi', label: 'Hi-Fi System' }] },
      ], getWattage: soundWattage },
      // Phone Charger
      { id: 'charger', name: 'Phone/Device Chargers', icon: '📱', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'standard', label: 'Standard (5W)' }, { value: 'fast', label: 'Fast Charger (18W)' }, { value: 'super-fast', label: 'Super Fast (45W)' }] },
      ], getWattage: chargerWattage },
      // Laptop
      { id: 'laptop', name: 'Laptop', icon: '💻', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'ultrabook', label: 'Ultrabook (45W)' }, { value: 'standard', label: 'Standard (65W)' }, { value: 'gaming', label: 'Gaming (150W)' }] },
      ], getWattage: laptopWattage },
    ],
  },
  {
    id: 'kitchenette', name: 'Kitchenette', icon: '🍳',
    equipment: [
      // Mini/Small fridge only for studio
      { id: 'refrigerator', name: 'Mini/Small Fridge', icon: '🧊', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'mini', label: 'Mini Fridge' }, { value: 'single-door', label: 'Single Door' }, { value: 'inverter', label: 'Inverter Fridge' }] },
        { key: 'size', label: 'Size', options: [{ value: '100', label: '<100L' }, { value: '200', label: '100-200L' }] },
      ], getWattage: fridgeWattage },
      { id: 'microwave', name: 'Microwave', icon: '🔥', fields: [
        { key: 'size', label: 'Size', options: [{ value: 'small', label: 'Small (20L)' }, { value: 'medium', label: 'Medium (25-30L)' }] },
      ], getWattage: microwaveWattage },
      { id: 'kettle', name: 'Electric Kettle', icon: '☕', fields: [
        { key: 'size', label: 'Size', options: [{ value: 'small', label: 'Small (1L)' }, { value: 'medium', label: 'Medium (1.5-2L)' }] },
      ], getWattage: kettleWattage },
      { id: 'blender', name: 'Blender', icon: '🫗', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'small', label: 'Small/Personal' }, { value: 'medium', label: 'Medium' }] },
      ], getWattage: blenderWattage },
      { id: 'cooker', name: 'Electric Hot Plate', icon: '🍳', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'single', label: 'Single Burner' }, { value: 'induction', label: 'Induction Cooker' }] },
      ], getWattage: cookerWattage },
      { id: 'kitchen-bulb', name: 'Kitchen Light', icon: '💡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'energy-saving', label: 'Energy Saving' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '5', label: '5W' }, { value: '9', label: '9W' }, { value: '12', label: '12W' }] },
      ], getWattage: bulbWattage },
    ],
  },
  {
    id: 'bathroom', name: 'Bathroom', icon: '🚿',
    equipment: [
      { id: 'water-heater', name: 'Water Heater', icon: '🔥', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'instant', label: 'Instant' }, { value: 'storage-25', label: 'Storage (25L)' }] },
      ], getWattage: heaterWattage },
      { id: 'bathroom-bulb', name: 'Bathroom Light', icon: '💡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'energy-saving', label: 'Energy Saving' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '5', label: '5W' }, { value: '9', label: '9W' }, { value: '12', label: '12W' }] },
      ], getWattage: bulbWattage },
      { id: 'exhaust-fan', name: 'Exhaust Fan', icon: '🌀', fields: [
        { key: 'size', label: 'Size', options: [{ value: 'small', label: 'Small (6-8")' }, { value: 'medium', label: 'Medium (10-12")' }] },
      ], getWattage: exhaustFanWattage },
    ],
  },
  {
    id: 'general', name: 'Other', icon: '🏠',
    equipment: [
      { id: 'iron', name: 'Pressing Iron', icon: '👔', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'dry', label: 'Dry Iron' }, { value: 'steam', label: 'Steam Iron' }] },
      ], getWattage: ironWattage },
      { id: 'router', name: 'WiFi Router', icon: '📡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'router', label: 'Standard Router' }, { value: 'modem-router', label: 'Modem + Router' }] },
      ], getWattage: routerWattage },
      { id: 'decoder', name: 'Cable Decoder', icon: '📡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'dstv', label: 'DSTV' }, { value: 'gotv', label: 'GOTV' }, { value: 'startimes', label: 'StarTimes' }, { value: 'other', label: 'Other' }] },
      ], getWattage: decoderWattage },
      { id: 'security-light', name: 'Security Light', icon: '🔦', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED Flood' }, { value: 'sensor', label: 'Motion Sensor' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '10', label: '10W' }, { value: '20', label: '20W' }, { value: '30', label: '30W' }] },
      ], getWattage: securityLightWattage },
    ],
  },
];

// Church/Worship Center rooms
const CHURCH_ROOMS: RoomDef[] = [
  {
    id: 'auditorium', name: 'Main Auditorium', icon: '⛪',
    equipment: [
      { id: 'auditorium-ac', name: 'Air Conditioning', icon: '❄️', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'split', label: 'Split Unit' }, { value: 'standing', label: 'Standing AC' }, { value: 'central', label: 'Central AC' }] },
        { key: 'capacity', label: 'Capacity', options: [{ value: '2', label: '2 HP' }, { value: '2.5', label: '2.5 HP' }, { value: '5', label: '5 HP (Package)' }] },
      ], getWattage: (sel, qty) => {
        const capMap: Record<string, number> = { '2': 1800, '2.5': 2200, '5': 4500 };
        const typeM: Record<string, number> = { split: 1, standing: 1.1, central: 0.9 };
        return Math.round((capMap[sel.capacity] || 2200) * (typeM[sel.type] || 1)) * qty;
      }},
      { id: 'auditorium-fan', name: 'Ceiling/Industrial Fan', icon: '🌀', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'ceiling', label: 'Ceiling Fan' }, { value: 'industrial', label: 'Industrial Fan' }] },
      ], getWattage: (sel, qty) => {
        const typeMap: Record<string, number> = { ceiling: 75, industrial: 150 };
        return (typeMap[sel.type] || 75) * qty;
      }},
      { id: 'auditorium-bulb', name: 'Auditorium Lighting', icon: '💡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led-panel', label: 'LED Panel Lights' }, { value: 'led-bulb', label: 'LED Bulbs' }, { value: 'fluorescent', label: 'Fluorescent Tubes' }, { value: 'chandelier', label: 'Chandelier' }] },
        { key: 'wattage', label: 'Wattage Each', options: [{ value: '12', label: '12W' }, { value: '18', label: '18W' }, { value: '24', label: '24W' }, { value: '36', label: '36W' }, { value: '48', label: '48W' }] },
      ], getWattage: bulbWattage },
      { id: 'sound-system', name: 'PA/Sound System', icon: '🔊', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'small', label: 'Small (2 speakers)' }, { value: 'medium', label: 'Medium (4-6 speakers)' }, { value: 'large', label: 'Large (8+ speakers)' }, { value: 'professional', label: 'Professional PA' }] },
      ], getWattage: (sel, qty) => {
        const typeMap: Record<string, number> = { small: 300, medium: 600, large: 1200, professional: 2500 };
        return (typeMap[sel.type] || 600) * qty;
      }},
      { id: 'projector', name: 'Projector/Screen', icon: '📽️', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'projector', label: 'LCD/DLP Projector' }, { value: 'led-screen', label: 'LED Display Screen' }, { value: 'tv-screen', label: 'Large TV (65"+)' }] },
      ], getWattage: (sel, qty) => {
        const typeMap: Record<string, number> = { projector: 300, 'led-screen': 500, 'tv-screen': 150 };
        return (typeMap[sel.type] || 300) * qty;
      }},
      { id: 'musical-instruments', name: 'Musical Instruments', icon: '🎸', fields: [
        { key: 'type', label: 'Setup', options: [{ value: 'keyboard', label: 'Keyboard Only' }, { value: 'band-small', label: 'Small Band Setup' }, { value: 'band-full', label: 'Full Band Setup' }] },
      ], getWattage: (sel, qty) => {
        const typeMap: Record<string, number> = { keyboard: 50, 'band-small': 200, 'band-full': 500 };
        return (typeMap[sel.type] || 200) * qty;
      }},
    ],
  },
  {
    id: 'church-office', name: 'Church Office', icon: '🏢',
    equipment: [
      { id: 'office-ac', name: 'Office AC', icon: '❄️', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'split', label: 'Split Unit' }, { value: 'window', label: 'Window Unit' }] },
        { key: 'capacity', label: 'Capacity', options: [{ value: '1', label: '1 HP' }, { value: '1.5', label: '1.5 HP' }, { value: '2', label: '2 HP' }] },
      ], getWattage: acWattage },
      { id: 'office-fan', name: 'Office Fan', icon: '🌀', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'ceiling', label: 'Ceiling Fan' }, { value: 'standing', label: 'Standing Fan' }] },
      ], getWattage: fanWattage },
      { id: 'office-desktop', name: 'Desktop Computer', icon: '🖥️', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'basic', label: 'Basic/Office' }, { value: 'workstation', label: 'Workstation' }] },
      ], getWattage: desktopWattage },
      { id: 'office-printer', name: 'Printer/Copier', icon: '🖨️', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'inkjet', label: 'Inkjet Printer' }, { value: 'laser', label: 'Laser Printer' }, { value: 'copier', label: 'Copier/MFP' }] },
      ], getWattage: (sel, qty) => {
        const typeMap: Record<string, number> = { inkjet: 30, laser: 500, copier: 900 };
        return (typeMap[sel.type] || 50) * qty;
      }},
      { id: 'office-bulb', name: 'Office Lights', icon: '💡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'fluorescent', label: 'Fluorescent' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '9', label: '9W' }, { value: '12', label: '12W' }, { value: '18', label: '18W' }] },
      ], getWattage: bulbWattage },
    ],
  },
  {
    id: 'church-classroom', name: 'Classrooms/Children', icon: '📚',
    equipment: [
      { id: 'class-fan', name: 'Classroom Fan', icon: '🌀', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'ceiling', label: 'Ceiling Fan' }, { value: 'standing', label: 'Standing Fan' }] },
      ], getWattage: fanWattage },
      { id: 'class-bulb', name: 'Classroom Lights', icon: '💡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'fluorescent', label: 'Fluorescent' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '9', label: '9W' }, { value: '12', label: '12W' }, { value: '18', label: '18W' }] },
      ], getWattage: bulbWattage },
      { id: 'class-ac', name: 'Classroom AC', icon: '❄️', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'split', label: 'Split Unit' }, { value: 'window', label: 'Window Unit' }] },
        { key: 'capacity', label: 'Capacity', options: [{ value: '1.5', label: '1.5 HP' }, { value: '2', label: '2 HP' }] },
      ], getWattage: acWattage },
    ],
  },
  {
    id: 'church-general', name: 'General/Compound', icon: '🏠',
    equipment: [
      { id: 'church-security', name: 'Security/Outdoor Lights', icon: '🔦', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED Flood' }, { value: 'halogen', label: 'Halogen' }, { value: 'sensor', label: 'Motion Sensor' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '30', label: '30W' }, { value: '50', label: '50W' }, { value: '100', label: '100W' }, { value: '200', label: '200W' }] },
      ], getWattage: securityLightWattage },
      { id: 'church-water-pump', name: 'Water Pump', icon: '💧', fields: [
        { key: 'capacity', label: 'Capacity', options: [{ value: '0.5', label: '0.5 HP' }, { value: '1', label: '1 HP' }, { value: '1.5', label: '1.5 HP' }] },
      ], getWattage: pumpWattage },
      { id: 'church-router', name: 'WiFi Router', icon: '📡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'router', label: 'Standard Router' }, { value: 'mesh', label: 'Mesh System' }] },
      ], getWattage: routerWattage },
      { id: 'church-bathroom-bulb', name: 'Restroom Lights', icon: '💡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'energy-saving', label: 'Energy Saving' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '9', label: '9W' }, { value: '12', label: '12W' }] },
      ], getWattage: bulbWattage },
      { id: 'church-kitchen-fridge', name: 'Kitchen Refrigerator', icon: '🧊', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'single-door', label: 'Single Door' }, { value: 'double-door', label: 'Double Door' }] },
        { key: 'size', label: 'Size', options: [{ value: '200', label: '100-200L' }, { value: '300', label: '200-300L' }] },
      ], getWattage: fridgeWattage },
      { id: 'church-freezer', name: 'Kitchen Freezer', icon: '🧊', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'chest', label: 'Chest Freezer' }, { value: 'upright', label: 'Upright Freezer' }] },
        { key: 'size', label: 'Size', options: [{ value: '200', label: '100-200L' }, { value: '300', label: '200-300L' }] },
      ], getWattage: freezerWattage },
    ],
  },
];

// Shop/Store rooms
const SHOP_ROOMS: RoomDef[] = [
  {
    id: 'shop-main', name: 'Shop Floor', icon: '🏪',
    equipment: [
      { id: 'shop-ac', name: 'Air Conditioning', icon: '❄️', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'split', label: 'Split Unit' }, { value: 'standing', label: 'Standing AC' }] },
        { key: 'capacity', label: 'Capacity', options: [{ value: '1.5', label: '1.5 HP' }, { value: '2', label: '2 HP' }, { value: '2.5', label: '2.5 HP' }] },
      ], getWattage: acWattage },
      { id: 'shop-fan', name: 'Fan', icon: '🌀', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'ceiling', label: 'Ceiling Fan' }, { value: 'standing', label: 'Standing Fan' }] },
      ], getWattage: fanWattage },
      { id: 'shop-bulb', name: 'Shop Lighting', icon: '💡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'led-panel', label: 'LED Panel' }, { value: 'fluorescent', label: 'Fluorescent' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '9', label: '9W' }, { value: '12', label: '12W' }, { value: '18', label: '18W' }, { value: '24', label: '24W' }, { value: '36', label: '36W' }] },
      ], getWattage: bulbWattage },
      { id: 'shop-display-fridge', name: 'Display Fridge/Cooler', icon: '🧊', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'display', label: 'Display Cooler' }, { value: 'chest', label: 'Chest Freezer' }, { value: 'upright', label: 'Upright Display' }] },
        { key: 'size', label: 'Size', options: [{ value: '200', label: 'Small' }, { value: '300', label: 'Medium' }, { value: '400', label: 'Large' }] },
      ], getWattage: (sel, qty) => {
        const sizeMap: Record<string, number> = { '200': 200, '300': 300, '400': 450 };
        return (sizeMap[sel.size] || 250) * qty;
      }},
      { id: 'shop-tv', name: 'Display TV/Screen', icon: '📺', fields: [
        { key: 'size', label: 'Size', options: [{ value: '32', label: '32"' }, { value: '43', label: '43"' }, { value: '55', label: '55"' }] },
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'smart', label: 'Smart TV' }] },
      ], getWattage: tvWattage },
      { id: 'shop-pos', name: 'POS Terminal/Register', icon: '💳', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'pos', label: 'POS Machine' }, { value: 'register', label: 'Cash Register' }, { value: 'computer', label: 'Computer + POS' }] },
      ], getWattage: (sel, qty) => {
        const typeMap: Record<string, number> = { pos: 15, register: 25, computer: 250 };
        return (typeMap[sel.type] || 25) * qty;
      }},
      { id: 'shop-desktop', name: 'Computer/Laptop', icon: '🖥️', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'basic', label: 'Basic Desktop' }, { value: 'laptop', label: 'Laptop' }] },
      ], getWattage: (sel, qty) => {
        const typeMap: Record<string, number> = { basic: 200, laptop: 65 };
        return (typeMap[sel.type] || 65) * qty;
      }},
    ],
  },
  {
    id: 'shop-storage', name: 'Storage/Back Room', icon: '📦',
    equipment: [
      { id: 'storage-bulb', name: 'Storage Lights', icon: '💡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'fluorescent', label: 'Fluorescent' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '9', label: '9W' }, { value: '12', label: '12W' }, { value: '18', label: '18W' }] },
      ], getWattage: bulbWattage },
      { id: 'storage-freezer', name: 'Freezer/Fridge', icon: '🧊', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'chest', label: 'Chest Freezer' }, { value: 'upright', label: 'Upright Freezer' }, { value: 'single-door', label: 'Fridge' }] },
        { key: 'size', label: 'Size', options: [{ value: '200', label: 'Small' }, { value: '300', label: 'Medium' }, { value: '400', label: 'Large' }] },
      ], getWattage: freezerWattage },
    ],
  },
  {
    id: 'shop-general', name: 'General/Exterior', icon: '🏠',
    equipment: [
      { id: 'shop-security', name: 'Security/Sign Lights', icon: '🔦', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED Flood' }, { value: 'neon', label: 'Neon/LED Sign' }, { value: 'sensor', label: 'Motion Sensor' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '20', label: '20W' }, { value: '30', label: '30W' }, { value: '50', label: '50W' }, { value: '100', label: '100W' }] },
      ], getWattage: securityLightWattage },
      { id: 'shop-cctv', name: 'CCTV System', icon: '📹', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'small', label: '2-4 Cameras' }, { value: 'medium', label: '4-8 Cameras' }, { value: 'large', label: '8+ Cameras' }] },
      ], getWattage: (sel, qty) => {
        const typeMap: Record<string, number> = { small: 30, medium: 60, large: 100 };
        return (typeMap[sel.type] || 40) * qty;
      }},
      { id: 'shop-router', name: 'WiFi Router', icon: '📡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'router', label: 'Standard Router' }, { value: 'modem-router', label: 'Modem + Router' }] },
      ], getWattage: routerWattage },
    ],
  },
];

// Office Space rooms
const OFFICE_ROOMS: RoomDef[] = [
  {
    id: 'reception', name: 'Reception Area', icon: '🛎️',
    equipment: [
      { id: 'reception-ac', name: 'Reception AC', icon: '❄️', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'split', label: 'Split Unit' }, { value: 'standing', label: 'Standing AC' }, { value: 'inverter', label: 'Inverter AC' }] },
        { key: 'capacity', label: 'Capacity', options: [{ value: '1.5', label: '1.5 HP' }, { value: '2', label: '2 HP' }, { value: '2.5', label: '2.5 HP' }] },
      ], getWattage: acWattage },
      { id: 'reception-bulb', name: 'Reception Lights', icon: '💡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'led-panel', label: 'LED Panel' }, { value: 'fluorescent', label: 'Fluorescent' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '12', label: '12W' }, { value: '18', label: '18W' }, { value: '24', label: '24W' }] },
      ], getWattage: bulbWattage },
      { id: 'reception-tv', name: 'Display TV', icon: '📺', fields: [
        { key: 'size', label: 'Size', options: [{ value: '43', label: '43"' }, { value: '55', label: '55"' }, { value: '65', label: '65"' }] },
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'smart', label: 'Smart TV' }] },
      ], getWattage: tvWattage },
      { id: 'reception-desktop', name: 'Reception Computer', icon: '🖥️', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'basic', label: 'Basic Desktop' }, { value: 'workstation', label: 'Workstation' }] },
      ], getWattage: desktopWattage },
      { id: 'reception-fan', name: 'Fan', icon: '🌀', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'ceiling', label: 'Ceiling Fan' }, { value: 'standing', label: 'Standing Fan' }] },
      ], getWattage: fanWattage },
      { id: 'reception-water-dispenser', name: 'Water Dispenser', icon: '💧', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'cold', label: 'Cold Only' }, { value: 'hot-cold', label: 'Hot & Cold' }] },
      ], getWattage: (sel, qty) => {
        const typeMap: Record<string, number> = { cold: 100, 'hot-cold': 500 };
        return (typeMap[sel.type] || 100) * qty;
      }},
    ],
  },
  {
    id: 'office-room', name: 'Office(s)', icon: '💼',
    equipment: [
      { id: 'ofc-ac', name: 'Office AC', icon: '❄️', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'split', label: 'Split Unit' }, { value: 'window', label: 'Window Unit' }, { value: 'inverter', label: 'Inverter AC' }] },
        { key: 'capacity', label: 'Capacity', options: [{ value: '1', label: '1 HP' }, { value: '1.5', label: '1.5 HP' }, { value: '2', label: '2 HP' }] },
      ], getWattage: acWattage },
      { id: 'ofc-fan', name: 'Office Fan', icon: '🌀', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'ceiling', label: 'Ceiling Fan' }, { value: 'standing', label: 'Standing Fan' }] },
      ], getWattage: fanWattage },
      { id: 'ofc-desktop', name: 'Desktop Computer', icon: '🖥️', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'basic', label: 'Basic/Office' }, { value: 'gaming', label: 'Gaming/High-end' }, { value: 'workstation', label: 'Workstation' }] },
      ], getWattage: desktopWattage },
      { id: 'ofc-laptop', name: 'Laptop', icon: '💻', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'ultrabook', label: 'Ultrabook (45W)' }, { value: 'standard', label: 'Standard (65W)' }, { value: 'gaming', label: 'Power User (150W)' }] },
      ], getWattage: laptopWattage },
      { id: 'ofc-monitor', name: 'External Monitor', icon: '🖥️', fields: [
        { key: 'type', label: 'Size', options: [{ value: 'small', label: '21-24"' }, { value: 'medium', label: '27"' }, { value: 'large', label: '32"+' }] },
      ], getWattage: (sel, qty) => {
        const typeMap: Record<string, number> = { small: 25, medium: 35, large: 50 };
        return (typeMap[sel.type] || 30) * qty;
      }},
      { id: 'ofc-printer', name: 'Printer/Copier', icon: '🖨️', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'inkjet', label: 'Inkjet' }, { value: 'laser', label: 'Laser' }, { value: 'copier', label: 'Copier/MFP' }] },
      ], getWattage: (sel, qty) => {
        const typeMap: Record<string, number> = { inkjet: 30, laser: 500, copier: 900 };
        return (typeMap[sel.type] || 50) * qty;
      }},
      { id: 'ofc-bulb', name: 'Office Lights', icon: '💡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'led-panel', label: 'LED Panel' }, { value: 'fluorescent', label: 'Fluorescent' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '9', label: '9W' }, { value: '12', label: '12W' }, { value: '18', label: '18W' }, { value: '24', label: '24W' }] },
      ], getWattage: bulbWattage },
      { id: 'ofc-charger', name: 'Phone Chargers', icon: '📱', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'standard', label: 'Standard (5W)' }, { value: 'fast', label: 'Fast (18W)' }] },
      ], getWattage: chargerWattage },
    ],
  },
  {
    id: 'meeting-room', name: 'Meeting/Conference', icon: '🤝',
    equipment: [
      { id: 'meet-ac', name: 'AC', icon: '❄️', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'split', label: 'Split Unit' }, { value: 'inverter', label: 'Inverter AC' }] },
        { key: 'capacity', label: 'Capacity', options: [{ value: '1.5', label: '1.5 HP' }, { value: '2', label: '2 HP' }] },
      ], getWattage: acWattage },
      { id: 'meet-tv', name: 'Presentation TV/Projector', icon: '📺', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED TV' }, { value: 'smart', label: 'Smart TV' }, { value: 'projector', label: 'Projector' }] },
        { key: 'size', label: 'Size', options: [{ value: '55', label: '55"' }, { value: '65', label: '65"' }, { value: '75', label: '75"+' }] },
      ], getWattage: (sel, qty) => {
        if (sel.type === 'projector') return 300 * qty;
        return tvWattage(sel, qty);
      }},
      { id: 'meet-bulb', name: 'Meeting Room Lights', icon: '💡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'led-panel', label: 'LED Panel' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '12', label: '12W' }, { value: '18', label: '18W' }, { value: '24', label: '24W' }] },
      ], getWattage: bulbWattage },
    ],
  },
  {
    id: 'office-kitchen', name: 'Kitchen/Pantry', icon: '🍳',
    equipment: [
      { id: 'okitchen-fridge', name: 'Office Fridge', icon: '🧊', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'mini', label: 'Mini Fridge' }, { value: 'single-door', label: 'Single Door' }] },
        { key: 'size', label: 'Size', options: [{ value: '100', label: '<100L' }, { value: '200', label: '100-200L' }] },
      ], getWattage: fridgeWattage },
      { id: 'okitchen-microwave', name: 'Microwave', icon: '🔥', fields: [
        { key: 'size', label: 'Size', options: [{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }] },
      ], getWattage: microwaveWattage },
      { id: 'okitchen-kettle', name: 'Electric Kettle', icon: '☕', fields: [
        { key: 'size', label: 'Size', options: [{ value: 'small', label: 'Small (1L)' }, { value: 'medium', label: 'Medium (1.5-2L)' }] },
      ], getWattage: kettleWattage },
      { id: 'okitchen-dispenser', name: 'Water Dispenser', icon: '💧', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'cold', label: 'Cold Only' }, { value: 'hot-cold', label: 'Hot & Cold' }] },
      ], getWattage: (sel, qty) => {
        const typeMap: Record<string, number> = { cold: 100, 'hot-cold': 500 };
        return (typeMap[sel.type] || 100) * qty;
      }},
      { id: 'okitchen-bulb', name: 'Kitchen Light', icon: '💡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '9', label: '9W' }, { value: '12', label: '12W' }] },
      ], getWattage: bulbWattage },
    ],
  },
  {
    id: 'office-general', name: 'General/Server', icon: '🖧',
    equipment: [
      { id: 'server', name: 'Server/Network Equipment', icon: '🖧', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'small-server', label: 'Small Server' }, { value: 'nas', label: 'NAS Storage' }, { value: 'rack', label: 'Server Rack' }] },
      ], getWattage: (sel, qty) => {
        const typeMap: Record<string, number> = { 'small-server': 300, nas: 100, rack: 1000 };
        return (typeMap[sel.type] || 300) * qty;
      }},
      { id: 'office-router', name: 'WiFi Router/Switch', icon: '📡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'router', label: 'Standard Router' }, { value: 'mesh', label: 'Mesh System' }, { value: 'enterprise', label: 'Enterprise AP + Switch' }] },
      ], getWattage: (sel, qty) => {
        const typeMap: Record<string, number> = { router: 12, mesh: 25, enterprise: 60 };
        return (typeMap[sel.type] || 15) * qty;
      }},
      { id: 'office-cctv', name: 'CCTV System', icon: '📹', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'small', label: '2-4 Cameras' }, { value: 'medium', label: '4-8 Cameras' }, { value: 'large', label: '8+ Cameras' }] },
      ], getWattage: (sel, qty) => {
        const typeMap: Record<string, number> = { small: 30, medium: 60, large: 100 };
        return (typeMap[sel.type] || 40) * qty;
      }},
      { id: 'office-security', name: 'Security/Outdoor Lights', icon: '🔦', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED Flood' }, { value: 'sensor', label: 'Motion Sensor' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '20', label: '20W' }, { value: '30', label: '30W' }, { value: '50', label: '50W' }] },
      ], getWattage: securityLightWattage },
      { id: 'office-bathroom-bulb', name: 'Restroom Lights', icon: '💡', fields: [
        { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }] },
        { key: 'wattage', label: 'Wattage', options: [{ value: '9', label: '9W' }, { value: '12', label: '12W' }] },
      ], getWattage: bulbWattage },
      { id: 'office-water-pump', name: 'Water Pump', icon: '💧', fields: [
        { key: 'capacity', label: 'Capacity', options: [{ value: '0.5', label: '0.5 HP' }, { value: '1', label: '1 HP' }] },
      ], getWattage: pumpWattage },
    ],
  },
];

// Map space types to their room configs
export function getRoomsForSpace(spaceId: string): RoomDef[] {
  switch (spaceId) {
    case 'studio':
      return STUDIO_ROOMS;
    case 'church':
      return CHURCH_ROOMS;
    case 'shop':
      return SHOP_ROOMS;
    case 'office':
      return OFFICE_ROOMS;
    default:
      // All residential types use the standard ROOMS
      return ROOMS;
  }
}

// Also add usage time defaults for new equipment IDs
const EXTRA_USAGE_TIMES: Record<string, DefaultUsageTime> = {
  'main-bulb':             { start: 18, end: 23, is24h: false },
  'auditorium-ac':         { start: 8,  end: 14, is24h: false },
  'auditorium-fan':        { start: 8,  end: 14, is24h: false },
  'auditorium-bulb':       { start: 8,  end: 14, is24h: false },
  'sound-system':          { start: 8,  end: 14, is24h: false },
  'projector':             { start: 8,  end: 14, is24h: false },
  'musical-instruments':   { start: 8,  end: 14, is24h: false },
  'office-ac':             { start: 8,  end: 17, is24h: false },
  'office-fan':            { start: 8,  end: 17, is24h: false },
  'office-desktop':        { start: 8,  end: 17, is24h: false },
  'office-printer':        { start: 9,  end: 17, is24h: false },
  'office-bulb':           { start: 8,  end: 18, is24h: false },
  'class-fan':             { start: 8,  end: 14, is24h: false },
  'class-bulb':            { start: 8,  end: 14, is24h: false },
  'class-ac':              { start: 8,  end: 14, is24h: false },
  'church-security':       { start: 18, end: 6,  is24h: false },
  'church-water-pump':     { start: 6,  end: 18, is24h: false },
  'church-router':         { start: 0,  end: 0,  is24h: true  },
  'church-bathroom-bulb':  { start: 8,  end: 14, is24h: false },
  'church-kitchen-fridge': { start: 0,  end: 0,  is24h: true  },
  'church-freezer':        { start: 0,  end: 0,  is24h: true  },
  'shop-ac':               { start: 8,  end: 20, is24h: false },
  'shop-fan':              { start: 8,  end: 20, is24h: false },
  'shop-bulb':             { start: 8,  end: 20, is24h: false },
  'shop-display-fridge':   { start: 0,  end: 0,  is24h: true  },
  'shop-tv':               { start: 8,  end: 20, is24h: false },
  'shop-pos':              { start: 8,  end: 20, is24h: false },
  'shop-desktop':          { start: 8,  end: 18, is24h: false },
  'storage-bulb':          { start: 8,  end: 20, is24h: false },
  'storage-freezer':       { start: 0,  end: 0,  is24h: true  },
  'shop-security':         { start: 18, end: 6,  is24h: false },
  'shop-cctv':             { start: 0,  end: 0,  is24h: true  },
  'shop-router':           { start: 0,  end: 0,  is24h: true  },
  'reception-ac':          { start: 8,  end: 18, is24h: false },
  'reception-bulb':        { start: 8,  end: 18, is24h: false },
  'reception-tv':          { start: 8,  end: 18, is24h: false },
  'reception-desktop':     { start: 8,  end: 18, is24h: false },
  'reception-fan':         { start: 8,  end: 18, is24h: false },
  'reception-water-dispenser': { start: 8, end: 18, is24h: false },
  'ofc-ac':                { start: 8,  end: 18, is24h: false },
  'ofc-fan':               { start: 8,  end: 18, is24h: false },
  'ofc-desktop':           { start: 8,  end: 18, is24h: false },
  'ofc-laptop':            { start: 8,  end: 18, is24h: false },
  'ofc-monitor':           { start: 8,  end: 18, is24h: false },
  'ofc-printer':           { start: 9,  end: 17, is24h: false },
  'ofc-bulb':              { start: 8,  end: 18, is24h: false },
  'ofc-charger':           { start: 8,  end: 18, is24h: false },
  'meet-ac':               { start: 9,  end: 17, is24h: false },
  'meet-tv':               { start: 9,  end: 17, is24h: false },
  'meet-bulb':             { start: 9,  end: 17, is24h: false },
  'okitchen-fridge':       { start: 0,  end: 0,  is24h: true  },
  'okitchen-microwave':    { start: 8,  end: 14, is24h: false },
  'okitchen-kettle':       { start: 8,  end: 17, is24h: false },
  'okitchen-dispenser':    { start: 8,  end: 18, is24h: false },
  'okitchen-bulb':         { start: 8,  end: 18, is24h: false },
  'server':                { start: 0,  end: 0,  is24h: true  },
  'office-router':         { start: 0,  end: 0,  is24h: true  },
  'office-cctv':           { start: 0,  end: 0,  is24h: true  },
  'office-security':       { start: 18, end: 6,  is24h: false },
  'office-bathroom-bulb':  { start: 8,  end: 18, is24h: false },
  'office-water-pump':     { start: 8,  end: 18, is24h: false },
};

// Merge extra usage times into DEFAULT_USAGE_TIMES
Object.assign(DEFAULT_USAGE_TIMES, EXTRA_USAGE_TIMES);

// ============== GENERATOR DATA ==============
export const GENERATOR_SIZES = [
  { value: '1', label: 'Small (0.5 - 1 kVA)' },
  { value: '2.5', label: 'Medium (2 - 3 kVA)' },
  { value: '5', label: 'Large (5 - 6.5 kVA)' },
  { value: '10', label: 'Extra Large (8 - 10 kVA)' },
  { value: '15', label: 'Industrial (12 - 15 kVA)' },
  { value: '20', label: 'Industrial (18 - 20+ kVA)' },
];

export const FUEL_CONSUMPTION: Record<string, number> = {
  '1': 0.5, '2.5': 1.0, '5': 1.8, '10': 3.0, '15': 4.5, '20': 6.0,
};

// ============== SOLAR SYSTEM RECOMMENDATIONS ==============
export interface SolarPackage {
  name: string;
  description: string;
  panelWatts: number;
  panelCount: number;
  batteryKwh: number;
  batteryCount: number;
  inverterKva: number;
  priceMultiplier: number;
  solarDirectKwh: number;  // kWh served directly from panels
  batteryRequiredKwh: number; // kWh that needs battery
}

export interface EnergyProfile {
  totalWatts: number;
  dailyKwh: number;
  solarKwh: number;   // kWh used during solar hours
  batteryKwh: number;  // kWh used during non-solar hours
  solarRatio: number;  // 0-1 ratio of solar usage
}

export function computeEnergyProfile(
  items: { wattage: number; usageStart: number; usageEnd: number; is24h: boolean }[],
  sunStart: number,
  sunEnd: number,
): EnergyProfile {
  let totalWatts = 0;
  let totalDailyWh = 0;
  let totalSolarWh = 0;
  let totalBatteryWh = 0;

  items.forEach(item => {
    totalWatts += item.wattage;
    const usageHrs = getUsageHours(item.usageStart, item.usageEnd, item.is24h);
    const solarHrs = getSolarOverlapHours(item.usageStart, item.usageEnd, item.is24h, sunStart, sunEnd);
    const battHrs = usageHrs - solarHrs;
    totalDailyWh += item.wattage * usageHrs;
    totalSolarWh += item.wattage * solarHrs;
    totalBatteryWh += item.wattage * battHrs;
  });

  const dailyKwh = totalDailyWh / 1000;
  const solarKwh = totalSolarWh / 1000;
  const batteryKwh = totalBatteryWh / 1000;
  const solarRatio = dailyKwh > 0 ? solarKwh / dailyKwh : 0;

  return { totalWatts, dailyKwh, solarKwh, batteryKwh, solarRatio };
}

export function getSolarRecommendations(profile: EnergyProfile, country: CountryData): SolarPackage[] {
  const { totalWatts, solarKwh, batteryKwh, solarRatio } = profile;
  const panelWatts = 550;

  // Panel sizing: needs to generate enough for direct solar use + charge batteries
  // More panels if more daytime usage (direct solar coverage)
  const chargingOverhead = 1.2; // 20% charging loss
  const totalPanelKwh = solarKwh + (batteryKwh * chargingOverhead);
  const systemSizeKw = Math.ceil((totalPanelKwh / country.sunHours) * 1.2 * 10) / 10;
  const panelCount = Math.max(2, Math.ceil((systemSizeKw * 1000) / panelWatts));

  // Battery sizing: based on nighttime/non-solar consumption
  // Less battery if high solar ratio (most usage during day)
  const batteryCapacity = Math.max(2.5, Math.ceil(batteryKwh * 1.2));
  const inverterKva = Math.max(1.5, Math.ceil((totalWatts * 1.25) / 1000));

  const basic: SolarPackage = {
    name: 'Essential',
    description: solarRatio > 0.6
      ? 'Optimized for daytime usage — fewer batteries needed! Covers basic loads.'
      : 'Covers basic loads — lights, fans, phones, TV. Battery-focused for evening/night use.',
    panelWatts,
    panelCount: Math.max(2, Math.ceil(panelCount * 0.5)),
    batteryKwh: Math.max(2.5, Math.ceil(batteryCapacity * 0.4)),
    batteryCount: 1,
    inverterKva: Math.max(1.5, Math.ceil(inverterKva * 0.4)),
    priceMultiplier: 1,
    solarDirectKwh: solarKwh * 0.5,
    batteryRequiredKwh: batteryKwh * 0.4,
  };

  const standard: SolarPackage = {
    name: 'Standard',
    description: solarRatio > 0.6
      ? 'Great fit! Most of your usage is during solar hours — maximizing panel efficiency.'
      : 'Covers most household loads. Sized for your evening/night consumption patterns.',
    panelWatts,
    panelCount: Math.max(4, panelCount),
    batteryKwh: Math.max(5, batteryCapacity),
    batteryCount: Math.max(1, Math.ceil(batteryCapacity / 5)),
    inverterKva: Math.max(3, inverterKva),
    priceMultiplier: 1,
    solarDirectKwh: solarKwh,
    batteryRequiredKwh: batteryKwh,
  };

  const premium: SolarPackage = {
    name: 'Premium',
    description: 'Full coverage including AC and heavy appliances. Complete energy independence.',
    panelWatts,
    panelCount: Math.max(6, Math.ceil(panelCount * 1.3)),
    batteryKwh: Math.max(10, Math.ceil(batteryCapacity * 1.5)),
    batteryCount: Math.max(2, Math.ceil((batteryCapacity * 1.5) / 5)),
    inverterKva: Math.max(5, Math.ceil(inverterKva * 1.3)),
    priceMultiplier: 1,
    solarDirectKwh: solarKwh * 1.3,
    batteryRequiredKwh: batteryKwh * 1.5,
  };

  return [basic, standard, premium];
}

export function estimateSolarPrice(pkg: SolarPackage, country: CountryData): number {
  const panelCost = pkg.panelCount * pkg.panelWatts * 0.4;
  const batteryCost = pkg.batteryKwh * 200;
  const inverterCost = pkg.inverterKva * 150;
  const installCost = (panelCost + batteryCost + inverterCost) * 0.25;
  const totalUSD = panelCost + batteryCost + inverterCost + installCost;

  const conversionRates: Record<string, number> = {
    NGN: 1600, GHS: 15, KES: 155, ZAR: 18, GBP: 0.79, USD: 1, INR: 84, AED: 3.67,
    XOF: 610, XAF: 610, TZS: 2600, UGX: 3800, RWF: 1300, ETB: 56, ZWL: 13,
    ZMW: 25, EGP: 50, MAD: 10, SAR: 3.75, EUR: 0.92, CAD: 1.36, BRL: 5.0,
    PKR: 280, PHP: 56, IDR: 15700, AUD: 1.53,
  };

  return Math.round(totalUSD * (conversionRates[country.currency] || 1));
}

// ============== ROOM COUNT CONFIGURATION ==============
export interface RoomCountConfig {
  roomId: string;
  label: string;
  icon: string;
  min: number;
  max: number;
  default: number;
}

export const SPACE_ROOM_COUNTS: Record<string, { rooms: RoomCountConfig[]; bqAvailable: boolean }> = {
  studio: { bqAvailable: false, rooms: [] },
  '1bed': {
    bqAvailable: false,
    rooms: [
      { roomId: 'bathroom', label: 'Bathroom', icon: '🚿', min: 1, max: 2, default: 1 },
    ],
  },
  '2bed': {
    bqAvailable: false,
    rooms: [
      { roomId: 'bedroom', label: 'Bedroom', icon: '🛏️', min: 2, max: 3, default: 2 },
      { roomId: 'bathroom', label: 'Bathroom', icon: '🚿', min: 1, max: 2, default: 1 },
    ],
  },
  '3bed': {
    bqAvailable: true,
    rooms: [
      { roomId: 'living', label: 'Living Room', icon: '🛋️', min: 1, max: 2, default: 1 },
      { roomId: 'bedroom', label: 'Bedroom', icon: '🛏️', min: 2, max: 5, default: 3 },
      { roomId: 'bathroom', label: 'Bathroom', icon: '🚿', min: 1, max: 3, default: 2 },
    ],
  },
  '4bed': {
    bqAvailable: true,
    rooms: [
      { roomId: 'living', label: 'Living Room', icon: '🛋️', min: 1, max: 3, default: 1 },
      { roomId: 'bedroom', label: 'Bedroom', icon: '🛏️', min: 3, max: 6, default: 4 },
      { roomId: 'bathroom', label: 'Bathroom', icon: '🚿', min: 2, max: 5, default: 3 },
    ],
  },
  duplex: {
    bqAvailable: true,
    rooms: [
      { roomId: 'living', label: 'Living/Dining Room', icon: '🛋️', min: 1, max: 3, default: 2 },
      { roomId: 'bedroom', label: 'Bedroom', icon: '🛏️', min: 3, max: 8, default: 4 },
      { roomId: 'kitchen', label: 'Kitchen', icon: '🍳', min: 1, max: 2, default: 1 },
      { roomId: 'bathroom', label: 'Bathroom/Toilet', icon: '🚿', min: 2, max: 6, default: 3 },
    ],
  },
  office: {
    bqAvailable: false,
    rooms: [
      { roomId: 'office-room', label: 'Office', icon: '💼', min: 1, max: 20, default: 3 },
      { roomId: 'meeting-room', label: 'Meeting Room', icon: '🤝', min: 0, max: 5, default: 1 },
    ],
  },
  church: {
    bqAvailable: false,
    rooms: [
      { roomId: 'church-office', label: 'Church Office', icon: '🏢', min: 0, max: 5, default: 1 },
      { roomId: 'church-classroom', label: 'Classroom', icon: '📚', min: 0, max: 10, default: 2 },
    ],
  },
  shop: { bqAvailable: false, rooms: [] },
};

// ============== BQ (Boys' Quarters) ROOM ==============
export const BQ_ROOM: RoomDef = {
  id: 'bq', name: "BQ (Boys' Quarters)", icon: '🏠',
  equipment: [
    { id: 'bq-tv', name: 'BQ Television', icon: '📺', fields: [
      { key: 'size', label: 'Size', options: [{ value: '32', label: '32"' }, { value: '43', label: '43"' }] },
      { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'smart', label: 'Smart TV' }] },
    ], getWattage: tvWattage },
    { id: 'bq-ac', name: 'BQ Air Conditioner', icon: '❄️', fields: [
      { key: 'type', label: 'Type', options: [{ value: 'split', label: 'Split' }, { value: 'window', label: 'Window' }, { value: 'inverter', label: 'Inverter' }] },
      { key: 'capacity', label: 'Capacity', options: [{ value: '1', label: '1 HP' }, { value: '1.5', label: '1.5 HP' }] },
    ], getWattage: acWattage },
    { id: 'bq-fan', name: 'BQ Fan', icon: '🌀', fields: [
      { key: 'type', label: 'Type', options: [{ value: 'ceiling', label: 'Ceiling Fan' }, { value: 'standing', label: 'Standing Fan' }] },
    ], getWattage: fanWattage },
    { id: 'bq-bulb', name: 'BQ Room Light', icon: '💡', fields: [
      { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }, { value: 'energy-saving', label: 'Energy Saving' }] },
      { key: 'wattage', label: 'Wattage', options: [{ value: '9', label: '9W' }, { value: '12', label: '12W' }] },
    ], getWattage: bulbWattage },
    { id: 'bq-bathroom-bulb', name: 'BQ Bathroom Light', icon: '💡', fields: [
      { key: 'type', label: 'Type', options: [{ value: 'led', label: 'LED' }] },
      { key: 'wattage', label: 'Wattage', options: [{ value: '5', label: '5W' }, { value: '9', label: '9W' }] },
    ], getWattage: bulbWattage },
    { id: 'bq-charger', name: 'Phone Charger', icon: '📱', fields: [
      { key: 'type', label: 'Type', options: [{ value: 'standard', label: 'Standard (5W)' }, { value: 'fast', label: 'Fast (18W)' }] },
    ], getWattage: chargerWattage },
    { id: 'bq-water-heater', name: 'BQ Water Heater', icon: '🔥', fields: [
      { key: 'type', label: 'Type', options: [{ value: 'instant', label: 'Instant' }, { value: 'storage-25', label: 'Storage (25L)' }] },
    ], getWattage: heaterWattage },
  ],
};

// Add BQ usage time defaults
Object.assign(DEFAULT_USAGE_TIMES, {
  'bq-tv':             { start: 18, end: 23, is24h: false },
  'bq-ac':             { start: 21, end: 7,  is24h: false },
  'bq-fan':            { start: 20, end: 7,  is24h: false },
  'bq-bulb':           { start: 18, end: 23, is24h: false },
  'bq-bathroom-bulb':  { start: 18, end: 22, is24h: false },
  'bq-charger':        { start: 22, end: 6,  is24h: false },
  'bq-water-heater':   { start: 5,  end: 8,  is24h: false },
});

// ============== EXPANDED ROOM SYSTEM ==============
export interface ExpandedRoom {
  instanceId: string;
  name: string;
  icon: string;
  roomTypeId: string;
  equipment: EquipmentDef[];
  instanceNum: number;
  totalInstances: number;
}

export function expandRooms(
  baseRooms: RoomDef[],
  roomCounts: Record<string, number>,
  hasBQ: boolean,
): ExpandedRoom[] {
  const expanded: ExpandedRoom[] = [];

  for (const room of baseRooms) {
    const count = roomCounts[room.id] ?? 1;
    if (count === 0) continue;
    for (let i = 1; i <= count; i++) {
      expanded.push({
        instanceId: count > 1 ? `${room.id}-${i}` : room.id,
        name: count > 1 ? `${room.name} ${i}` : room.name,
        icon: room.icon,
        roomTypeId: room.id,
        equipment: room.equipment,
        instanceNum: i,
        totalInstances: count,
      });
    }
  }

  if (hasBQ) {
    expanded.push({
      instanceId: 'bq',
      name: BQ_ROOM.name,
      icon: BQ_ROOM.icon,
      roomTypeId: 'bq',
      equipment: BQ_ROOM.equipment,
      instanceNum: 1,
      totalInstances: 1,
    });
  }

  return expanded;
}

// ============== DAYS PER WEEK PRESETS ==============
export const DAYS_PER_WEEK_PRESETS = [
  { id: 'daily', label: '📅 Daily', days: 7 },
  { id: 'weekdays', label: '💼 Weekdays', days: 5 },
  { id: 'weekends', label: '🏖️ Weekends', days: 2 },
  { id: 'few', label: '📌 3×/wk', days: 3 },
  { id: 'once', label: '1️⃣ 1×/wk', days: 1 },
];

// ============== CUSTOM EQUIPMENT SUGGESTIONS ==============
export interface CustomEquipmentSuggestion {
  name: string;
  icon: string;
  defaultWattage: number;
  category: string;
}

export const CUSTOM_EQUIPMENT_SUGGESTIONS: CustomEquipmentSuggestion[] = [
  { name: 'Pumping Machine', icon: '💧', defaultWattage: 750, category: 'Outdoor' },
  { name: 'Vacuum Cleaner', icon: '🧹', defaultWattage: 1200, category: 'Household' },
  { name: 'Electric Heater', icon: '🔥', defaultWattage: 1500, category: 'Household' },
  { name: 'Air Purifier', icon: '🌬️', defaultWattage: 50, category: 'Household' },
  { name: 'Dehumidifier', icon: '💨', defaultWattage: 300, category: 'Household' },
  { name: 'Air Cooler (Evaporative)', icon: '🌊', defaultWattage: 200, category: 'Household' },
  { name: 'Sewing Machine', icon: '🧵', defaultWattage: 100, category: 'Household' },
  { name: 'Fish Tank/Aquarium', icon: '🐠', defaultWattage: 100, category: 'Household' },
  { name: 'Dishwasher', icon: '🍽️', defaultWattage: 1800, category: 'Kitchen' },
  { name: 'Toaster', icon: '🍞', defaultWattage: 800, category: 'Kitchen' },
  { name: 'Coffee Maker', icon: '☕', defaultWattage: 1000, category: 'Kitchen' },
  { name: 'Rice Cooker', icon: '🍚', defaultWattage: 700, category: 'Kitchen' },
  { name: 'Food Processor', icon: '🍳', defaultWattage: 500, category: 'Kitchen' },
  { name: 'Electric Oven', icon: '🔥', defaultWattage: 2000, category: 'Kitchen' },
  { name: 'Air Fryer', icon: '🍟', defaultWattage: 1500, category: 'Kitchen' },
  { name: 'Water Dispenser', icon: '💧', defaultWattage: 500, category: 'Kitchen' },
  { name: 'Electric Gate Motor', icon: '🚗', defaultWattage: 400, category: 'Outdoor' },
  { name: 'CCTV System', icon: '📹', defaultWattage: 50, category: 'Outdoor' },
  { name: 'Electric Fence', icon: '⚡', defaultWattage: 20, category: 'Outdoor' },
  { name: 'Pool Pump', icon: '🏊', defaultWattage: 1100, category: 'Outdoor' },
  { name: 'Garden Lights', icon: '🌿', defaultWattage: 50, category: 'Outdoor' },
  { name: 'Printer', icon: '🖨️', defaultWattage: 50, category: 'Office' },
  { name: 'Projector', icon: '📽️', defaultWattage: 300, category: 'Office' },
  { name: 'Treadmill', icon: '🏃', defaultWattage: 600, category: 'Fitness' },
  { name: 'Gaming Console', icon: '🎮', defaultWattage: 200, category: 'Entertainment' },
  { name: 'UPS/Backup Power', icon: '🔋', defaultWattage: 600, category: 'Other' },
  { name: 'Wine Cooler', icon: '🍷', defaultWattage: 85, category: 'Household' },
  { name: 'Chest Cooler', icon: '🧊', defaultWattage: 200, category: 'Household' },
];

// ============== MULTI-SLOT TIME HELPERS ==============
export interface TimeSlot {
  start: number;
  end: number;
  is24h: boolean;
}

export function isHourInAnySlot(hour: number, slots: TimeSlot[]): boolean {
  return slots.some(slot => isHourInRange(hour, slot.start, slot.end, slot.is24h));
}

export function getUsageHoursMultiSlot(slots: TimeSlot[]): number {
  if (slots.length === 0) return 0;
  if (slots.some(s => s.is24h)) return 24;
  const active = new Set<number>();
  for (const slot of slots) {
    for (let h = 0; h < 24; h++) {
      if (isHourInRange(h, slot.start, slot.end, slot.is24h)) active.add(h);
    }
  }
  return active.size;
}

export function getSolarOverlapMultiSlot(slots: TimeSlot[], sunStart: number, sunEnd: number): number {
  let count = 0;
  for (let h = 0; h < 24; h++) {
    if (isHourInAnySlot(h, slots) && h >= sunStart && h < sunEnd) count++;
  }
  return count;
}

export function getBatteryHoursMultiSlot(slots: TimeSlot[], sunStart: number, sunEnd: number): number {
  return getUsageHoursMultiSlot(slots) - getSolarOverlapMultiSlot(slots, sunStart, sunEnd);
}

export function computeEnergyProfileV2(
  items: { wattage: number; timeSlots: TimeSlot[]; daysPerWeek: number }[],
  sunStart: number,
  sunEnd: number,
): EnergyProfile {
  let totalWatts = 0;
  let totalDailyWh = 0;
  let totalSolarWh = 0;
  let totalBatteryWh = 0;

  items.forEach(item => {
    totalWatts += item.wattage;
    const usageHrs = getUsageHoursMultiSlot(item.timeSlots);
    const solarHrs = getSolarOverlapMultiSlot(item.timeSlots, sunStart, sunEnd);
    const battHrs = usageHrs - solarHrs;
    const dayFactor = item.daysPerWeek / 7;
    totalDailyWh += item.wattage * usageHrs * dayFactor;
    totalSolarWh += item.wattage * solarHrs * dayFactor;
    totalBatteryWh += item.wattage * battHrs * dayFactor;
  });

  const dailyKwh = totalDailyWh / 1000;
  const solarKwh = totalSolarWh / 1000;
  const batteryKwh = totalBatteryWh / 1000;
  const solarRatio = dailyKwh > 0 ? solarKwh / dailyKwh : 0;
  return { totalWatts, dailyKwh, solarKwh, batteryKwh, solarRatio };
}
