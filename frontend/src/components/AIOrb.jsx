import React from 'react';
import { colors } from '../styles/theme';

export default function AIOrb({ state = 'idle', size = 180 }) {
  const config = {
    idle: { label: 'Ready', color: colors.blue, glow: 'rgba(163,230,53,.62)', speed: '3s' },
    listening: { label: 'Listening', color: colors.green, glow: 'rgba(163,230,53,.75)', speed: '1.15s' },
    thinking: { label: 'Thinking', color: colors.amber, glow: 'rgba(245,158,11,.75)', speed: '1.45s' },
    speaking: { label: 'Speaking', color: colors.purple, glow: 'rgba(163,230,53,.82)', speed: '.82s' },
    error: { label: 'Error', color: colors.red, glow: 'rgba(239,68,68,.72)', speed: '1.1s' },
  };
  const current = config[state] || config.idle;
  return (
    <>
      <style>{`
        @keyframes orbPulse{0%{transform:scale(.9);opacity:.52}50%{transform:scale(1.1);opacity:1}100%{transform:scale(.9);opacity:.52}}
        @keyframes rotateRing{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes floatOrb{0%{transform:translateY(0)}50%{transform:translateY(-9px)}100%{transform:translateY(0)}}
        @keyframes speakingBars{0%{height:8px;opacity:.55}50%{height:34px;opacity:1}100%{height:8px;opacity:.55}}
        @keyframes particleMove{0%{transform:rotate(0deg) translateX(72px) rotate(0deg)}100%{transform:rotate(360deg) translateX(72px) rotate(-360deg)}}
      `}</style>
      <div style={styles.shell}>
        <div style={{ width: size, height: size, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {[0, 1, 2, 3].map((i) => <span key={i} style={{ ...styles.particle, background: current.color, animationDelay: `${i * .8}s` }} />)}
          <div style={{ ...styles.outerPulse, width: size, height: size, borderColor: current.glow, animation: `orbPulse ${current.speed} ease-in-out infinite`, boxShadow: `0 0 85px ${current.glow}` }} />
          <div style={{ ...styles.ring, width: size - 34, height: size - 34, borderTopColor: current.color, borderLeftColor: 'rgba(255,255,255,.05)', animation: 'rotateRing 8s linear infinite' }} />
          <div style={{ ...styles.ringTwo, width: size - 68, height: size - 68, borderBottomColor: current.color, animation: 'rotateRing 12s linear infinite reverse' }} />
          <div style={{ ...styles.core, width: size / 2.25, height: size / 2.25, background: `radial-gradient(circle at 35% 30%, white 0%, ${current.color} 26%, #365314 68%, #09090b 100%)`, boxShadow: `0 0 65px ${current.glow}`, animation: 'floatOrb 3s ease-in-out infinite' }} />
          {state === 'speaking' && <div style={styles.waveRow}>{[1,2,3,4,5,6].map((i)=><div key={i} style={{...styles.waveBar,background:current.color,animationDelay:`${i*.08}s`}} />)}</div>}
        </div>
        <div style={styles.label}>{current.label}</div>
      </div>
    </>
  );
}

const styles = {
  shell: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  outerPulse: { position: 'absolute', borderRadius: '50%', border: '2px solid' },
  ring: { position: 'absolute', borderRadius: '50%', border: '2px solid transparent' },
  ringTwo: { position: 'absolute', borderRadius: '50%', border: '1px solid transparent' },
  core: { borderRadius: '50%', zIndex: 2 },
  particle: { position: 'absolute', width: 7, height: 7, borderRadius: '50%', opacity: .85, animation: 'particleMove 4.2s linear infinite' },
  waveRow: { position: 'absolute', bottom: 8, display: 'flex', gap: 5, alignItems: 'center', zIndex: 4 },
  waveBar: { width: 5, borderRadius: 999, animation: 'speakingBars .75s ease-in-out infinite' },
  label: { marginTop: 14, color: '#ecfccb', fontWeight: 900, letterSpacing: 2.2, fontSize: 12, textTransform: 'uppercase' },
};
