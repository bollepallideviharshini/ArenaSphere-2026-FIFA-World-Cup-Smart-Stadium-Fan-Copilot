import { Persona, StadiumMetrics, Incident } from '../types/stadium';

export interface PromptInput {
  role: Persona;
  metrics: StadiumMetrics;
  activeIncidents: Incident[];
  language: string;
  query: string;
  accessibilityMode: boolean;
}

export function generateAIPromptContext(input: PromptInput): string {
  const { role, metrics, activeIncidents, language, query, accessibilityMode } = input;

  const roleDefinitions = {
    fan: 'You are ArenaSphere AI, a friendly and helpful stadium concierge for fans attending the FIFA World Cup 2026. Your goals are to provide directions, recommend concessions with short wait times, answer sustainability recycling queries, translate signs, and coordinate transit or accessibility guidance. Keep answers concise, clear, and welcoming.',
    staff: 'You are ArenaSphere AI, an operational intelligence and real-time decision-support system for stadium organizers and supervisors. Your goals are to analyze incidents, recommend staff/volunteer dispatch actions, warn about crowd safety levels, suggest gate controls, and provide energy-savings recommendations. Keep answers highly professional, actionable, and data-driven.',
    volunteer: 'You are ArenaSphere AI, a helper bot for stadium volunteers on the ground. Your goals are to detail assigned duties, clarify safety/emergency protocols, provide quick translations to help fans of different nationalities, and assist with accessibility services. Keep answers clear, direct, and safety-focused.',
  };

  const activeIncidentsStr = activeIncidents.length > 0
    ? activeIncidents.map(inc => `- [${inc.priority.toUpperCase()}] ${inc.title} at ${inc.locationName} (${inc.status}). Nearest Volunteer: ${inc.nearestVolunteerName || 'None'}, ETA: ${inc.volunteerEtaSec ? inc.volunteerEtaSec + 's' : 'N/A'}`).join('\n')
    : 'No active emergencies or issues reported.';

  const gateCongestionStr = Object.entries(metrics.gateCongestion)
    .map(([gate, status]) => `  - ${gate}: ${status.toUpperCase()}`)
    .join('\n');

  return `=================== SYSTEM CONTEXT ===================
ROLE DEFINITION:
${roleDefinitions[role]}

ACCESSIBILITY MODE: ${accessibilityMode ? 'ON (Format answers with step-by-step numbers, clear landmarks, and recommend elevators/accessible ramps only)' : 'OFF'}
TARGET LANGUAGE: ${language.toUpperCase()}

=================== STADIUM STATE ===================
CROWD DENSITY: ${metrics.crowdDensity}%
AVERAGE WAIT TIME: ${metrics.avgWaitTimeMin} mins
ENERGY SAVINGS: Solar ${metrics.energySolarKw}kW / Grid ${metrics.energyGridKw}kW (Eco Score: ${metrics.ecoScore}/100)
ACTIVE VOLUNTEERS: ${metrics.activeVolunteerCount} / ${metrics.volunteerCount} on-duty

GATE STATUS:
${gateCongestionStr}

TRANSIT STATUS:
- Metro Rail Terminal: ${metrics.transitStatus.metro.toUpperCase()}
- Shuttle Bus Service: ${metrics.transitStatus.shuttles.toUpperCase()}
- Rideshare Pickup: ${metrics.transitStatus.rideshare.toUpperCase()}

ACTIVE INCIDENTS:
${activeIncidentsStr}

=================== USER INPUT ===================
USER QUERY: "${query}"

Generate a context-aware response based on the parameters above. Do not use placeholders; output a fully resolved answer.`;
}
