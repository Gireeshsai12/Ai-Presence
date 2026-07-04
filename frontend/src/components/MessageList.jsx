import React from 'react';
import ChatBubble from './ChatBubble';
import AIOrb from './AIOrb';

export default function MessageList({ messages, liveTranscript, isListening, aiState, demoMode, onCopy, messagesAreaRef, onPromptClick }) {
  const hasMessages = messages.length > 0;
  return (
    <div ref={messagesAreaRef} style={styles.wrap}>
      <style>{`
        @keyframes messageIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes dotPulse{0%,100%{transform:translateY(0);opacity:.35}50%{transform:translateY(-5px);opacity:1}}
      `}</style>
      {!hasMessages && aiState !== 'thinking' && !isListening ? (
        <div style={styles.emptyWrap}>
          <AIOrb state="idle" size={150} />
          <h1 style={styles.title}>Start your AI Presence session</h1>
          <p style={styles.subtitle}>Speak naturally or type a message. Your assistant adapts to the mode, remembers useful details, and responds with voice.</p>
          <div style={styles.promptGrid}>
            <PromptCard title="Interview" text="Practice tell me about yourself." onClick={() => onPromptClick('Practice tell me about yourself.')} />
            <PromptCard title="Resume" text="Review my resume like an ATS." onClick={() => onPromptClick('Act as a resume reviewer. Tell me what resume information you need and how you will score it.')} />
            <PromptCard title="JD Match" text="Analyze a job description." onClick={() => onPromptClick('Act as a job description analyzer. Ask me to paste a JD and then evaluate fit, missing skills, and keywords.')} />
            <PromptCard title="STAR" text="Evaluate my behavioral answer." onClick={() => onPromptClick('Act as a STAR answer evaluator. Ask me for the interview question and my answer.')} />
          </div>
        </div>
      ) : (
        <div style={styles.messagesInner}>
          {messages.map((msg, index) => <ChatBubble key={`${msg.sender}-${index}`} sender={msg.sender} text={msg.text} onCopy={onCopy} />)}
          {isListening && liveTranscript && <ChatBubble sender="You" text={liveTranscript} />}
          {aiState === 'thinking' && !demoMode && <TypingIndicator />}
        </div>
      )}
    </div>
  );
}
function TypingIndicator(){return <div style={styles.typingRow}><div style={styles.typingAvatar}>AI</div><div style={styles.typingCard}><span>Thinking</span><span style={styles.dots}>{[0,1,2].map((i)=><span key={i} style={{...styles.dot,animationDelay:`${i*.15}s`}} />)}</span></div></div>;}
function PromptCard({title,text,onClick}){return <button onClick={onClick} style={styles.promptCard}><div style={styles.promptTitle}>{title}</div><div style={styles.promptText}>{text}</div></button>;}
const styles = {
  wrap:{flex:1,minHeight:0,overflowY:'auto',padding:22,background:'radial-gradient(circle at top left, rgba(163,230,53,.10), transparent 30%), radial-gradient(circle at bottom right, rgba(163,230,53,.08), transparent 30%)'},
  messagesInner:{maxWidth:1160,margin:'0 auto',width:'100%'},
  emptyWrap:{minHeight:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',textAlign:'center',color:'#94a3b8',padding:'30px 20px'},
  title:{margin:'24px 0 0',fontSize:40,fontWeight:950,letterSpacing:'-.07em',color:'#fff'},
  subtitle:{margin:'14px auto 0',maxWidth:640,fontSize:15,lineHeight:1.8,color:'#a7b4c8'},
  promptGrid:{marginTop:28,width:'100%',maxWidth:820,display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:12},
  promptCard:{textAlign:'left',borderRadius:18,padding:14,background:'rgba(15,23,42,.72)',border:'1px solid rgba(148,163,184,.14)',boxShadow:'0 14px 32px rgba(0,0,0,.18)',cursor:'pointer',color:'inherit'},
  promptTitle:{color:'#fff',fontSize:13,fontWeight:900,marginBottom:6},
  promptText:{color:'#94a3b8',fontSize:12,lineHeight:1.5},
  typingRow:{display:'flex',alignItems:'center',gap:12,marginBottom:18},
  typingAvatar:{width:38,height:38,borderRadius:14,background:'linear-gradient(135deg,#84cc16,#a3e635)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:950},
  typingCard:{padding:'14px 16px',borderRadius:18,background:'rgba(15,23,42,.82)',border:'1px solid rgba(148,163,184,.14)',color:'#cbd5e1',display:'flex',alignItems:'center',gap:10},
  dots:{display:'flex',gap:5},
  dot:{width:6,height:6,borderRadius:'50%',background:'#bef264',animation:'dotPulse .9s ease-in-out infinite'},
};
