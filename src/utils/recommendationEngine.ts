import { StadiumMetrics, Incident, AIRecommendation } from '../types/stadium';

export function getAIRecommendations(metrics: StadiumMetrics, activeIncidents: Incident[]): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];

  // 1. Crowd Congestion & Gate Controls
  if (metrics.crowdDensity > 85) {
    recommendations.push({
      id: 'rec_crowd_density',
      text: 'Stadium crowd density is critical (85%+). Broadcast navigation directions to less crowded gate exits and slow down concourse ticket scanners.',
      category: 'crowd',
      impact: 'Reduces bottleneck pressure by 18%',
      actionable: true,
      actionText: 'Activate Safe Egress Routing',
    });
  }

  const congestedGates = Object.entries(metrics.gateCongestion)
    .filter(([_, status]) => status === 'congested')
    .map(([gate]) => gate.split(' ')[0]); // Get 'Gate' prefix

  if (congestedGates.length > 0) {
    recommendations.push({
      id: 'rec_gate_divert',
      text: `Congestion detected at ${congestedGates.join(', ')}. Redirect incoming fans to Gate C (South) or Gate A (North) where wait times are under 4 minutes.`,
      category: 'crowd',
      impact: 'Balances ingress times, saves ~12 mins/fan',
      actionable: true,
      actionText: 'Reroute Gate Signs',
    });
  }

  // 2. Incident & Volunteer Dispatch
  const activeMedicals = activeIncidents.filter(inc => inc.category === 'medical' && inc.status === 'active');
  if (activeMedicals.length > 0) {
    recommendations.push({
      id: 'rec_medical_dispatch',
      text: `Medical incident active in stand. Alert closest Medical Station and dispatch Volunteer Escorts to clear path for stretchers.`,
      category: 'volunteer',
      impact: 'Reduces medical ETA by ~90 seconds',
      actionable: true,
      actionText: 'Priority Dispatch Medic',
    });
  }

  // 3. Concessions & Wait Times
  if (metrics.avgWaitTimeMin > 20) {
    recommendations.push({
      id: 'rec_concession_divert',
      text: 'Concession queue times exceed 20 minutes in East concourse. Proactively push notification to nearby fans suggesting Food Court C (South) with a 5-minute wait.',
      category: 'facility',
      impact: 'Decreases peak queues by 25%',
      actionable: true,
      actionText: 'Push Concession Alert',
    });
  }

  // 4. Transit & Transportation
  if (metrics.transitStatus.metro === 'delayed' || metrics.transitStatus.metro === 'suspended') {
    recommendations.push({
      id: 'rec_transit_reroute',
      text: 'Metro Terminal experiencing signal delays. Open shuttle lanes 4 and 5, and adjust rideshare parking geo-fencing to speed up taxi pickups.',
      category: 'transit',
      impact: 'Prevents Exit 1 passenger back-up',
      actionable: true,
      actionText: 'Deploy Extra Shuttles',
    });
  }

  // 5. Sustainability & Energy Grid
  if (metrics.energySolarKw < 50 && metrics.energyGridKw > 400) {
    recommendations.push({
      id: 'rec_eco_lights',
      text: 'Solar capacity depleted due to cloud/night conditions. Activate smart stadium LED dimming in VIP areas and secondary escalators.',
      category: 'sustainability',
      impact: 'Saves 420kWh energy, +3% Eco Score',
      actionable: true,
      actionText: 'Enable Eco-Dimming',
    });
  }

  const sustainabilityIncidents = activeIncidents.filter(inc => inc.category === 'sustainability' && inc.status === 'active');
  if (sustainabilityIncidents.length > 0) {
    recommendations.push({
      id: 'rec_eco_empty',
      text: 'Compost & Recycle bins are overflowing at Eco Hub South. Automatically dispatch green-team clean up crew.',
      category: 'sustainability',
      impact: 'Prevents littering and increases sorting compliance',
      actionable: true,
      actionText: 'Alert Clean-up Crew',
    });
  }

  // Default suggestions if no active events
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'rec_default_sustain',
      text: 'Stadium energy usage is stable. Promote the eco-refill bottle initiative on large screens to reduce single-use plastics.',
      category: 'sustainability',
      impact: 'Saves estimated 2,400 plastic cups',
      actionable: false,
    });
    recommendations.push({
      id: 'rec_default_crowd',
      text: 'Concourse traffic flow is optimal. Standard gate operations are active.',
      category: 'crowd',
      impact: 'Smooth operation',
      actionable: false,
    });
  }

  return recommendations;
}
