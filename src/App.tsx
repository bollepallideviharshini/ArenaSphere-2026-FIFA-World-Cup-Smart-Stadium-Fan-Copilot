import React from 'react';
import { useSimulation } from './hooks/useSimulation';
import { useArenaAI } from './hooks/useArenaAI';
import { Navbar } from './components/Navbar';
import { StadiumMap } from './components/StadiumMap';
import { OperationsDashboard } from './components/OperationsDashboard';
import { SimulatorPanel } from './components/SimulatorPanel';
import { AIInsightsPanel } from './components/AIInsightsPanel';
import { AICopilot } from './components/AICopilot';
import { KPIWidget } from './components/KPIWidget';
import { Shield, Activity, Leaf, Users } from 'lucide-react';
import { AIRecommendation } from './types/stadium';

import './styles/globals.css';

export const App: React.FC = () => {
  const {
    metrics,
    incidents,
    activeEventId,
    triggerEvent,
    resolveIncident,
    resetSimulation,
  } = useSimulation();

  const {
    role,
    setRole,
    chatHistory,
    isListening,
    accessibilityMode,
    setAccessibilityMode,
    currentLanguage,
    setCurrentLanguage,
    lastResponse,
    sendMessage,
    simulateVoiceInput,
    clearChat,
  } = useArenaAI('fan');

  // Triggering simulation events can automatically alert the user in the AI Chat
  const handleTriggerSimulationEvent = (eventId: string) => {
    const newInc = triggerEvent(eventId);
    if (newInc) {
      // Direct message injection from System to Chat
      sendMessage(`[SYSTEM INTRUDER ALERT] Active event triggered: ${newInc.title} at ${newInc.locationName}. Assess response requirements.`, metrics, incidents);
    }
  };

  // Mitigation dispatcher: Clicking "Apply Action" from AI Insights resolves safety/congestion incident
  const handleTriggerMitigation = (rec: AIRecommendation) => {
    // Locate the matching active incident
    let targetIncidentCategory = '';
    if (rec.category === 'crowd') targetIncidentCategory = 'crowd';
    if (rec.category === 'volunteer') targetIncidentCategory = 'medical';
    if (rec.category === 'transit') targetIncidentCategory = 'transit';
    if (rec.category === 'sustainability') targetIncidentCategory = 'sustainability';
    if (rec.category === 'facility') targetIncidentCategory = 'facility';

    const activeTarget = incidents.find(
      (inc) => inc.category === targetIncidentCategory && inc.status === 'active'
    );

    if (activeTarget) {
      resolveIncident(activeTarget.id);
      sendMessage(`Mitigation procedure completed for "${rec.text}". Status restored to Nominal.`, metrics, incidents);
    } else {
      // If it is eco dimming or standard advice, adjust metrics directly
      if (rec.id === 'rec_eco_lights') {
        // Boost solar energy / reduce grid
        sendMessage(`Optimizing energy microgrid levels. Enabled smart LED low-power dimming.`, metrics, incidents);
      } else {
        sendMessage(`Action dispatched: "${rec.text}" applied.`, metrics, incidents);
      }
    }
  };

  return (
    <div className={`app-container ${accessibilityMode ? 'accessibility-active' : ''}`}>
      {/* Navbar HUD */}
      <Navbar
        currentRole={role}
        onRoleChange={setRole}
        accessibilityMode={accessibilityMode}
        onToggleAccessibility={() => setAccessibilityMode(!accessibilityMode)}
      />

      {/* KPI Status Deck */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: '1rem',
        padding: '1.25rem 1.5rem 0 1.5rem',
      }}>
        <KPIWidget
          title="Stadium Safety Status"
          value={metrics.activeIncidentsCount > 0 ? `${metrics.activeIncidentsCount} ACTIVE` : 'SECURE'}
          icon={<Shield size={18} />}
          trend={metrics.activeIncidentsCount > 0 ? '⚠️ Action Required' : '✓ Nominal'}
          trendType={metrics.activeIncidentsCount > 0 ? 'negative' : 'positive'}
          glowColor={metrics.activeIncidentsCount > 0 ? 'red' : 'green'}
        />
        <KPIWidget
          title="Crowd Occupancy"
          value={`${metrics.crowdDensity}%`}
          icon={<Users size={18} />}
          trend={`${Math.round(65000 * (metrics.crowdDensity / 100)).toLocaleString()} / 65k`}
          trendType="neutral"
          glowColor={metrics.crowdDensity > 85 ? 'yellow' : 'cyan'}
        />
        <KPIWidget
          title="Avg Concession Wait"
          value={`${metrics.avgWaitTimeMin} Min`}
          icon={<Activity size={18} />}
          trend={metrics.avgWaitTimeMin > 20 ? 'Queue bottleneck' : 'Flowing'}
          trendType={metrics.avgWaitTimeMin > 20 ? 'negative' : 'positive'}
          glowColor={metrics.avgWaitTimeMin > 20 ? 'yellow' : 'green'}
        />
        <KPIWidget
          title="Stadium Carbon Saving"
          value={`${metrics.ecoScore}/100`}
          icon={<Leaf size={18} />}
          trend={`${Math.round((metrics.energySolarKw / (metrics.energySolarKw + metrics.energyGridKw)) * 100)}% Green Solar`}
          trendType="positive"
          glowColor="green"
        />
      </div>

      {/* Main Workspace Layout */}
      <main className="main-content" style={{ flex: 1 }}>
        <div className="workspace-grid">
          
          {/* LEFT COMMAND CENTER GRID */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', height: '100%', paddingRight: '0.4rem' }}>
            
            {/* Live Map & Operational Simulator row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.25rem' }}>
              {/* Interactive Stadium SVG Plan */}
              <StadiumMap
                metrics={metrics}
                activeIncidents={incidents}
                onSelectZone={(query) => sendMessage(query, metrics, incidents)}
              />

              {/* AI live Recommendations Box */}
              <AIInsightsPanel
                metrics={metrics}
                activeIncidents={incidents}
                onTriggerMitigation={handleTriggerMitigation}
              />
            </div>

            {/* Bottom Row: Analytics & Incident controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.25rem' }}>
              {/* Sustainability gauge & Concession wait times & Incidents Table */}
              <OperationsDashboard
                metrics={metrics}
                incidents={incidents}
                onResolveIncident={resolveIncident}
              />

              {/* 12+ scenario preset trigger panel */}
              <SimulatorPanel
                onTriggerEvent={handleTriggerSimulationEvent}
                onReset={resetSimulation}
                activeEventId={activeEventId}
              />
            </div>

          </div>

          {/* RIGHT SIDE PANEL: ARENASPHERE AI COPILOT */}
          <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <AICopilot
              role={role}
              chatHistory={chatHistory}
              isListening={isListening}
              accessibilityMode={accessibilityMode}
              currentLanguage={currentLanguage}
              onSetLanguage={setCurrentLanguage}
              onSendMessage={(text) => sendMessage(text, metrics, incidents)}
              onSimulateVoice={(text) => simulateVoiceInput(text, metrics, incidents)}
              onClearChat={clearChat}
              lastPromptContextUsed={lastResponse?.promptContextUsed}
            />
          </div>

        </div>
      </main>
    </div>
  );
};
export default App;
