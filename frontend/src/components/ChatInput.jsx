import React, { useEffect, useRef } from 'react';
import VoiceButton from './VoiceButton';

export default function ChatInput({ input, setInput, onSend, onVoiceClick, isListening, placeholder = 'Type your message...' }) {
  const textareaRef = useRef(null);
  useEffect(() => { const t = textareaRef.current; if (!t) return; t.style.height = 'auto'; t.style.height = `${Math.min(t.scrollHeight, 140)}px`; }, [input]);
  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } };
  return (
    <div style={styles.wrap}>
      <VoiceButton isListening={isListening} onClick={onVoiceClick} />
      <div style={styles.inputShell}>
        <textarea ref={textareaRef} value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder} rows={1} style={styles.textarea} />
        <div style={styles.hint}>Enter to send · Shift + Enter for new line</div>
      </div>
      <button onClick={onSend} style={styles.sendButton}>➤</button>
    </div>
  );
}
const styles = {
  wrap:{display:'flex',alignItems:'flex-end',gap:12,padding:14,borderTop:'1px solid rgba(148,163,184,.14)',background:'rgba(2,6,23,.62)'},
  inputShell:{flex:1,minWidth:0,borderRadius:20,border:'1px solid rgba(148,163,184,.18)',background:'rgba(15,23,42,.88)',padding:'11px 14px 8px'},
  textarea:{width:'100%',maxHeight:140,resize:'none',border:'none',outline:'none',background:'transparent',color:'#fff',fontSize:14,lineHeight:1.6,fontFamily:'inherit'},
  hint:{marginTop:4,fontSize:11,color:'#64748b'},
  sendButton:{width:58,height:58,borderRadius:'50%',border:'none',background:'linear-gradient(135deg,#84cc16,#bef264)',color:'#fff',fontSize:22,fontWeight:950,cursor:'pointer',boxShadow:'0 0 32px rgba(163,230,53,.35)',flexShrink:0},
};
