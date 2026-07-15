import { StadiumMetrics } from '../types/stadium';

export interface StadiumZone {
  id: string;
  name: string;
  type: 'sector' | 'gate' | 'concession' | 'restroom' | 'firstaid' | 'sustainability' | 'transit';
  capacity?: number;
  currentCrowdPercent: number;
  label: string;
  mapCoords: { x: number; y: number; r?: number; path?: string }; // circle or polygon
  waitTimeMin?: number;
}

export const INITIAL_METRICS: StadiumMetrics = {
  crowdDensity: 65,
  gateCongestion: {
    'Gate A (North)': 'clear',
    'Gate B (East)': 'moderate',
    'Gate C (South)': 'clear',
    'Gate D (West)': 'clear',
  },
  ecoScore: 78,
  carbonFootprint: 1420, // kg CO2
  activeIncidentsCount: 0,
  avgWaitTimeMin: 12,
  transitStatus: {
    metro: 'on-time',
    shuttles: 'on-time',
    rideshare: 'normal',
  },
  energySolarKw: 350,
  energyGridKw: 150,
  volunteerCount: 120,
  activeVolunteerCount: 85,
  waterSavedLitres: 4500,
  recyclingRatePercent: 72,
};

export const STADIUM_ZONES: StadiumZone[] = [
  // Gates
  { id: 'gate_a', name: 'Gate A (North)', type: 'gate', currentCrowdPercent: 40, label: 'A', mapCoords: { x: 50, y: 12, r: 4 } },
  { id: 'gate_b', name: 'Gate B (East)', type: 'gate', currentCrowdPercent: 75, label: 'B', mapCoords: { x: 88, y: 50, r: 4 } },
  { id: 'gate_c', name: 'Gate C (South)', type: 'gate', currentCrowdPercent: 30, label: 'C', mapCoords: { x: 50, y: 88, r: 4 } },
  { id: 'gate_d', name: 'Gate D (West)', type: 'gate', currentCrowdPercent: 35, label: 'D', mapCoords: { x: 12, y: 50, r: 4 } },

  // Concessions
  { id: 'food_court_a', name: 'Food Court A (North Plaza)', type: 'concession', currentCrowdPercent: 85, label: '🍔 A', mapCoords: { x: 38, y: 22, r: 3.5 }, waitTimeMin: 22 },
  { id: 'food_court_b', name: 'Food Court B (East Concourse)', type: 'concession', currentCrowdPercent: 90, label: '🍔 B', mapCoords: { x: 78, y: 38, r: 3.5 }, waitTimeMin: 28 },
  { id: 'food_court_c', name: 'Food Court C (South Plaza)', type: 'concession', currentCrowdPercent: 20, label: '🍔 C', mapCoords: { x: 38, y: 78, r: 3.5 }, waitTimeMin: 5 },
  { id: 'food_court_d', name: 'Food Court D (West Concourse)', type: 'concession', currentCrowdPercent: 55, label: '🍔 D', mapCoords: { x: 22, y: 38, r: 3.5 }, waitTimeMin: 14 },

  // Restrooms
  { id: 'restroom_101', name: 'Restroom Sector 101', type: 'restroom', currentCrowdPercent: 80, label: '🚻 101', mapCoords: { x: 62, y: 22, r: 3 }, waitTimeMin: 8 },
  { id: 'restroom_115', name: 'Restroom Sector 115', type: 'restroom', currentCrowdPercent: 30, label: '🚻 115', mapCoords: { x: 78, y: 62, r: 3 }, waitTimeMin: 2 },
  { id: 'restroom_124', name: 'Restroom Sector 124', type: 'restroom', currentCrowdPercent: 45, label: '🚻 124', mapCoords: { x: 62, y: 78, r: 3 }, waitTimeMin: 4 },
  { id: 'restroom_138', name: 'Restroom Sector 138', type: 'restroom', currentCrowdPercent: 90, label: '🚻 138', mapCoords: { x: 22, y: 62, r: 3 }, waitTimeMin: 11 },

  // First Aid
  { id: 'first_aid_east', name: 'First Aid - East Wing', type: 'firstaid', currentCrowdPercent: 15, label: '➕ East', mapCoords: { x: 82, y: 50, r: 3.5 } },
  { id: 'first_aid_west', name: 'First Aid - West Wing', type: 'firstaid', currentCrowdPercent: 5, label: '➕ West', mapCoords: { x: 18, y: 50, r: 3.5 } },

  // Eco Sustainability Waste Stations
  { id: 'eco_hub_north', name: 'Eco Station North', type: 'sustainability', currentCrowdPercent: 40, label: '♻️ North', mapCoords: { x: 50, y: 25, r: 3 } },
  { id: 'eco_hub_south', name: 'Eco Station South', type: 'sustainability', currentCrowdPercent: 20, label: '♻️ South', mapCoords: { x: 50, y: 75, r: 3 } },

  // Transit Hubs
  { id: 'transit_metro', name: 'Metro Terminal (Exit 1)', type: 'transit', currentCrowdPercent: 70, label: '🚇 Metro', mapCoords: { x: 92, y: 28, r: 4.5 } },
  { id: 'transit_shuttle', name: 'Shuttle Bus Loop (Exit 2)', type: 'transit', currentCrowdPercent: 50, label: '🚌 Shuttles', mapCoords: { x: 8, y: 28, r: 4.5 } },
  { id: 'transit_rideshare', name: 'Rideshare Pickup (Zone 4)', type: 'transit', currentCrowdPercent: 60, label: '🚗 Rideshare', mapCoords: { x: 50, y: 95, r: 4.5 } },

  // Key Sectors (visual references)
  { id: 'sector_101', name: 'Sector 101-105', type: 'sector', currentCrowdPercent: 75, label: '101', mapCoords: { x: 50, y: 32, r: 5 } },
  { id: 'sector_108', name: 'Sector 108-112', type: 'sector', currentCrowdPercent: 88, label: '108', mapCoords: { x: 72, y: 40, r: 5 } },
  { id: 'sector_115', name: 'Sector 115-119', type: 'sector', currentCrowdPercent: 55, label: '115', mapCoords: { x: 72, y: 60, r: 5 } },
  { id: 'sector_122', name: 'Sector 122-126', type: 'sector', currentCrowdPercent: 40, label: '122', mapCoords: { x: 50, y: 68, r: 5 } },
  { id: 'sector_129', name: 'Sector 129-133', type: 'sector', currentCrowdPercent: 60, label: '129', mapCoords: { x: 28, y: 60, r: 5 } },
  { id: 'sector_136', name: 'Sector 136-140', type: 'sector', currentCrowdPercent: 92, label: '136', mapCoords: { x: 28, y: 40, r: 5 } },
];
