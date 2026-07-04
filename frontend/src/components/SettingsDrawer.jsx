import React, { useEffect, useState } from 'react';
import { getSettings, saveSettings } from '../services/storage';

export default function SettingsDrawer({ open, onClose, onSaved }) {
  const [settings, setSettings] = useState(getSettings());
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis?.getVoices?.() || []);
    loadVoices();
    if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  if (!open) return null;

  const update = (patch) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(next);
    if (onSaved) onSaved(next);
  };

  return (
    <div onClick={onClose} style={styles.backdrop}>
      <aside onClick={(e) => e.stopPropagation()} style={styles.drawer}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Settings</h2>
            <p style={styles.subtitle}>Voice, interface and developer preferences.</p>
          </div>
          <button onClick={onClose} style={styles.close}>×</button>
        </div>

        <Section title="Voice">
          <label style={styles.row}>Auto speak<input type="checkbox" checked={settings.autoSpeak} onChange={(e) => update({ autoSpeak: e.target.checked })} /></label>
          <label style={styles.label}>Voice Rate: {settings.voiceRate}<input type="range" min="0.5" max="1.8" step="0.1" value={settings.voiceRate} onChange={(e) => update({ voiceRate: Number(e.target.value) })} /></label>
          <label style={styles.label}>Pitch: {settings.voicePitch}<input type="range" min="0.5" max="1.8" step="0.1" value={settings.voicePitch} onChange={(e) => update({ voicePitch: Number(e.target.value) })} /></label>
          <select value={settings.voiceName} onChange={(e) => update({ voiceName: e.target.value })} style={styles.select}>
            <option value="">Default browser voice</option>
            {voices.map((voice) => <option key={voice.name} value={voice.name}>{voice.name}</option>)}
          </select>
        </Section>

        <Section title="Interface">
          <label style={styles.row}>Compact mode<input type="checkbox" checked={settings.compactMode} onChange={(e) => update({ compactMode: e.target.checked })} /></label>
          <label style={styles.row}>Show career tools<input type="checkbox" checked={settings.showCareerTools} onChange={(e) => update({ showCareerTools: e.target.checked })} /></label>
        </Section>

        <Section title="Developer">
          <label style={styles.label}>Backend WebSocket URL<input value={settings.backendUrl} onChange={(e) => update({ backendUrl: e.target.value })} style={styles.input} /></label>
        </Section>
      </aside>
    </div>
  );
}

function Section({ title, children }) {
  return <div style={styles.section}><h3 style={styles.sectionTitle}>{title}</h3>{children}</div>;
}

const styles = {
  backdrop: { position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(2,6,23,.65)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'flex-end' },
  drawer: { width: 430, maxWidth: '92vw', height: '100%', overflowY: 'auto', background: 'rgba(2,6,23,.96)', borderLeft: '1px solid rgba(148,163,184,.18)', boxShadow: '-24px 0 80px rgba(0,0,0,.5)', padding: 20, color: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { margin: 0, fontSize: 26, fontWeight: 950, letterSpacing: '-.05em' },
  subtitle: { marginTop: 5, color: '#94a3b8', fontSize: 13 },
  close: { border: '1px solid rgba(255,255,255,.14)', background: 'rgba(255,255,255,.08)', color: '#fff', borderRadius: '50%', width: 38, height: 38, cursor: 'pointer', fontSize: 22 },
  section: { marginTop: 16, padding: 16, borderRadius: 18, background: 'rgba(255,255,255,.055)', border: '1px solid rgba(148,163,184,.14)' },
  sectionTitle: { margin: '0 0 10px', fontSize: 15 },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0', color: '#cbd5e1' },
  label: { display: 'grid', gap: 8, margin: '12px 0', color: '#cbd5e1', fontSize: 13 },
  input: { height: 40, borderRadius: 12, border: '1px solid rgba(148,163,184,.18)', background: 'rgba(15,23,42,.8)', color: '#fff', padding: '0 10px' },
  select: { width: '100%', height: 42, borderRadius: 12, border: '1px solid rgba(148,163,184,.18)', background: 'rgba(15,23,42,.8)', color: '#fff', padding: '0 10px' },
};
