// Singapore Pool & Condo Registry — 50 locations across North, South, East, West, Central
// Used for the Dynamic Public Pool & Condo Registry lead generation feature

export type PoolRegion = 'North' | 'South' | 'East' | 'West' | 'Central';
export type PoolType = 'Public Complex' | 'Condo Cluster' | 'Clubhouse' | 'Sports Hub' | 'RC Pool';

export interface RegistryPool {
  id: string;
  name: string;
  region: PoolRegion;
  type: PoolType;
  address: string;
  landmark: string;
  hasActiveCoach: boolean;
  coachCount?: number;
  waitlistCount: number;
  tags: string[];
}

export const poolRegistry: RegistryPool[] = [
  // ── NORTH ──
  {
    id: 'n01', name: 'Yishun Swimming Complex', region: 'North', type: 'Public Complex',
    address: '51 Yishun Ave 11', landmark: 'Near Yishun MRT', hasActiveCoach: true, coachCount: 3,
    waitlistCount: 0, tags: ['50m pool', 'Learners pool', 'Jacuzzi'],
  },
  {
    id: 'n02', name: 'Sembawang Swimming Complex', region: 'North', type: 'Public Complex',
    address: '60 Sembawang Dr', landmark: 'Sembawang Town', hasActiveCoach: false,
    waitlistCount: 12, tags: ['50m pool', 'Wading pool'],
  },
  {
    id: 'n03', name: 'Woodlands Swimming Complex', region: 'North', type: 'Public Complex',
    address: '3 Woodlands St 13', landmark: 'Near Causeway Point', hasActiveCoach: true, coachCount: 2,
    waitlistCount: 0, tags: ['50m pool', 'Learners pool'],
  },
  {
    id: 'n04', name: 'The Estuary Condo Pool', region: 'North', type: 'Condo Cluster',
    address: '1 Yishun Close', landmark: 'Yishun', hasActiveCoach: false,
    waitlistCount: 7, tags: ['Private', '25m pool', 'Lap pool'],
  },
  {
    id: 'n05', name: 'Northpark Residences Pool', region: 'North', type: 'Condo Cluster',
    address: '1 Yishun Central 1', landmark: 'Northpoint City', hasActiveCoach: true, coachCount: 1,
    waitlistCount: 0, tags: ['Private', 'Heated', 'Kids pool'],
  },
  {
    id: 'n06', name: 'Canberra Residences Pool', region: 'North', type: 'Condo Cluster',
    address: '2 Canberra Dr', landmark: 'Canberra MRT', hasActiveCoach: false,
    waitlistCount: 5, tags: ['Private', '25m pool'],
  },
  {
    id: 'n07', name: 'Admiralty RC Swimming Pool', region: 'North', type: 'RC Pool',
    address: '678 Woodlands Ave 6', landmark: 'Admiralty', hasActiveCoach: false,
    waitlistCount: 9, tags: ['Community', 'Learners pool'],
  },
  {
    id: 'n08', name: 'Orchid Country Club Pool', region: 'North', type: 'Clubhouse',
    address: '1 Orchid Club Rd', landmark: 'Yishun', hasActiveCoach: true, coachCount: 2,
    waitlistCount: 0, tags: ['Olympic', 'Leisure pool', 'Heated'],
  },
  {
    id: 'n09', name: 'Parc Botannia Pool', region: 'North', type: 'Condo Cluster',
    address: '1 Fernvale St', landmark: 'Sengkang', hasActiveCoach: false,
    waitlistCount: 14, tags: ['Private', 'Infinity pool', 'Kids pool'],
  },
  {
    id: 'n10', name: 'Seletar Hills Estate Pool', region: 'North', type: 'Clubhouse',
    address: '12 Seletar Hills Dr', landmark: 'Seletar', hasActiveCoach: false,
    waitlistCount: 3, tags: ['Private', 'Lap pool'],
  },

  // ── SOUTH ──
  {
    id: 's01', name: 'Toa Payoh Swimming Complex', region: 'South', type: 'Public Complex',
    address: '301 Toa Payoh Lor 6', landmark: 'Near Toa Payoh MRT', hasActiveCoach: true, coachCount: 4,
    waitlistCount: 0, tags: ['50m pool', 'Learners pool', 'Wading pool'],
  },
  {
    id: 's02', name: 'Bishan Swimming Complex', region: 'South', type: 'Public Complex',
    address: '101 Bishan St 12', landmark: 'Bishan Park', hasActiveCoach: true, coachCount: 3,
    waitlistCount: 0, tags: ['50m pool', 'Dive pool'],
  },
  {
    id: 's03', name: 'Queenstown Swimming Complex', region: 'South', type: 'Public Complex',
    address: '473 Stirling Rd', landmark: 'Queenstown MRT', hasActiveCoach: false,
    waitlistCount: 18, tags: ['50m pool', 'Learners pool'],
  },
  {
    id: 's04', name: 'Tanglin Club Pool', region: 'South', type: 'Clubhouse',
    address: '5 Stevens Rd', landmark: 'Tanglin', hasActiveCoach: true, coachCount: 2,
    waitlistCount: 0, tags: ['Private', 'Heated', 'Olympic'],
  },
  {
    id: 's05', name: 'The Interlace Pool', region: 'South', type: 'Condo Cluster',
    address: '180 Depot Rd', landmark: 'Alexandra', hasActiveCoach: false,
    waitlistCount: 11, tags: ['Private', 'Infinity pool', 'Kids pool'],
  },
  {
    id: 's06', name: 'Reflections at Keppel Bay Pool', region: 'South', type: 'Condo Cluster',
    address: '1 Keppel Bay Dr', landmark: 'Keppel Bay', hasActiveCoach: false,
    waitlistCount: 8, tags: ['Private', 'Marina view', 'Heated'],
  },
  {
    id: 's07', name: 'Dawson Residences Pool', region: 'South', type: 'Condo Cluster',
    address: '82 Dawson Rd', landmark: 'Queenstown', hasActiveCoach: true, coachCount: 1,
    waitlistCount: 0, tags: ['Private', '25m pool'],
  },
  {
    id: 's08', name: 'Telok Blangah Crescent Pool', region: 'South', type: 'RC Pool',
    address: '11 Telok Blangah Cres', landmark: 'Telok Blangah', hasActiveCoach: false,
    waitlistCount: 6, tags: ['Community', 'Learners pool'],
  },
  {
    id: 's09', name: 'Singapore Island Country Club Pool', region: 'South', type: 'Clubhouse',
    address: '180 Island Club Rd', landmark: 'Bukit Timah', hasActiveCoach: true, coachCount: 3,
    waitlistCount: 0, tags: ['Olympic', 'Heated', 'Private'],
  },
  {
    id: 's10', name: 'Buona Vista Swimming Complex', region: 'South', type: 'Public Complex',
    address: '1 Holland Dr', landmark: 'Holland Village', hasActiveCoach: false,
    waitlistCount: 15, tags: ['50m pool', 'Wading pool'],
  },

  // ── EAST ──
  {
    id: 'e01', name: 'Tampines Swimming Complex', region: 'East', type: 'Public Complex',
    address: '519 Tampines Ave 5', landmark: 'Near Tampines Hub', hasActiveCoach: true, coachCount: 5,
    waitlistCount: 0, tags: ['50m pool', 'Learners pool', 'Wading pool'],
  },
  {
    id: 'e02', name: 'Bedok Swimming Complex', region: 'East', type: 'Public Complex',
    address: '901 New Upper Changi Rd', landmark: 'Bedok Town', hasActiveCoach: true, coachCount: 3,
    waitlistCount: 0, tags: ['50m pool', 'Dive pool'],
  },
  {
    id: 'e03', name: 'Pasir Ris Swimming Complex', region: 'East', type: 'Public Complex',
    address: '120 Pasir Ris Central', landmark: 'Downtown East', hasActiveCoach: false,
    waitlistCount: 22, tags: ['50m pool', 'Learners pool', 'Water playground'],
  },
  {
    id: 'e04', name: 'The Parc Condo Pool', region: 'East', type: 'Condo Cluster',
    address: '1 Tampines St 86', landmark: 'Tampines', hasActiveCoach: true, coachCount: 2,
    waitlistCount: 0, tags: ['Private', '25m pool', 'Kids pool'],
  },
  {
    id: 'e05', name: 'Changi Rise Condo Pool', region: 'East', type: 'Condo Cluster',
    address: '11 Changi Rise', landmark: 'Changi', hasActiveCoach: false,
    waitlistCount: 9, tags: ['Private', 'Lap pool'],
  },
  {
    id: 'e06', name: 'Loyang Valley Condo Pool', region: 'East', type: 'Condo Cluster',
    address: '1 Loyang Valley', landmark: 'Pasir Ris', hasActiveCoach: false,
    waitlistCount: 7, tags: ['Private', '25m pool'],
  },
  {
    id: 'e07', name: 'Eastwood Centre Pool', region: 'East', type: 'Clubhouse',
    address: '780 Bedok Reservoir Rd', landmark: 'Bedok Reservoir', hasActiveCoach: false,
    waitlistCount: 4, tags: ['Private', 'Lap pool'],
  },
  {
    id: 'e08', name: 'Simei Green Condo Pool', region: 'East', type: 'Condo Cluster',
    address: '3 Simei Green', landmark: 'Simei', hasActiveCoach: true, coachCount: 1,
    waitlistCount: 0, tags: ['Private', 'Kids pool'],
  },
  {
    id: 'e09', name: 'Tanah Merah Country Club Pool', region: 'East', type: 'Clubhouse',
    address: '12 Tanah Merah Ferry Rd', landmark: 'Tanah Merah', hasActiveCoach: false,
    waitlistCount: 13, tags: ['Olympic', 'Heated', 'Private'],
  },
  {
    id: 'e10', name: 'Elias Park Condo Pool', region: 'East', type: 'Condo Cluster',
    address: '11 Elias Rd', landmark: 'Pasir Ris', hasActiveCoach: false,
    waitlistCount: 6, tags: ['Private', '25m pool'],
  },

  // ── WEST ──
  {
    id: 'w01', name: 'Jurong East Swimming Complex', region: 'West', type: 'Public Complex',
    address: '21 Jurong East St 31', landmark: 'Jurong East MRT', hasActiveCoach: true, coachCount: 4,
    waitlistCount: 0, tags: ['50m pool', 'Learners pool', 'Wading pool'],
  },
  {
    id: 'w02', name: 'Clementi Swimming Complex', region: 'West', type: 'Public Complex',
    address: '518 Clementi Ave 3', landmark: 'Clementi Mall', hasActiveCoach: true, coachCount: 2,
    waitlistCount: 0, tags: ['50m pool', 'Learners pool'],
  },
  {
    id: 'w03', name: 'Bukit Batok Swimming Complex', region: 'West', type: 'Public Complex',
    address: '45 Bukit Batok West Ave 2', landmark: 'Bukit Batok Town', hasActiveCoach: false,
    waitlistCount: 16, tags: ['50m pool', 'Wading pool'],
  },
  {
    id: 'w04', name: 'Lakeside Residences Pool', region: 'West', type: 'Condo Cluster',
    address: '1 Jurong Lake Link', landmark: 'Jurong Lake District', hasActiveCoach: false,
    waitlistCount: 11, tags: ['Private', 'Infinity pool', 'Kids pool'],
  },
  {
    id: 'w05', name: 'Westwood Residences Pool', region: 'West', type: 'Condo Cluster',
    address: '12 Westwood Ave', landmark: 'Boon Lay', hasActiveCoach: false,
    waitlistCount: 8, tags: ['Private', '25m pool'],
  },
  {
    id: 'w06', name: 'Tengah Plantation Close Pool', region: 'West', type: 'Condo Cluster',
    address: '1 Tengah Plantation Cl', landmark: 'Tengah', hasActiveCoach: false,
    waitlistCount: 19, tags: ['Private', 'New development', 'Lap pool'],
  },
  {
    id: 'w07', name: 'Jurong Country Club Pool', region: 'West', type: 'Clubhouse',
    address: '9 Science Centre Rd', landmark: 'Jurong East', hasActiveCoach: true, coachCount: 2,
    waitlistCount: 0, tags: ['Olympic', 'Heated', 'Private'],
  },
  {
    id: 'w08', name: 'Crest Secondary School Pool', region: 'West', type: 'Public Complex',
    address: '10 Toh Guan Rd', landmark: 'Jurong West', hasActiveCoach: false,
    waitlistCount: 5, tags: ['25m pool', 'Community use'],
  },
  {
    id: 'w09', name: 'Bukit Timah Saddle Club Pool', region: 'West', type: 'Clubhouse',
    address: '51 Fairways Dr', landmark: 'Bukit Timah', hasActiveCoach: false,
    waitlistCount: 7, tags: ['Private', 'Heated', 'Lap pool'],
  },
  {
    id: 'w10', name: 'Boon Lay Condo Cluster Pool', region: 'West', type: 'Condo Cluster',
    address: '221 Boon Lay Ave', landmark: 'Boon Lay', hasActiveCoach: false,
    waitlistCount: 4, tags: ['Private', '25m pool'],
  },

  // ── CENTRAL ──
  {
    id: 'c01', name: 'Kallang Basin Swimming Complex', region: 'Central', type: 'Public Complex',
    address: '5 Stadium Walk', landmark: 'Singapore Sports Hub', hasActiveCoach: true, coachCount: 6,
    waitlistCount: 0, tags: ['50m pool', 'Dive pool', 'Olympic'],
  },
  {
    id: 'c02', name: 'Ang Mo Kio Swimming Complex', region: 'Central', type: 'Public Complex',
    address: '3 Ang Mo Kio St 31', landmark: 'AMK Hub', hasActiveCoach: true, coachCount: 3,
    waitlistCount: 0, tags: ['50m pool', 'Learners pool'],
  },
  {
    id: 'c03', name: 'Serangoon Swimming Complex', region: 'Central', type: 'Public Complex',
    address: '35 Serangoon Ave 2', landmark: 'Serangoon', hasActiveCoach: false,
    waitlistCount: 14, tags: ['50m pool', 'Wading pool'],
  },
  {
    id: 'c04', name: 'The Sail @ Marina Bay Pool', region: 'Central', type: 'Condo Cluster',
    address: '2 Marina Blvd', landmark: 'Marina Bay', hasActiveCoach: true, coachCount: 1,
    waitlistCount: 0, tags: ['Private', 'Rooftop', 'Infinity pool'],
  },
  {
    id: 'c05', name: 'Marina One Residences Pool', region: 'Central', type: 'Condo Cluster',
    address: '21 Marina Way', landmark: 'Marina Bay', hasActiveCoach: false,
    waitlistCount: 17, tags: ['Private', 'Rooftop', 'Heated'],
  },
  {
    id: 'c06', name: 'Novena Residences Pool', region: 'Central', type: 'Condo Cluster',
    address: '12 Novena Rise', landmark: 'Novena MRT', hasActiveCoach: false,
    waitlistCount: 9, tags: ['Private', '25m pool', 'Kids pool'],
  },
  {
    id: 'c07', name: 'Raffles Town Club Pool', region: 'Central', type: 'Clubhouse',
    address: '1 Plymouth Ave', landmark: 'Bukit Timah', hasActiveCoach: true, coachCount: 2,
    waitlistCount: 0, tags: ['Olympic', 'Heated', 'Private'],
  },
  {
    id: 'c08', name: 'Hougang Swimming Complex', region: 'Central', type: 'Public Complex',
    address: '93 Hougang Ave 4', landmark: 'Hougang', hasActiveCoach: false,
    waitlistCount: 11, tags: ['50m pool', 'Learners pool'],
  },
  {
    id: 'c09', name: 'Thomson Impressions Pool', region: 'Central', type: 'Condo Cluster',
    address: '8 Bright Hill Dr', landmark: 'Upper Thomson', hasActiveCoach: false,
    waitlistCount: 8, tags: ['Private', 'Lap pool', 'Kids pool'],
  },
  {
    id: 'c10', name: 'Braddell View Condo Pool', region: 'Central', type: 'Condo Cluster',
    address: '10 Braddell Hill', landmark: 'Marymount', hasActiveCoach: false,
    waitlistCount: 6, tags: ['Private', '25m pool'],
  },
];

export const regionColors: Record<PoolRegion, string> = {
  North: 'bg-emerald-100 text-emerald-700',
  South: 'bg-blue-100 text-blue-700',
  East: 'bg-orange-100 text-orange-700',
  West: 'bg-purple-100 text-purple-700',
  Central: 'bg-[oklch(0.93_0.05_200)] text-[oklch(0.42_0.14_200)]',
};

export const typeIcons: Record<PoolType, string> = {
  'Public Complex': '🏊',
  'Condo Cluster': '🏢',
  'Clubhouse': '⛳',
  'Sports Hub': '🏟️',
  'RC Pool': '🏘️',
};
