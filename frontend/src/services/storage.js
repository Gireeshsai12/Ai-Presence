const STORAGE_KEYS = {
  sessions: 'ai_presence_sessions',
  activeSessionId: 'ai_presence_active_session_id',
  settings: 'ai_presence_settings',
};

export const defaultSettings = {
  autoSpeak: true,
  voiceRate: 1,
  voicePitch: 1,
  voiceName: '',
  compactMode: false,
  showCareerTools: true,
  backendUrl: 'ws://127.0.0.1:8000/ws',
};

export function getSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings) {
  const next = { ...defaultSettings, ...settings };
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(next));
  return next;
}

export function createSession(mode = 'interview_coach') {
  const session = {
    id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: 'New Session',
    mode,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorite: false,
  };
  const sessions = getSessions();
  localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify([session, ...sessions]));
  localStorage.setItem(STORAGE_KEYS.activeSessionId, session.id);
  return session;
}

export function getSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.sessions)) || [];
  } catch {
    return [];
  }
}

export function getActiveSessionId() {
  return localStorage.getItem(STORAGE_KEYS.activeSessionId);
}

export function setActiveSessionId(sessionId) {
  localStorage.setItem(STORAGE_KEYS.activeSessionId, sessionId);
}

export function updateSession(sessionId, updates) {
  const sessions = getSessions();
  const updated = sessions.map((session) =>
    session.id === sessionId
      ? { ...session, ...updates, updatedAt: new Date().toISOString() }
      : session
  );
  localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(updated));
  return updated.find((session) => session.id === sessionId);
}

export function renameSession(sessionId, title) {
  return updateSession(sessionId, { title: title?.trim() || 'Untitled Session' });
}

export function toggleFavoriteSession(sessionId) {
  const sessions = getSessions();
  const updated = sessions.map((session) =>
    session.id === sessionId
      ? { ...session, favorite: !session.favorite, updatedAt: new Date().toISOString() }
      : session
  );
  localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(updated));
  return updated;
}

export function deleteSession(sessionId) {
  const sessions = getSessions().filter((session) => session.id !== sessionId);
  localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions));
  if (getActiveSessionId() === sessionId) {
    if (sessions.length > 0) setActiveSessionId(sessions[0].id);
    else localStorage.removeItem(STORAGE_KEYS.activeSessionId);
  }
  return sessions;
}

export function generateSessionTitle(messages = []) {
  const firstUserMessage = messages.find((msg) => msg.sender === 'You');
  if (!firstUserMessage?.text) return 'New Session';
  const cleaned = firstUserMessage.text.trim().replace(/\s+/g, ' ');
  return cleaned.length > 42 ? `${cleaned.slice(0, 42)}...` : cleaned;
}
