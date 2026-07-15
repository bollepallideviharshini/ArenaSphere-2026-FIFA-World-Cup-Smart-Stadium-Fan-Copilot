import { useState, useCallback, useEffect } from 'react';
import { Persona, StadiumMetrics, Incident, AICopilotState } from '../types/stadium';
import { generateAIResponse, AIResponseResult } from '../utils/aiEngine';

const WELCOME_MESSAGES: Record<Persona, string> = {
  fan: "👋 Welcome to SoFi Stadium for the FIFA World Cup 2026! I am **ArenaSphere AI**. I can assist you in finding your gate, seat, concession wait times, restrooms, or help with public transit. I also translate signs. What do you need assistance with?",
  staff: "💼 **ArenaSphere AI Operations Center** active. System metrics are online. I am prepared to compile daily operations reports, provide crowd routing diagnostics, volunteer dispatch recommendations, and safety intelligence alerts.",
  volunteer: "🎒 **ArenaSphere AI Volunteer Companion** loaded. Ready to display volunteer task briefs, emergency protocols, and translator support. Let me know if you need to coordinate access or first-aid routing.",
};

export function useArenaAI(initialRole: Persona) {
  const [role, setRole] = useState<Persona>(initialRole);
  const [chatHistory, setChatHistory] = useState<AICopilotState['chatHistory']>([]);
  const [isListening, setIsListening] = useState(false);
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [lastResponse, setLastResponse] = useState<AIResponseResult | null>(null);

  // Initialize/reset chat on role change
  useEffect(() => {
    setChatHistory([
      {
        id: 'welcome',
        sender: 'ai',
        text: WELCOME_MESSAGES[role],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [role]);

  const sendMessage = useCallback((
    text: string,
    currentMetrics: StadiumMetrics,
    activeIncidents: Incident[]
  ) => {
    if (!text.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessageId = `msg-${Date.now()}`;

    // 1. Add User message to chat
    setChatHistory(prev => [
      ...prev,
      {
        id: userMessageId,
        sender: 'user',
        text,
        timestamp,
      },
    ]);

    // 2. Query AI Engine
    const aiResult = generateAIResponse(
      role,
      text,
      currentMetrics,
      activeIncidents,
      currentLanguage,
      accessibilityMode
    );

    setLastResponse(aiResult);

    // 3. Add AI message after a brief mock delay
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        {
          id: `msg-ai-${Date.now()}`,
          sender: 'ai',
          text: aiResult.responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          routeInfo: aiResult.suggestedRoute,
          isEmergencyResponse: aiResult.detectedIntent === 'emergency',
        },
      ]);
    }, 450);
  }, [role, currentLanguage, accessibilityMode]);

  const simulateVoiceInput = useCallback((
    voiceQueryText: string,
    currentMetrics: StadiumMetrics,
    activeIncidents: Incident[]
  ) => {
    setIsListening(true);
    
    // Simulate speech-to-text transcription delay
    setTimeout(() => {
      setIsListening(false);
      sendMessage(voiceQueryText, currentMetrics, activeIncidents);
    }, 1800);
  }, [sendMessage]);

  const clearChat = useCallback(() => {
    setChatHistory([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: WELCOME_MESSAGES[role],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setLastResponse(null);
  }, [role]);

  return {
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
  };
}
