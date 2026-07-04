import React from 'react';
import { colors } from '../styles/theme';

export default function VoiceButton({ isListening, onClick }) {
  return (
    <>
      <style>{`@keyframes micRipple{0%{transform:scale(.8);opacity:.65}100%{transform:scale(1.9);opacity:0}}`}</style>
      <button onClick={onClick} style={{...styles.button, border: isListening ? '1px solid rgba(163,230,53,.55)' : '1px solid rgba(190,242,100,.35)', background: isListening ? `linear-gradient(135deg, ${colors.green}, #65a30d)` : `linear-gradient(135deg, ${colors.blue}, #84cc16)`, boxShadow: isListening ? '0 0 35px rgba(163,230,53,.45)' : '0 0 30px rgba(163,230,53,.32)'}} title={isListening ? 'Stop listening' : 'Start voice'}>
        {isListening && <span style={styles.ripple} />}
        <span style={{ position: 'relative', zIndex: 2 }}>{isListening ? '●' : '🎤'}</span>
      </button>
    </>
  );
}
const styles = {
  button: { position:'relative', width:58, height:58, borderRadius:'50%', color:'#fff', fontSize:22, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  ripple: { position:'absolute', inset:0, borderRadius:'50%', border:'1px solid rgba(163,230,53,.8)', animation:'micRipple 1.4s ease-out infinite' },
};
