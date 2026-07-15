import React, { useState, useRef, useEffect } from 'react';
import { Persona, AICopilotState } from '../types/stadium';
import { Mic, Send, Trash2, Volume2, ShieldAlert, Navigation, Code, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../data/translations';

interface AICopilotProps {
  role: Persona;
  chatHistory: AICopilotState['chatHistory'];
  isListening: boolean;
  accessibilityMode: boolean;
  currentLanguage: string;
  onSetLanguage: (lang: string) => void;
  onSendMessage: (text: string) => void;
  onSimulateVoice: (query: string) => void;
  onClearChat: () => void;
  lastPromptContextUsed?: string;
}

export const AICopilot: React.FC<AICopilotProps> = ({
  role,
  chatHistory,
  isListening,
  accessibilityMode,
  currentLanguage,
  onSetLanguage,
  onSendMessage,
  onSimulateVoice,
  onClearChat,
  lastPromptContextUsed,
}) => {
  const [inputText, setInputText] = useState('');
  const [showPromptContext, setShowPromptContext] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isListening]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleVoiceClick = () => {
    // Select a voice simulation query based on role
    const voiceQueries: Record<Persona, string[]> = {
      fan: [
        'Where is the nearest restroom?',
        'Where can I recycle plastic cups?',
        'How do I get to the Metro Station?',
        'I need medical assistance.',
        'Where is the nearest elevator for wheelchair access?'
      ],
      staff: [
        'Show active volunteers shift deployment.',
        'Generate stadium crowd congestion status.',
        'Trigger solar power savings audit.',
        'Where is the nearest medic in Sector 108?'
      ],
      volunteer: [
        'What are the matchday safety protocols?',
        'Coordinate wheelchair assistance for Sector 122.',
        'Translate: How do I find Gate C?',
        'Locate nearest First Aid station.'
      ],
    };
    
    const queries = voiceQueries[role];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    onSimulateVoice(randomQuery);
  };

  // Predefined prompt chips for quick questioning
  const getPromptChips = (): string[] => {
    if (role === 'fan') {
      return [
        'Restroom route 🚻',
        'Recycle plastic cups ♻️',
        'Metro transit directions 🚇',
        'Wheelchair access elevator ♿',
      ];
    } else if (role === 'staff') {
      return [
        'Volunteer deployments list 👥',
        'Eco score details 🌿',
        'Crowd bottleneck diagnostics 🚦',
        'Generate ops briefing report 📊',
      ];
    } else {
      return [
        'Safety & Emergency protocols 🚨',
        'Medic sector coordinates ➕',
        'Accessible escort ticket Gate A ♿',
        'French Translation help 🌍',
      ];
    }
  };

  const handleChipClick = (chipText: string) => {
    let finalQuery = chipText;
    // Map chip texts to clean questions matching the regex intents
    if (chipText.includes('Restroom route')) finalQuery = 'Where is the nearest restroom?';
    if (chipText.includes('Recycle plastic cups')) finalQuery = 'Where can I recycle plastic cups?';
    if (chipText.includes('Metro transit directions')) finalQuery = 'How do I get to the Metro Station?';
    if (chipText.includes('Wheelchair access elevator')) finalQuery = 'Where is the nearest elevator for wheelchair access?';
    if (chipText.includes('Volunteer deployments')) finalQuery = 'Show active volunteers deployment details';
    if (chipText.includes('Eco score details')) finalQuery = 'Give me the stadium eco score status report';
    if (chipText.includes('Crowd bottleneck')) finalQuery = 'Show crowd bottleneck diagnostics';
    if (chipText.includes('ops briefing')) finalQuery = 'Generate daily operations report briefing';
    if (chipText.includes('Safety & Emergency')) finalQuery = 'What are the safety and emergency protocols?';
    if (chipText.includes('Medic sector')) finalQuery = 'Where is the nearest medic? I need medical assistance.';
    if (chipText.includes('Accessible escort')) finalQuery = 'Where is the nearest elevator for wheelchair access in Sector 122?';
    if (chipText.includes('French Translation')) finalQuery = 'Where is the nearest restroom? (French translation)';

    onSendMessage(finalQuery);
  };

  // Play audio simulation
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const cleanText = text.replace(/[*#]/g, ''); // strip markdown
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = currentLanguage;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech not supported on this browser.');
    }
  };

  return (
    <div className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      border: '1px solid var(--accent-cyan-glow)',
      boxShadow: 'rgba(0, 240, 255, 0.03) 0px 8px 32px 0px',
      padding: '1rem',
    }}>
      
      {/* Copilot Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            background: 'var(--accent-cyan-glow)',
            color: 'var(--accent-cyan)',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Mic size={14} />
          </div>
          <div>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 800 }}>ArenaSphere AI</h2>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              Gemini-powered Assist • Active
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {/* View Prompt Context */}
          <button
            onClick={() => setShowPromptContext(!showPromptContext)}
            style={{ background: 'transparent', border: 'none', color: showPromptContext ? 'var(--accent-cyan)' : 'var(--text-secondary)', padding: '0.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Inspect AI prompt engineering context window"
          >
            <Code size={16} />
          </button>
          
          {/* Clear Chat */}
          <button
            onClick={onClearChat}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '0.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Clear conversation"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Language Switcher bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.5rem 0', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <Globe size={11} /> Support Language:
        </span>
        <select
          value={currentLanguage}
          onChange={(e) => onSetLanguage(e.target.value)}
          style={{
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            fontSize: '0.65rem',
            padding: '2px 6px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* CHAT MESSAGES DISPLAY */}
      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        padding: '0.5rem 0.2rem',
        margin: '0.5rem 0',
      }}>
        {chatHistory.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isAi ? 'flex-start' : 'flex-end',
                maxWidth: '90%',
                alignSelf: isAi ? 'flex-start' : 'flex-end',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              {/* Message bubble */}
              <div
                style={{
                  background: isAi 
                    ? (msg.isEmergencyResponse ? 'rgba(244,63,94,0.12)' : 'rgba(255,255,255,0.04)')
                    : 'linear-gradient(135deg, var(--accent-cyan), #00a8ff)',
                  border: isAi 
                    ? `1px solid ${msg.isEmergencyResponse ? 'rgba(244,63,94,0.3)' : 'var(--border-color)'}`
                    : 'none',
                  color: isAi ? 'var(--text-primary)' : '#050811',
                  borderRadius: isAi ? '12px 12px 12px 2px' : '12px 12px 2px 12px',
                  padding: '0.6rem 0.85rem',
                  fontSize: accessibilityMode ? '0.9rem' : '0.8rem',
                  lineHeight: '1.45',
                  wordBreak: 'break-word',
                  position: 'relative',
                }}
              >
                {/* Emergency Header tag */}
                {msg.isEmergencyResponse && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--status-emergency)', fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    <ShieldAlert size={11} /> High Priority Alert Dispatch
                  </div>
                )}

                {/* Text body */}
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                </div>

                {/* Audio button for AI speech simulation */}
                {isAi && (
                  <button
                    onClick={() => speakText(msg.text)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      position: 'absolute',
                      right: '4px',
                      bottom: '4px',
                      padding: '2px',
                    }}
                    title="Audio Guidance Speak"
                  >
                    <Volume2 size={11} />
                  </button>
                )}
              </div>

              {/* Timestamp */}
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '2px', alignSelf: isAi ? 'flex-start' : 'flex-end', padding: '0 2px' }}>
                {msg.timestamp}
              </span>

              {/* Render Navigation route cards if returned */}
              {isAi && msg.routeInfo && (
                <div 
                  className="nav-steps-container"
                  style={{
                    border: '1px solid rgba(0, 240, 255, 0.25)',
                    boxShadow: 'rgba(0, 240, 255, 0.05) 0 4px 12px',
                    width: '100%',
                    marginTop: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 'bold', marginBottom: '0.35rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.2rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Navigation size={11} /> Optimal Route to {msg.routeInfo.destination}
                    </span>
                    <span>{Math.round(msg.routeInfo.totalDurationSeconds / 60)} mins</span>
                  </div>

                  {msg.routeInfo.steps.map((step, sIdx) => (
                    <div key={sIdx} className="nav-step-item">
                      <div className="nav-step-bullet">{sIdx + 1}</div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-primary)', display: 'block' }}>{step.instruction}</span>
                        <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
                          Distance: {step.distanceMeters}m | Delay: <span style={{ color: step.congestionLevel === 'high' ? 'var(--status-congested)' : 'var(--text-muted)' }}>{step.congestionLevel}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing listening state */}
        {isListening && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--accent-cyan)', fontSize: '0.75rem', padding: '0.35rem' }}>
            <span className="pulse-glow-cyan" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />
            🎤 Listening & Transcribing...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Prompt Suggestions chips */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
        {getPromptChips().map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(chip)}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.65rem',
              padding: '0.3rem 0.55rem',
              borderRadius: '20px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = '1px solid var(--accent-cyan)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '1px solid var(--border-color)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* User Chat input field */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: 'auto' }}>
        <button
          type="button"
          onClick={handleVoiceClick}
          style={{
            background: isListening ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${isListening ? 'var(--status-emergency)' : 'var(--border-color)'}`,
            color: isListening ? 'var(--status-emergency)' : 'var(--text-primary)',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          title="Simulate Voice Input"
        >
          <Mic size={16} />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isListening ? 'Speak now...' : `Ask ArenaSphere AI...`}
          disabled={isListening}
          style={{
            flex: 1,
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            borderRadius: '8px',
            padding: '0.5rem 0.75rem',
            fontSize: '0.75rem',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent-cyan)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
        />

        <button
          type="submit"
          className="btn-primary"
          style={{ width: '36px', height: '36px', padding: 0, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          disabled={!inputText.trim()}
        >
          <Send size={15} />
        </button>
      </form>

      {/* AI PROMPT ENGINE CONTEXT INSPECTOR (MODAL/DRAWER) */}
      {showPromptContext && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1.5rem',
        }}>
          <div className="glass-card" style={{
            width: '95%',
            maxWidth: '560px',
            background: '#070a13',
            border: '1px solid var(--accent-cyan)',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.25rem',
            boxShadow: '0 10px 40px rgba(0, 240, 255, 0.25)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Code size={16} style={{ color: 'var(--accent-cyan)' }} /> AI Prompt Context Engine (System Logs)
              </h3>
              <button
                onClick={() => setShowPromptContext(false)}
                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'var(--text-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}
              >
                Close
              </button>
            </div>

            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Below is the structured context compiled by the **ArenaSphere Prompt Engine** representing the exact prompt parameters formatted for the LLM during the last query:
            </p>

            <div style={{
              overflowY: 'auto',
              flex: 1,
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '6px',
              padding: '0.85rem',
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              color: 'var(--accent-cyan)',
              whiteSpace: 'pre-wrap',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              {lastPromptContextUsed || lastPromptContextUsed === '' ? lastPromptContextUsed : 'No query processed yet. Send a message to inspect compilation parameters.'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowPromptContext(false)}
                className="btn-primary"
                style={{ fontSize: '0.7rem', padding: '0.4rem 0.8rem' }}
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default AICopilot;
