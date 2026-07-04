import React from 'react';
import AIOrb from './AIOrb';
import { glass } from '../styles/theme';

export default function OrbPanel({ orbState, demoMode, demoStep, demoQuestionsLength }) {
  return <div style={styles.card}><AIOrb state={orbState} size={176} /><div style={styles.caption}>{demoMode && `Interview demo: Question ${demoStep + 1}/${demoQuestionsLength}`}{!demoMode && orbState === 'listening' && 'Listening to your voice...'}{!demoMode && orbState === 'thinking' && 'Thinking before responding...'}{!demoMode && orbState === 'speaking' && 'Speaking now...'}{!demoMode && orbState === 'idle' && 'Ready for your next message.'}</div></div>;
}
const styles = { card:{...glass,borderRadius:26,padding:18,display:'flex',flexDirection:'column',alignItems:'center'}, caption:{marginTop:12,color:'#d9f99d',fontSize:13,textAlign:'center',lineHeight:1.6} };
