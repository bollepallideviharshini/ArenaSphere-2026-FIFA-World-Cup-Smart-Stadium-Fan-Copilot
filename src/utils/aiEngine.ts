import { Persona, StadiumMetrics, Incident, SmartNavigationRoute, SmartRouteStep } from '../types/stadium';
import { TRANSLATIONS_DB } from '../data/translations';
import { generateAIPromptContext } from './promptGenerator';

export interface AIResponseResult {
  responseText: string;
  detectedIntent: string;
  suggestedRoute?: SmartNavigationRoute;
  emergencyDetails?: {
    priority: 'high' | 'medium' | 'low';
    nearestVolunteer: string;
    nearestMedic: string;
    etaMinutes: number;
    notifiedEntities: string[];
  };
  promptContextUsed: string; // The formatted prompt sent to the engine
}

// Simple text-matching helper
function matchKeywords(text: string, keywords: string[]): boolean {
  const normalized = text.toLowerCase();
  return keywords.some(kw => normalized.includes(kw));
}

export function generateAIResponse(
  role: Persona,
  query: string,
  metrics: StadiumMetrics,
  activeIncidents: Incident[],
  language: string = 'en',
  accessibilityMode: boolean = false
): AIResponseResult {
  const promptContextUsed = generateAIPromptContext({
    role,
    metrics,
    activeIncidents,
    language,
    query,
    accessibilityMode,
  });

  const queryLower = query.toLowerCase();

  // --- EMERGENCY RESPONSE ---
  const isEmergency = matchKeywords(queryLower, [
    'emergency', 'medical', 'hurt', 'pain', 'breathing', 'heart', 'collapsed', 'bleeding', 'accident', 'injury', 'medic', 'doctor'
  ]);

  if (isEmergency) {
    const isStaffOrVol = role === 'staff' || role === 'volunteer';
    const responseText = isStaffOrVol
      ? `🚨 EMERGENCY OPERATIONS PROTOCOL INITIATED. Medical dispatch confirmed for ${query}. Redirection coordinates sent to standby volunteer. Incident added to main dashboard dispatcher queue.`
      : `I have flagged this as a High-Priority Medical Emergency. A volunteer escorts team and medical responder have been dispatched. Please stay where you are. Accessibility helpers are moving to clear path.`;

    return {
      responseText,
      detectedIntent: 'emergency',
      emergencyDetails: {
        priority: 'high',
        nearestVolunteer: 'Alex Mercer (Sector 108 - 45m away)',
        nearestMedic: 'First Aid East - Sector 110',
        etaMinutes: 1.5,
        notifiedEntities: ['Security Command', 'Medical Services', 'Stadium Operations Supervisor'],
      },
      promptContextUsed,
    };
  }

  // --- SUSTAINABILITY / ECO QUERY ---
  const isSustain = matchKeywords(queryLower, [
    'recycle', 'trash', 'plastic', 'sustainability', 'compost', 'garbage', 'eco', 'bottle', 'bin'
  ]);

  if (isSustain) {
    return {
      responseText: `To help reach our **FIFA World Cup 2026 Zero-Waste goal**:
1. 🥤 **Plastic Cups & Food Scraps**: Put them in the Green Eco-Bins. They are composted/recycled locally.
2. 🍔 **Coated wrappers/Landfill**: Put in Gray general trash.
3. ♻️ **Refill stations**: You can refill water bottles for free at any concession.
Nearest station is at **Eco Station North (30 meters from Gate A)**. Your compliance boosts our live Stadium Eco Score (currently ${metrics.ecoScore}/100)!`,
      detectedIntent: 'sustainability',
      promptContextUsed,
    };
  }

  // --- NAVIGATION / ROUTING INTENT ---
  const isRouting = matchKeywords(queryLower, [
    'where', 'go', 'find', 'navigate', 'route', 'map', 'restroom', 'gate', 'food', 'concession', 'metro', 'shuttle', 'exit', 'way to'
  ]);

  if (isRouting) {
    let destination = 'Facilities concourse';
    let steps: SmartRouteStep[] = [];
    let accessible = accessibilityMode;

    if (queryLower.includes('restroom') || queryLower.includes('toilet') || queryLower.includes('bath')) {
      destination = 'Sector 115 Restroom';
      steps = [
        { instruction: 'Start from your current seat section.', type: 'start', distanceMeters: 0, durationSeconds: 0, congestionLevel: 'low' },
        { instruction: accessibilityMode ? 'Head to the main concourse ramp. Avoid stairs.' : 'Take the sector steps down to Concourse Level 1.', type: 'walk', distanceMeters: 20, durationSeconds: 15, congestionLevel: 'low' },
        { instruction: 'Turn right at the Sector 112 landmark.', type: 'turn', distanceMeters: 15, durationSeconds: 10, congestionLevel: 'medium' },
        { instruction: accessibilityMode ? 'Use the wheelchair elevator behind Sector 114.' : 'Walk straight down Concourse East past the food kiosks.', type: 'walk', distanceMeters: 30, durationSeconds: 25, congestionLevel: 'high' },
        { instruction: 'Arrive at Sector 115 Restroom (Ramp Access available).', type: 'arrive', distanceMeters: 5, durationSeconds: 5, congestionLevel: 'low' },
      ];
    } else if (queryLower.includes('metro') || queryLower.includes('train')) {
      destination = 'Metro Station (Exit 1)';
      const isGateBCongested = metrics.gateCongestion['Gate B (East)'] === 'congested';
      steps = [
        { instruction: 'Depart from Concourse Central.', type: 'start', distanceMeters: 0, durationSeconds: 0, congestionLevel: 'low' },
        { instruction: isGateBCongested ? 'WARNING: Gate B is highly congested. Redirecting via Gate C.' : 'Walk towards the Eastern gates corridor.', type: 'walk', distanceMeters: 40, durationSeconds: 30, congestionLevel: isGateBCongested ? 'low' : 'high' },
        { instruction: isGateBCongested ? 'Pass through Gate C (South exit area).' : 'Exit stadium via Gate B (East).', type: 'turn', distanceMeters: 60, durationSeconds: 45, congestionLevel: 'medium' },
        { instruction: 'Walk along the pedestrian plaza path to Exit 1 Metro Terminal.', type: 'walk', distanceMeters: 120, durationSeconds: 90, congestionLevel: 'high' },
        { instruction: 'Arrive at Metro Ticketing Hall.', type: 'arrive', distanceMeters: 10, durationSeconds: 10, congestionLevel: 'medium' },
      ];
    } else if (queryLower.includes('elevator') || queryLower.includes('wheelchair') || queryLower.includes('lift') || queryLower.includes('ramp') || queryLower.includes('accessible')) {
      destination = 'Sector 112 Wheelchair Elevator';
      accessible = true;
      steps = [
        { instruction: 'Depart from Sector 122 seating area.', type: 'start', distanceMeters: 0, durationSeconds: 0, congestionLevel: 'low' },
        { instruction: 'Take the accessible concourse ramp towards Sector 115.', type: 'walk', distanceMeters: 30, durationSeconds: 25, congestionLevel: 'low' },
        { instruction: 'Turn left behind Section 112 concession area.', type: 'turn', distanceMeters: 10, durationSeconds: 8, congestionLevel: 'medium' },
        { instruction: 'Use the dedicated priority wheelchair elevator (Key card held by Zone 3 Volunteers).', type: 'arrive', distanceMeters: 5, durationSeconds: 15, congestionLevel: 'low' },
      ];
    } else {
      // Generic gate routing
      destination = 'Gate C (South Gate)';
      steps = [
        { instruction: 'Exit your current seating area.', type: 'start', distanceMeters: 0, durationSeconds: 0, congestionLevel: 'low' },
        { instruction: 'Walk towards the lower concourse ring.', type: 'walk', distanceMeters: 30, durationSeconds: 20, congestionLevel: 'medium' },
        { instruction: 'Turn south at the central volunteer booth.', type: 'turn', distanceMeters: 20, durationSeconds: 15, congestionLevel: 'low' },
        { instruction: 'Proceed through the Gate C turnstiles.', type: 'arrive', distanceMeters: 15, durationSeconds: 10, congestionLevel: 'low' },
      ];
    }

    const totalDistanceMeters = steps.reduce((sum, s) => sum + s.distanceMeters, 0);
    const totalDurationSeconds = steps.reduce((sum, s) => sum + s.durationSeconds, 0);

    const route: SmartNavigationRoute = {
      destination,
      steps,
      totalDistanceMeters,
      totalDurationSeconds,
      accessible,
    };

    let responseText = `Here is the optimal route to **${destination}**. ${accessible ? '♿ Accessibility routing is active, utilizing ramps and elevators. ' : ''}Average speed is normal, taking about ${Math.round(totalDurationSeconds / 60)} minutes.`;
    if (metrics.gateCongestion['Gate B (East)'] === 'congested' && queryLower.includes('metro')) {
      responseText += ` **Note: We have rerouted you around Gate B due to a 25-minute bottleneck.**`;
    }

    return {
      responseText,
      detectedIntent: 'navigation',
      suggestedRoute: route,
      promptContextUsed,
    };
  }

  // --- TRANSIT QUERIES ---
  const isTransit = matchKeywords(queryLower, [
    'transit', 'metro', 'bus', 'shuttle', 'uber', 'taxi', 'rideshare', 'traffic', 'delay'
  ]);

  if (isTransit) {
    let transitAlert = '';
    if (metrics.transitStatus.metro === 'delayed') {
      transitAlert = '🚇 **Metro Service Warning:** Metro Terminal is experiencing 15-minute signal delays. ';
    } else if (metrics.transitStatus.metro === 'suspended') {
      transitAlert = '🚨 **Metro Service Suspended:** Metro Station Exit 1 is temporarily closed. ';
    }

    const recShuttles = (metrics.transitStatus.metro === 'delayed' || metrics.transitStatus.metro === 'suspended')
      ? 'We recommend using the **Shuttle Bus Loop (Exit 2)** instead, which is running smoothly.'
      : 'Metro and Shuttle Bus networks are running normal operations.';

    return {
      responseText: `${transitAlert}**Current Transit Hub Status:**
- Metro Line 1: **${metrics.transitStatus.metro.toUpperCase()}**
- Shuttle Bus loop: **${metrics.transitStatus.shuttles.toUpperCase()}**
- Rideshare Pickup Zone: **${metrics.transitStatus.rideshare.toUpperCase()}**

${recShuttles} Rideshare queues are normal, but surge pricing is active around Exit 4.`,
      detectedIntent: 'transit',
      promptContextUsed,
    };
  }

  // --- DICTIONARY MATCHING TRANSLATION ---
  for (const [key, value] of Object.entries(TRANSLATIONS_DB)) {
    for (const [lang, translation] of Object.entries(value.translations)) {
      if (queryLower.includes(translation.toLowerCase()) || queryLower.includes(key)) {
        const text = value.responseTemplate[language] || value.responseTemplate['en'];
        return {
          responseText: `🌍 **[Multilingual Assistance - Detected Language: ${lang.toUpperCase()}]**\n\n${text}`,
          detectedIntent: 'translation',
          promptContextUsed,
        };
      }
    }
  }

  // --- PERSONA SPECIFIC CHAT RESPONSES ---
  if (role === 'staff') {
    if (matchKeywords(queryLower, ['shift', 'volunteer', 'where is', 'deploy'])) {
      return {
        responseText: `Volunteers are currently deployed across 4 zones:
- **Gate B Entrance**: 24 volunteers (high crowd load).
- **Concourse West & Restrooms**: 18 volunteers.
- **Eco-Sectors**: 12 volunteers.
- **Standby & Medical**: 31 volunteers.
Incident queue has 0 unassigned high-priority alerts. Volunteer ETA averages 1 min 45 secs. You can dispatch extra units using the simulator controls.`,
        detectedIntent: 'staff_ops',
        promptContextUsed,
      };
    }

    return {
      responseText: `ArenaSphere AI Operational Command system ready. Stadium safety levels are **NOMINAL**. Live Eco-Index is **${metrics.ecoScore}/100**. Average concession queue is **${metrics.avgWaitTimeMin} minutes**.
You can query crowd bottlenecks, energy grid logs, sustainability indices, or dispatch volunteer/medical escorts.`,
      detectedIntent: 'staff_general',
      promptContextUsed,
    };
  }

  if (role === 'volunteer') {
    return {
      responseText: `Hello Volunteer! Here are your active protocols:
1. **Safety Protocol**: Report any unattended bags to Security Command via chat.
2. **First-Aid Assist**: For medical incidents, type "medical" to locate the closest medic and trigger GPS routing coordinates.
3. **Fans Assistance**: Use the Translation Mode to answer international fans in 5 languages.
Active Assignment: Monitor escalator flow near Sector 108. Gate B scanner is currently congested.`,
      detectedIntent: 'volunteer_protocols',
      promptContextUsed,
    };
  }

  // Fan general response
  return {
    responseText: `Welcome to the FIFA World Cup 2026 stadium! I am **ArenaSphere AI**. 
I can help you navigate to your seats (e.g. Sector 115), find concession wait times, suggest Eco recycling bins, translate languages, or show public transit schedules. 

How can I assist your match day today?`,
    detectedIntent: 'general_welcome',
    promptContextUsed,
  };
}

// Generates the daily report report in markdown
export function generateAIDailyReport(metrics: StadiumMetrics, activeIncidents: Incident[]): string {
  const currentAttendance = Math.round(65000 * (metrics.crowdDensity / 100));
  const resolvedCount = activeIncidents.filter(i => i.status === 'resolved').length;
  const activeCount = activeIncidents.filter(i => i.status === 'active').length;

  const crowdLog = metrics.crowdDensity > 80 
    ? '⚠️ Peak crowd capacity reached during game play. Bottle-necks detected at East stand corridors.'
    : '🟢 Steady traffic flow through concourses. Normal security queue times (3-5 mins).';

  const carbonReductionPercent = Math.round((metrics.energySolarKw / (metrics.energySolarKw + metrics.energyGridKw)) * 100);

  return `
# 🏆 FIFA World Cup 2026 — Stadium Operations Summary Report
*Generated by ArenaSphere AI Operational Intelligence Engine*

---

## 📊 1. ATTENDANCE & CROWD INSIGHTS
* **Estimated Attendance**: ${currentAttendance.toLocaleString()} / 65,000 capacity
* **Peak Gate Flow Rate**: 385 scans / min (North Plaza)
* **Crowd Density**: **${metrics.crowdDensity}%**
* **Gate Operations**:
${Object.entries(metrics.gateCongestion).map(([gate, status]) => `  * ${gate}: **${status.toUpperCase()}**`).join('\n')}

**Crowd Sentiment Analyser**: 92% Positive / Safe. ${crowdLog}

---

## 🚨 2. INCIDENT & SAFETY REGISTER
* **Active Incidents**: ${activeCount}
* **Resolved Incidents**: ${resolvedCount}
* **Average Response Time**: 1 min 54 sec
* **Status Updates**:
${activeIncidents.length > 0 
  ? activeIncidents.map(inc => `  * **[${inc.priority.toUpperCase()}] ${inc.title}** at ${inc.locationName} | Status: *${inc.status.toUpperCase()}* | Assigned: ${inc.nearestVolunteerName || 'N/A'}`).join('\n')
  : '  * No incidents reported today. Safety metrics are fully green.'}

---

## 🌿 3. SUSTAINABILITY & RECYCLING METRICS
* **Arena Eco Score**: **${metrics.ecoScore} / 100**
* **Energy Microgrid Status**:
  * Solar Generation: **${metrics.energySolarKw} kW**
  * Grid Backup Load: **${metrics.energyGridKw} kW**
  * Carbon Offset Ratio: **${carbonReductionPercent}% Renewable**
* **Waste Analytics**:
  * Diverted Waste: **${metrics.waterSavedLitres} Litres** water saved via low-flow sensors
  * Live recycling rate: **${metrics.recyclingRatePercent}%**
  * Top Eco Gate: Gate C (92% sorting accuracy)

---

## 💡 4. AI PREDICTIVE RECOMMENDATIONS
1. ${metrics.avgWaitTimeMin > 20 
    ? '⚠️ Reroute fans in East Concourse to South Food Stall C to balance halftime queue spikes.'
    : '🟢 Concession lines are within standard operating SLAs.'}
2. ${metrics.transitStatus.metro !== 'on-time'
    ? '⚠️ Deploy auxiliary bus shuttle lanes near Exit 2 due to Metro Line 1 delays.'
    : '🟢 Public transport connections are flowing normally.'}
3. 💡 **Eco-Efficiency**: Shift peripheral field floodlights to night mode 10 minutes post-match to save 800 kWh.
`;
}

// Sustainability analysis
export function generateAIEcoScoreDetails(metrics: StadiumMetrics) {
  const score = metrics.ecoScore;
  let rating = 'Bronze';
  if (score >= 90) rating = 'Platinum';
  else if (score >= 80) rating = 'Gold';
  else if (score >= 70) rating = 'Silver';

  const carbonReductionKg = Math.round(metrics.energySolarKw * 0.45); // simulated multiplier

  return {
    rating,
    carbonReductionKg,
    suggestions: [
      { text: 'Increase volunteer sorting presence at Food Court A (92% load)', impact: '+3 Eco Score, +150 kg recycled' },
      { text: 'Enable HVAC low-power mode in empty suites (Sectors 200-210)', impact: '-40 kW energy draw' },
      { text: 'Promote Transit Exit 2 Shuttle bus loop to fans in West concourse', impact: '-12% rideshare CO2 output' },
    ],
  };
}
