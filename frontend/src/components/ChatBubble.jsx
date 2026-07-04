import React from 'react';
import { renderMarkdown } from '../utils/markdown';
import { colors, shadow } from '../styles/theme';

export default function ChatBubble({ sender, text, onCopy }) {
  const isUser = sender === 'You';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 18 }}>
      <div style={{ width: isUser ? 'min(680px, 78%)' : 'min(840px, 88%)', display:'flex', gap:12, justifyContent:isUser?'flex-end':'flex-start', flexDirection:isUser?'row-reverse':'row' }}>
        <div style={{ ...styles.avatar, background: isUser ? 'linear-gradient(135deg,#84cc16,#bef264)' : 'radial-gradient(circle at 35% 30%,#bef264,#84cc16 55%,#365314)' }}>{isUser ? 'Y' : 'AI'}</div>
        <div style={{ ...styles.card, ...(isUser ? styles.userCard : styles.aiCard) }}>
          <div style={styles.metaRow}><div style={styles.sender}>{isUser ? 'You' : 'AI Presence'}</div><div style={styles.time}>{getTime()}</div></div>
          <div style={styles.messageText}>{renderMarkdown(text)}</div>
          {!isUser && onCopy && <div style={styles.actions}><button onClick={() => onCopy(text)} style={styles.copyButton}>Copy</button></div>}
        </div>
      </div>
    </div>
  );
}
function getTime(){return new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});}
const styles = {
  avatar: { width:38, height:38, borderRadius:14, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:950, flexShrink:0, boxShadow:shadow.blue },
  card: { flex:1, padding:'15px 16px', boxShadow:shadow.soft, animation:'messageIn .25s ease both' },
  aiCard: { borderRadius:'20px 20px 20px 6px', background:'linear-gradient(135deg,rgba(15,23,42,.92),rgba(15,23,42,.72))', border:`1px solid ${colors.border}`, color:colors.text },
  userCard: { borderRadius:'20px 20px 6px 20px', background:'linear-gradient(135deg,#65a30d,#a3e635)', border:'1px solid rgba(190,242,100,.35)', color:'#fff' },
  metaRow: { display:'flex', justifyContent:'space-between', gap:12, alignItems:'center', marginBottom:8 },
  sender: { fontSize:12, fontWeight:950, color:'#fff' },
  time: { fontSize:11, color:'rgba(226,232,240,.65)', flexShrink:0 },
  messageText: { fontSize:14, lineHeight:1.7, whiteSpace:'pre-wrap' },
  actions: { marginTop:10, display:'flex', gap:8 },
  copyButton: { border:'1px solid rgba(255,255,255,.12)', background:'rgba(255,255,255,.07)', color:'#cbd5e1', borderRadius:999, padding:'6px 10px', fontSize:11, fontWeight:850, cursor:'pointer' },
};
