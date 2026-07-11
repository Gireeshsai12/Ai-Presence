import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SessionHeader from '../components/SessionHeader';
import SessionLayout from '../components/SessionLayout';
import InsightsDrawer from '../components/InsightsDrawer';
import SettingsDrawer from '../components/SettingsDrawer';
import { colors } from '../styles/theme';
import { copyConversation, exportAsJson, exportAsMarkdown, exportAsText } from '../utils/exportChat';
import { createSession, deleteSession, generateSessionTitle, getActiveSessionId, getSessions, getSettings, renameSession, saveSettings, setActiveSessionId, toggleFavoriteSession, updateSession } from '../services/storage';

const modeConfig = {
  interview_coach: { label: 'Interview Coach', description: 'Practice structured answers, confidence, and mock interview conversations.', color: colors.blue },
  resume_reviewer: { label: 'Resume Reviewer', description: 'Review resumes for ATS, keywords, clarity, and impact.', color: colors.purple },
  jd_analyzer: { label: 'JD Analyzer', description: 'Analyze job descriptions and compare them with your profile.', color: colors.green },
  star_evaluator: { label: 'STAR Evaluator', description: 'Improve behavioral answers using Situation, Task, Action, Result.', color: colors.amber },
  communication_coach: { label: 'Communication Coach', description: 'Improve confidence, clarity, pace, and speaking structure.', color: colors.blue2 },
  coding_interview: { label: 'Coding Interview', description: 'Practice coding problems, hints, complexity, and explanation.', color: colors.red },
  study_mentor: { label: 'Study Mentor', description: 'Get calm, step-by-step explanations and learning support.', color: colors.green },
  focus_partner: { label: 'Focus Partner', description: 'Stay accountable, reduce procrastination, and keep moving.', color: colors.amber },
  challenger: { label: 'Challenger', description: 'Get direct, action-focused conversations that push you forward.', color: colors.red },
};

const demoQuestions = ['Tell me about yourself.', 'Describe a challenging project you worked on.', 'What are your strengths and weaknesses?', 'Why do you want this role?', 'Do you have any questions for me?'];

export default function SessionPage() {
  const { mode } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('Disconnected');
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [lastBehavior, setLastBehavior] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(getSettings());
  const [sessions, setSessions] = useState([]);
  const [activeLocalSessionId, setActiveLocalSessionId] = useState('');
  const [memory, setMemory] = useState({ name: '', likes: [], goals: [], personal_notes: [] });
  const [emotionState, setEmotionState] = useState({ user_emotion: 'neutral', ai_mode: 'balanced', emotion_reason: 'No strong emotional signal detected yet.' });
  const [selectedMode, setSelectedMode] = useState(mode || 'interview_coach');
  const [behaviorContext, setBehaviorContext] = useState('No behavior analysis yet.');
  const [aiState, setAiState] = useState('idle');
  const [stats, setStats] = useState({ total_user_messages: 0, voice_messages: 0, text_messages: 0, interruptions: 0 });
  const [liveTranscript, setLiveTranscript] = useState('');
  const [silenceCountdown, setSilenceCountdown] = useState(null);
  const wsRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const speechStartTimeRef = useRef(null);
  const messagesAreaRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const silenceTimerRef = useRef(null);
  const silenceCountdownIntervalRef = useRef(null);
  const sessionIdRef = useRef('');

  useLayoutEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `html,body,#root{margin:0!important;padding:0!important;width:100%!important;height:100%!important;overflow:hidden!important;background:#09090b!important}*{box-sizing:border-box}::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:rgba(15,23,42,.8)}::-webkit-scrollbar-thumb{background:rgba(163,230,53,.45);border-radius:999px}@media(max-width:900px){.session-grid{grid-template-columns:1fr!important}.side-panel{display:none!important}}`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const clearSilenceTools = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (silenceCountdownIntervalRef.current) clearInterval(silenceCountdownIntervalRef.current);
    silenceTimerRef.current = null;
    silenceCountdownIntervalRef.current = null;
    setSilenceCountdown(null);
  }, []);

  const notifyFrontendState = useCallback((state) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ command: 'frontend_state', ai_state: state, session_id: sessionIdRef.current }));
  }, []);

  const notifyInterruption = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ command: 'interruption', session_id: sessionIdRef.current }));
  }, []);

  const speakText = useCallback((text) => {
    if (!settings.autoSpeak) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.voiceRate || 1;
    utterance.pitch = settings.voicePitch || 1;
    const voices = synthRef.current.getVoices?.() || [];
    const selectedVoice = voices.find((voice) => voice.name === settings.voiceName);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.onstart = () => { setIsAISpeaking(true); setAiState('speaking'); notifyFrontendState('speaking'); };
    utterance.onend = () => { setIsAISpeaking(false); setAiState('idle'); notifyFrontendState('idle'); };
    utterance.onerror = () => { setIsAISpeaking(false); setAiState('idle'); notifyFrontendState('idle'); };
    synthRef.current.speak(utterance);
  }, [settings, notifyFrontendState]);

  const connectWebSocket = useCallback((sessionId, modeToUse) => {
    if (wsRef.current) wsRef.current.close();
    sessionIdRef.current = sessionId;
 const apiUrl =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const websocketUrl = apiUrl
  .replace(/^https:/, "wss:")
  .replace(/^http:/, "ws:")
  .replace(/\/$/, "") + "/ws";

const ws = new WebSocket(websocketUrl);
    wsRef.current = ws;
    ws.onopen = () => {
      setStatus('Connected');
      setAiState('idle');
      ws.send(JSON.stringify({ command: 'load_session', session_id: sessionId }));
      ws.send(JSON.stringify({ command: 'set_mode', mode: modeToUse || 'interview_coach', session_id: sessionId }));
    };
    ws.onmessage = (event) => {
      let parsed;
      try { parsed = JSON.parse(event.data); } catch { parsed = { event: 'assistant_reply', reply: event.data }; }
      setStatus('Connected');
      if (parsed.memory) setMemory(parsed.memory);
      if (parsed.emotion_state) setEmotionState(parsed.emotion_state);
      if (parsed.selected_mode) setSelectedMode(parsed.selected_mode);
      if (parsed.behavior_context) setBehaviorContext(parsed.behavior_context);
      if (parsed.messages) setMessages(parsed.messages);
      if (parsed.ai_state) setAiState(parsed.ai_state);
      if (parsed.stats) setStats(parsed.stats);
      if (parsed.event === 'assistant_reply') speakText(parsed.reply || 'No response');
      if (parsed.event === 'error') setIsAISpeaking(false);
    };
    ws.onclose = () => { setStatus('Disconnected'); setAiState('idle'); };
    ws.onerror = () => { setStatus('Disconnected'); setAiState('error'); };
  }, [speakText]);
  const initializeLocalSession = useCallback(() => {
    let allSessions = getSessions();
    let activeId = getActiveSessionId();
    if (!activeId || !allSessions.find((session) => session.id === activeId)) {
      const newSession = createSession(mode || 'interview_coach');
      activeId = newSession.id;
      allSessions = getSessions();
    }
    const activeSession = allSessions.find((session) => session.id === activeId);
    setSessions(allSessions);
    setActiveLocalSessionId(activeId);
    sessionIdRef.current = activeId;
    if (activeSession) {
      setSelectedMode(activeSession.mode || mode || 'interview_coach');
      setMessages(activeSession.messages || []);
      connectWebSocket(activeId, activeSession.mode || mode || 'interview_coach');
    }
  }, [mode, connectWebSocket]);

  useEffect(() => { initializeLocalSession(); return () => { clearSilenceTools(); if (wsRef.current) wsRef.current.close(); }; }, [initializeLocalSession, clearSilenceTools]);

  useEffect(() => { const box = messagesAreaRef.current; if (box) box.scrollTop = box.scrollHeight; }, [messages, aiState, liveTranscript]);

  useEffect(() => {
    if (!activeLocalSessionId) return;
    const title = generateSessionTitle(messages);
    updateSession(activeLocalSessionId, { title, mode: selectedMode, messages });
    setSessions(getSessions());
  }, [messages, selectedMode, activeLocalSessionId]);

  const stopAISpeaking = useCallback((markInterrupted = false) => {
    synthRef.current.cancel();
    setIsAISpeaking(false);
    if (markInterrupted) { setAiState('interrupted'); notifyInterruption(); }
    else { setAiState('idle'); notifyFrontendState('idle'); }
  }, [notifyFrontendState, notifyInterruption]);

  const handleNewSession = () => {
    stopAISpeaking(false); clearSilenceTools();
    const newSession = createSession(selectedMode);
    setSessions(getSessions()); setActiveLocalSessionId(newSession.id); setActiveSessionId(newSession.id);
    setMessages([]); setDemoMode(false); setDemoStep(0); setLastBehavior(null); setAiState('idle'); setLiveTranscript('');
    connectWebSocket(newSession.id, selectedMode);
  };

  const handleSelectSession = (sessionId) => {
    const allSessions = getSessions();
    const selected = allSessions.find((session) => session.id === sessionId);
    if (!selected) return;
    stopAISpeaking(false); clearSilenceTools();
    setActiveSessionId(sessionId); setActiveLocalSessionId(sessionId); setSessions(allSessions); setMessages(selected.messages || []); setSelectedMode(selected.mode || 'interview_coach'); setDemoMode(false); setDemoStep(0); setAiState('idle'); setLiveTranscript('');
    connectWebSocket(sessionId, selected.mode || 'interview_coach');
  };

  const handleDeleteSession = (sessionId) => {
    const updatedSessions = deleteSession(sessionId);
    setSessions(updatedSessions);
    const newActiveId = getActiveSessionId();
    if (!newActiveId) { handleNewSession(); return; }
    const active = updatedSessions.find((session) => session.id === newActiveId);
    setActiveLocalSessionId(newActiveId); setMessages(active?.messages || []); setSelectedMode(active?.mode || 'interview_coach');
    connectWebSocket(newActiveId, active?.mode || 'interview_coach');
  };

  const handleRenameSession = (sessionId, title) => { renameSession(sessionId, title); setSessions(getSessions()); };
  const handleToggleFavorite = (sessionId) => { toggleFavoriteSession(sessionId); setSessions(getSessions()); };

  const sendModeChange = (nextMode) => {
    setSelectedMode(nextMode);
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ command: 'set_mode', mode: nextMode, session_id: sessionIdRef.current }));
  };

  const countHesitations = (text) => text.toLowerCase().split(/\s+/).filter((word) => ['um','uh','hmm','erm','like'].includes(word.replace(/[^\w]/g,''))).length;
  const analyzeSpeechBehavior = (text, durationSeconds) => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const hesitationCount = countHesitations(text);
    const wordsPerSecond = durationSeconds > 0 ? wordCount / durationSeconds : 0;
    let speakingStyle = 'normal';
    if (wordsPerSecond > 2.5) speakingStyle = 'fast'; else if (wordsPerSecond > 0 && wordsPerSecond < 1.2) speakingStyle = 'slow';
    let pauseLevel = 'low';
    if (durationSeconds > 7 && wordCount < 8) pauseLevel = 'high'; else if (durationSeconds > 4 && wordCount < 8) pauseLevel = 'medium';
    return { duration_seconds: Number(durationSeconds.toFixed(2)), word_count: wordCount, hesitation_count: hesitationCount, words_per_second: Number(wordsPerSecond.toFixed(2)), speaking_style: speakingStyle, pause_level: pauseLevel };
  };

  const getDemoFeedback = (text) => {
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 12) return 'Good start. Try to add one specific example so your answer feels stronger and more complete.';
    if (wordCount > 80) return 'Strong detail. Now make it slightly shorter and more structured so the interviewer can follow it easily.';
    return 'Good answer. To make it stronger, add a clear result or impact at the end.';
  };

  const getFinalDemoSummary = () => `Interview complete.\n\nOverall Score: 7.5/10\n\nStrengths:\n- Good technical clarity\n- Relevant project experience\n- Clear interest in learning and growth\n\nImprovements:\n- Use more structured answers with STAR\n- Add measurable impact where possible\n- Keep longer answers more concise\n\nFocus next:\nPractice 2 to 3 answers using Situation, Task, Action, and Result.`;

  const startInterviewDemo = () => {
    stopAISpeaking(false); setDemoMode(true); setDemoStep(0); setSelectedMode('interview_coach'); setBehaviorContext('Interview demo started. AI will ask questions, evaluate answers, and give structured feedback.');
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) wsRef.current.send(JSON.stringify({ command:'set_mode', mode:'interview_coach', session_id:sessionIdRef.current }));
    const intro = 'Mock interview started. I’ll simulate a real interview, evaluate your answers, and give structured feedback.';
    const firstQuestion = demoQuestions[0];
    setMessages((prev) => [...prev, { sender:'AI', text:intro }, { sender:'AI', text:firstQuestion }]);
    speakText(`${intro} ${firstQuestion}`);
  };

  const stopInterviewDemo = () => { setDemoMode(false); setDemoStep(0); setBehaviorContext('Interview demo stopped.'); stopAISpeaking(false); setMessages((prev)=>[...prev,{sender:'AI', text:'Mock interview stopped. You can continue normal conversation now.'}]); };

  const handleDemoFlow = (userText) => {
    const feedback = getDemoFeedback(userText);
    const starTip = 'Tip: Try structuring this using STAR: Situation, Task, Action, and Result.';
    const nextStep = demoStep + 1;
    setMessages((prev)=>[...prev,{sender:'AI',text:feedback},{sender:'AI',text:starTip}]);
    if (nextStep < demoQuestions.length) {
      const nextQuestion = demoQuestions[nextStep]; setDemoStep(nextStep);
      setTimeout(()=>{ setMessages((prev)=>[...prev,{sender:'AI',text:nextQuestion}]); speakText(`${feedback} ${starTip} ${nextQuestion}`); }, 650);
    } else {
      const summary = getFinalDemoSummary(); setDemoMode(false); setDemoStep(0); setBehaviorContext('Interview demo completed. Final feedback summary and score generated.');
      setTimeout(()=>{ setMessages((prev)=>[...prev,{sender:'AI',text:summary}]); speakText(`${feedback} ${summary}`); }, 650);
    }
  };

  const copyToClipboard = async (text) => { try { await navigator.clipboard.writeText(text); } catch { const t=document.createElement('textarea'); t.value=text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); } };

  const sendPayload = (text, behavior = {}, inputMode = 'text') => {
    if (!text.trim()) return;
    if (demoMode) { setMessages((prev)=>[...prev,{sender:'You',text}]); setLastBehavior(behavior); handleDemoFlow(text); return; }
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) { alert('WebSocket is not connected yet.'); return; }
    setMessages((prev)=>[...prev,{sender:'You',text}]); setAiState('thinking'); notifyFrontendState('thinking');
    wsRef.current.send(JSON.stringify({ text, behavior, input_mode: inputMode, session_id: sessionIdRef.current }));
  };

  const sendMessage = () => {
    const text = input.trim(); if (!text) return;
    const behavior = { duration_seconds:0, word_count:text.split(/\s+/).filter(Boolean).length, hesitation_count:countHesitations(text), words_per_second:0, speaking_style:'normal', pause_level:'low' };
    setLastBehavior(behavior); sendPayload(text, behavior, 'text'); setInput('');
  };
  const sendPromptMessage = (text) => { const behavior = { duration_seconds:0, word_count:text.split(/\s+/).filter(Boolean).length, hesitation_count:countHesitations(text), words_per_second:0, speaking_style:'normal', pause_level:'low' }; setLastBehavior(behavior); sendPayload(text, behavior, 'text'); };

  const sendCommand = (command) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    stopAISpeaking(false);
    if (command === 'clear_chat' || command === 'reset_all') { setDemoMode(false); setDemoStep(0); }
    wsRef.current.send(JSON.stringify({ command, session_id: sessionIdRef.current }));
    if (command === 'clear_chat') { setMessages([]); updateSession(activeLocalSessionId, { messages: [], title: 'New Session' }); setSessions(getSessions()); }
    if (command === 'reset_all') { setLastBehavior(null); setAiState('idle'); setLiveTranscript(''); finalTranscriptRef.current=''; clearSilenceTools(); setEmotionState({user_emotion:'neutral', ai_mode:'balanced', emotion_reason:'No strong emotional signal detected yet.'}); }
  };

  const startSilenceTimer = () => {
    clearSilenceTools(); let remaining = 2; setSilenceCountdown(remaining);
    silenceCountdownIntervalRef.current = setInterval(()=>{ remaining -= 1; if (remaining <= 0) { clearInterval(silenceCountdownIntervalRef.current); silenceCountdownIntervalRef.current = null; setSilenceCountdown(null); } else setSilenceCountdown(remaining); }, 1000);
    silenceTimerRef.current = setTimeout(()=>stopListeningAndSend(), 2000);
  };

  const stopListeningAndSend = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    clearSilenceTools(); setIsListening(false);
    const transcript = finalTranscriptRef.current.trim(); setLiveTranscript('');
    if (!transcript) { setAiState('idle'); notifyFrontendState('idle'); return; }
    const endTime = Date.now(); const startTime = speechStartTimeRef.current || endTime; const durationSeconds = (endTime - startTime) / 1000;
    const behavior = analyzeSpeechBehavior(transcript, durationSeconds); setLastBehavior(behavior); sendPayload(transcript, behavior, 'voice'); finalTranscriptRef.current = '';
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Speech Recognition is not supported in this browser.'); return; }
    if (isAISpeaking) stopAISpeaking(true);
    clearSilenceTools(); finalTranscriptRef.current = ''; setLiveTranscript('');
    const recognition = new SpeechRecognition(); recognition.lang='en-US'; recognition.interimResults=true; recognition.continuous=true; recognitionRef.current = recognition;
    recognition.onstart = () => { setIsListening(true); setAiState('listening'); notifyFrontendState('listening'); speechStartTimeRef.current = Date.now(); };
    recognition.onresult = (event) => { let transcriptText=''; for (let i=event.resultIndex; i<event.results.length; i+=1) transcriptText += event.results[i][0].transcript; finalTranscriptRef.current = transcriptText.trim(); setLiveTranscript(transcriptText.trim()); if (transcriptText.trim()) startSilenceTimer(); };
    recognition.onend = () => { clearSilenceTools(); setIsListening(false); if (finalTranscriptRef.current.trim() && aiState !== 'thinking') { stopListeningAndSend(); return; } if (!isAISpeaking) { setAiState('idle'); notifyFrontendState('idle'); } };
    recognition.onerror = () => { clearSilenceTools(); setIsListening(false); setLiveTranscript(''); if (!isAISpeaking) { setAiState('idle'); notifyFrontendState('idle'); } };
    recognition.start();
  };

  const stopListening = () => { if (recognitionRef.current) recognitionRef.current.stop(); clearSilenceTools(); setIsListening(false); setLiveTranscript(''); if (!isAISpeaking) { setAiState('idle'); notifyFrontendState('idle'); } };
  const handleVoiceClick = () => { if (isListening) stopListening(); else startListening(); };
  const handleSettingsSaved = (next) => { setSettings(saveSettings(next)); };

  let orbState = 'idle';
  if (isListening) orbState = 'listening'; else if (isAISpeaking) orbState = 'speaking'; else if (aiState === 'thinking') orbState = 'thinking'; else if (aiState === 'error') orbState = 'error';
  const currentMode = modeConfig[selectedMode] || modeConfig.interview_coach;

  return <div style={styles.page}><div style={styles.glowOne}/><div style={styles.glowTwo}/><div style={styles.gridBg}/><SessionHeader status={status} onOpenInsights={()=>setInsightsOpen(true)} onOpenSettings={()=>setSettingsOpen(true)} /><SessionLayout selectedMode={selectedMode} onModeChange={sendModeChange} sessions={sessions} activeSessionId={activeLocalSessionId} onNewSession={handleNewSession} onSelectSession={handleSelectSession} onDeleteSession={handleDeleteSession} onRenameSession={handleRenameSession} onToggleFavorite={handleToggleFavorite} orbState={orbState} demoMode={demoMode} demoStep={demoStep} demoQuestionsLength={demoQuestions.length} currentMode={currentMode} messages={messages} liveTranscript={liveTranscript} isListening={isListening} aiState={aiState} onCopy={copyToClipboard} messagesAreaRef={messagesAreaRef} input={input} setInput={setInput} onSend={sendMessage} onVoiceClick={handleVoiceClick} onStartDemo={startInterviewDemo} onStopDemo={stopInterviewDemo} onStopVoice={()=>stopAISpeaking(false)} onClearChat={()=>sendCommand('clear_chat')} silenceCountdown={silenceCountdown} onPromptClick={sendPromptMessage} onExportText={()=>exportAsText(messages)} onExportMarkdown={()=>exportAsMarkdown(messages)} onExportJson={()=>exportAsJson(messages)} onCopyConversation={()=>copyConversation(messages)} showCareerTools={settings.showCareerTools} /><InsightsDrawer open={insightsOpen} onClose={()=>setInsightsOpen(false)} emotionState={emotionState} lastBehavior={lastBehavior} memory={memory} behaviorContext={behaviorContext} stats={stats} /><SettingsDrawer open={settingsOpen} onClose={()=>setSettingsOpen(false)} onSaved={handleSettingsSaved} /></div>;
}

const styles = {
  page: { position:'fixed', inset:0, width:'100vw', height:'100vh', overflow:'hidden', background:'linear-gradient(135deg,#09090b 0%,#0b0f0b 45%,#111318 100%)', color:colors.text, fontFamily:'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' },
  glowOne: { position:'absolute', top:-160, left:-120, width:520, height:520, borderRadius:'50%', background:'rgba(132,204,22,.25)', filter:'blur(130px)' },
  glowTwo: { position:'absolute', right:-160, bottom:-170, width:540, height:540, borderRadius:'50%', background:'rgba(163,230,53,.18)', filter:'blur(130px)' },
  gridBg: { position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(148,163,184,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.04) 1px, transparent 1px)', backgroundSize:'48px 48px', maskImage:'linear-gradient(to bottom, black, transparent 90%)' },
};
