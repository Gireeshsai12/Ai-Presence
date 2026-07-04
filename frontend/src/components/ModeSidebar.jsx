import React, { useMemo, useState } from 'react';
import { colors, glass } from '../styles/theme';

const modes = {
  interview_coach: { label: 'Interview', description: 'Mock interviews and answer coaching', color: colors.blue, icon: '🎯' },
  resume_reviewer: { label: 'Resume', description: 'Resume and ATS feedback', color: colors.purple, icon: '📄' },
  jd_analyzer: { label: 'JD Match', description: 'Job description fit analysis', color: colors.green, icon: '💼' },
  star_evaluator: { label: 'STAR', description: 'Behavioral answer evaluator', color: colors.amber, icon: '⭐' },
  communication_coach: { label: 'Communication', description: 'Confidence and speaking coach', color: colors.blue2, icon: '🎤' },
  coding_interview: { label: 'Coding', description: 'Coding interview practice', color: colors.red, icon: '💻' },
};

export default function ModeSidebar({ selectedMode, onModeChange, sessions = [], activeSessionId, onNewSession, onSelectSession, onDeleteSession, onRenameSession, onToggleFavorite }) {
  const [query, setQuery] = useState('');
  const filteredSessions = useMemo(() => { const q = query.trim().toLowerCase(); return sessions.filter((s) => !q || s.title.toLowerCase().includes(q)); }, [sessions, query]);
  const favoriteSessions = filteredSessions.filter((s) => s.favorite);
  const normalSessions = filteredSessions.filter((s) => !s.favorite);
  return <aside style={styles.sidebar}>
    <button onClick={onNewSession} style={styles.newButton}>+ New Session</button>
    <SectionTitle>Career Modes</SectionTitle>
    <div style={styles.modeList}>{Object.entries(modes).map(([key, mode]) => { const active = selectedMode === key; return <button key={key} onClick={() => onModeChange(key)} style={{...styles.modeButton,borderColor:active?mode.color:'rgba(148,163,184,.14)',background:active?'rgba(163,230,53,.16)':'rgba(255,255,255,.045)'}}><div style={styles.modeTop}><span style={styles.modeLabel}>{mode.icon} {mode.label}</span>{active && <span style={styles.activeDot} />}</div><div style={styles.modeDescription}>{mode.description}</div></button>; })}</div>
    <SectionTitle>Search Sessions</SectionTitle>
    <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search history..." style={styles.searchInput} />
    {favoriteSessions.length > 0 && <><SectionTitle>Favorites</SectionTitle><SessionList sessions={favoriteSessions} activeSessionId={activeSessionId} onSelectSession={onSelectSession} onDeleteSession={onDeleteSession} onRenameSession={onRenameSession} onToggleFavorite={onToggleFavorite} /></>}
    <SectionTitle>Recent Sessions</SectionTitle>
    <SessionList sessions={normalSessions} activeSessionId={activeSessionId} onSelectSession={onSelectSession} onDeleteSession={onDeleteSession} onRenameSession={onRenameSession} onToggleFavorite={onToggleFavorite} />
  </aside>;
}
function SessionList({sessions,activeSessionId,onSelectSession,onDeleteSession,onRenameSession,onToggleFavorite}) {
  if (sessions.length === 0) return <div style={styles.emptyHistory}>No sessions found.</div>;
  return <div style={styles.historyList}>{sessions.slice(0,12).map((session)=>{ const active=session.id===activeSessionId; return <div key={session.id} style={{...styles.historyItem,borderColor:active?'rgba(190,242,100,.55)':'rgba(148,163,184,.12)',background:active?'rgba(163,230,53,.14)':'rgba(255,255,255,.04)'}}><button onClick={()=>onSelectSession(session.id)} style={styles.historyMain}><div style={styles.historyTitle}>{session.title}</div><div style={styles.historyMeta}>{formatSessionTime(session.updatedAt)}</div></button><button onClick={()=>onToggleFavorite(session.id)} style={styles.iconButton}>{session.favorite?'★':'☆'}</button><button onClick={()=>{ const nextTitle = window.prompt('Rename session', session.title); if (nextTitle !== null) onRenameSession(session.id, nextTitle); }} style={styles.iconButton}>✎</button><button onClick={()=>{ if (window.confirm('Delete this session?')) onDeleteSession(session.id); }} style={styles.deleteButton}>×</button></div>;})}</div>;
}
function SectionTitle({children}){return <div style={styles.sectionTitle}>{children}</div>;}
function formatSessionTime(dateString){ if(!dateString)return 'Recently'; return new Date(dateString).toLocaleDateString([], {month:'short', day:'numeric'});}
const styles={
  sidebar:{...glass,borderRadius:28,padding:16,height:'100%',overflowY:'auto'},
  newButton:{width:'100%',border:'none',borderRadius:18,padding:'13px 14px',background:'linear-gradient(135deg,#84cc16,#bef264)',color:'#fff',fontSize:14,fontWeight:950,cursor:'pointer',marginBottom:18},
  sectionTitle:{fontSize:11,color:'#bef264',fontWeight:950,letterSpacing:'.15em',textTransform:'uppercase',margin:'18px 0 10px'},
  searchInput:{width:'100%',height:42,borderRadius:14,border:'1px solid rgba(148,163,184,.16)',background:'rgba(15,23,42,.78)',color:'#fff',outline:'none',padding:'0 12px',fontSize:13},
  modeList:{display:'grid',gap:10},modeButton:{border:'1px solid',borderRadius:18,padding:14,textAlign:'left',cursor:'pointer',color:'#fff'},modeTop:{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10},modeLabel:{fontSize:15,fontWeight:950},activeDot:{width:8,height:8,borderRadius:'50%',background:'#bef264',boxShadow:'0 0 18px rgba(190,242,100,.8)'},modeDescription:{marginTop:5,fontSize:12,lineHeight:1.45,color:'#94a3b8'},
  historyList:{display:'grid',gap:8},historyItem:{display:'flex',alignItems:'center',border:'1px solid',borderRadius:16,overflow:'hidden'},historyMain:{flex:1,minWidth:0,border:'none',background:'transparent',textAlign:'left',padding:'11px 10px',cursor:'pointer'},historyTitle:{color:'#fff',fontSize:13,fontWeight:850,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'},historyMeta:{marginTop:3,color:'#64748b',fontSize:11},iconButton:{width:30,alignSelf:'stretch',border:'none',background:'rgba(255,255,255,.035)',color:'#cbd5e1',cursor:'pointer',fontSize:14},deleteButton:{width:30,alignSelf:'stretch',border:'none',background:'rgba(239,68,68,.08)',color:'#fecaca',cursor:'pointer',fontSize:18},emptyHistory:{fontSize:13,color:'#64748b',padding:'10px 4px'},
};
