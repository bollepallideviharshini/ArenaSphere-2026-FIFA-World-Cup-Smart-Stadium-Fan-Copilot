export type Persona = 'fan' | 'staff' | 'volunteer';

export interface StadiumMetrics {
  crowdDensity: number; // percentage (0-100)
  gateCongestion: Record<string, 'clear' | 'moderate' | 'congested' | 'closed'>;
  ecoScore: number; // (0-100)
  carbonFootprint: number; // kg CO2
  activeIncidentsCount: number;
  avgWaitTimeMin: number;
  transitStatus: {
    metro: 'on-time' | 'delayed' | 'suspended';
    shuttles: 'on-time' | 'delayed' | 'busy';
    rideshare: 'normal' | 'surge' | 'slow';
  };
  energySolarKw: number;
  energyGridKw: number;
  volunteerCount: number;
  activeVolunteerCount: number;
  waterSavedLitres: number;
  recyclingRatePercent: number;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  locationName: string;
  mapCoords: { x: number; y: number }; // percentage coordinates for SVG map overlay
  status: 'active' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  category: 'medical' | 'crowd' | 'weather' | 'transit' | 'facility' | 'sustainability' | 'multilingual' | 'accessibility' | 'general';
  assignedVolunteerId?: string;
  volunteerEtaSec?: number;
  nearestMedicSector?: string;
  nearestVolunteerName?: string;
  notifiedEntities: string[]; // e.g. ["Security", "Medical", "Organizer"]
}

export interface SimulationEvent {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  incidentTemplate?: Omit<Incident, 'id' | 'timestamp' | 'status'>;
  metricModifiers: Partial<StadiumMetrics> & { gateCongestion?: Partial<StadiumMetrics['gateCongestion']> };
}

export interface AIRecommendation {
  id: string;
  text: string;
  category: 'crowd' | 'volunteer' | 'facility' | 'transit' | 'sustainability';
  impact: string;
  actionable: boolean;
  actionText?: string;
}

export interface SmartRouteStep {
  instruction: string;
  type: 'start' | 'walk' | 'turn' | 'arrive';
  distanceMeters: number;
  durationSeconds: number;
  congestionLevel: 'low' | 'medium' | 'high';
}

export interface SmartNavigationRoute {
  destination: string;
  steps: SmartRouteStep[];
  totalDistanceMeters: number;
  totalDurationSeconds: number;
  accessible: boolean;
}

export interface AICopilotState {
  chatHistory: {
    id: string;
    sender: 'user' | 'system' | 'ai';
    text: string;
    timestamp: string;
    language?: string;
    isEmergencyResponse?: boolean;
    routeInfo?: SmartNavigationRoute;
  }[];
  isListening: boolean;
  voiceQuery?: string;
  accessibilityMode: boolean;
}
