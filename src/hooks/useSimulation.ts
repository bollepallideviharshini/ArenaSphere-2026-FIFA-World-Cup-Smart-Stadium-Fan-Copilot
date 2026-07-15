import { useState, useCallback } from 'react';
import { StadiumMetrics, Incident } from '../types/stadium';
import { INITIAL_METRICS } from '../data/stadiumData';
import { SIMULATION_EVENTS } from '../data/incidents';

export function useSimulation() {
  const [metrics, setMetrics] = useState<StadiumMetrics>(INITIAL_METRICS);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  const triggerEvent = useCallback((eventId: string): Incident | null => {
    const event = SIMULATION_EVENTS.find(e => e.id === eventId);
    if (!event) return null;

    setActiveEventId(eventId);

    // 1. Compile details for the new Incident
    let newIncident: Incident | null = null;
    if (event.incidentTemplate) {
      newIncident = {
        ...event.incidentTemplate,
        id: `INC-${Date.now().toString().slice(-4)}`,
        status: 'active',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      } as Incident;

      setIncidents(prev => [newIncident!, ...prev]);
    }

    // 2. Adjust Stadium Metrics
    setMetrics(prev => {
      const next = { ...prev };
      
      // Basic modifiers
      if (event.metricModifiers.crowdDensity !== undefined) {
        next.crowdDensity = Math.min(100, Math.max(0, event.metricModifiers.crowdDensity));
      }
      if (event.metricModifiers.ecoScore !== undefined) {
        next.ecoScore = Math.min(100, Math.max(0, event.metricModifiers.ecoScore));
      }
      if (event.metricModifiers.carbonFootprint !== undefined) {
        next.carbonFootprint = event.metricModifiers.carbonFootprint;
      }
      if (event.metricModifiers.avgWaitTimeMin !== undefined) {
        next.avgWaitTimeMin = event.metricModifiers.avgWaitTimeMin;
      }
      if (event.metricModifiers.energySolarKw !== undefined) {
        next.energySolarKw = event.metricModifiers.energySolarKw;
      }
      if (event.metricModifiers.energyGridKw !== undefined) {
        next.energyGridKw = event.metricModifiers.energyGridKw;
      }
      if (event.metricModifiers.activeVolunteerCount !== undefined) {
        next.activeVolunteerCount = Math.min(next.volunteerCount, event.metricModifiers.activeVolunteerCount);
      }
      
      // Transit modifiers
      if (event.metricModifiers.transitStatus) {
        next.transitStatus = {
          ...next.transitStatus,
          ...event.metricModifiers.transitStatus,
        };
      }

      // Gate congestion modifiers
      if (event.metricModifiers.gateCongestion) {
        next.gateCongestion = {
          ...next.gateCongestion,
          ...event.metricModifiers.gateCongestion,
        };
      }

      // Automatically recalculate incident count
      const activeCount = incidents.filter(i => i.status === 'active').length + (newIncident ? 1 : 0);
      next.activeIncidentsCount = activeCount;

      return next;
    });

    return newIncident;
  }, [incidents]);

  const resolveIncident = useCallback((incidentId: string) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === incidentId ? { ...inc, status: 'resolved' } : inc))
    );

    // Partially restore metrics to simulate operational recovery
    setMetrics(prev => {
      const next = { ...prev };
      const resolved = incidents.find(i => i.id === incidentId);
      
      if (resolved) {
        // Recover Gate status
        if (resolved.category === 'crowd') {
          // Reset all gates back to moderate/clear
          next.gateCongestion = {
            'Gate A (North)': 'clear',
            'Gate B (East)': 'moderate',
            'Gate C (South)': 'clear',
            'Gate D (West)': 'clear',
          };
          next.avgWaitTimeMin = Math.max(12, next.avgWaitTimeMin - 10);
        }
        
        // Recover Eco rating
        if (resolved.category === 'sustainability') {
          next.ecoScore = Math.min(100, next.ecoScore + 8);
          next.recyclingRatePercent = Math.min(100, next.recyclingRatePercent + 4);
        }

        // Recover transit
        if (resolved.category === 'transit') {
          next.transitStatus = {
            metro: 'on-time',
            shuttles: 'on-time',
            rideshare: 'normal',
          };
          next.avgWaitTimeMin = Math.max(12, next.avgWaitTimeMin - 8);
        }

        // Recover medical volunteer load
        if (resolved.category === 'medical') {
          next.activeVolunteerCount = Math.max(85, next.activeVolunteerCount - 1);
        }
      }

      // Recalculate remaining active incidents count
      const activeCount = incidents.filter(i => i.id !== incidentId && i.status === 'active').length;
      next.activeIncidentsCount = activeCount;

      return next;
    });
  }, [incidents]);

  const resetSimulation = useCallback(() => {
    setMetrics(INITIAL_METRICS);
    setIncidents([]);
    setActiveEventId(null);
  }, []);

  return {
    metrics,
    incidents,
    activeEventId,
    triggerEvent,
    resolveIncident,
    resetSimulation,
  };
}
