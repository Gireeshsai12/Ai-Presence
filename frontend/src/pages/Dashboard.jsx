import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../services/analyticsApi";
import { logout } from "../services/authService";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardStats().then(setStats).catch((err) => setError(err.message || "Unable to load dashboard"));
  }, []);

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <nav style={styles.nav}>
          <div><div style={styles.logo}>AI Presence</div><div style={styles.sub}>Career intelligence dashboard</div></div>
          <div style={styles.actions}><Link to="/session/interview_coach" style={styles.primary}>Launch Coach</Link><button onClick={logout} style={styles.logout}>Logout</button></div>
        </nav>
        <section style={styles.hero}><div style={styles.badge}>Progress Hub</div><h1 style={styles.h1}>Your AI career dashboard.</h1><p style={styles.p}>Track sessions, resume readiness, memory, and recommended next steps.</p></section>
        {error && <div style={styles.error}>{error}</div>}
        <section style={styles.grid}>
          <Stat title="Sessions" value={stats?.total_sessions ?? "—"} />
          <Stat title="Messages" value={stats?.total_messages ?? "—"} />
          <Stat title="Memory Items" value={stats?.memory_items ?? "—"} />
          <Stat title="Resume Skills" value={stats?.resume_skill_count ?? "—"} />
        </section>
        <section style={styles.twoCol}>
          <Panel title="Mode Usage">{Object.entries(stats?.mode_usage || {}).map(([k,v]) => <div key={k} style={styles.row}><span>{k.replaceAll("_"," ")}</span><strong>{v}</strong></div>)}</Panel>
          <Panel title="Next Steps">{(stats?.recommended_next_steps || []).map((s) => <div key={s} style={styles.step}>✓ {s}</div>)}</Panel>
        </section>
      </main>
    </div>
  );
}

function Stat({ title, value }) { return <div style={styles.card}><div style={styles.cardTitle}>{title}</div><div style={styles.cardValue}>{value}</div></div>; }
function Panel({ title, children }) { return <div style={styles.panel}><h2>{title}</h2><div style={styles.list}>{children}</div></div>; }

const styles = {
  page:{minHeight:"100vh",background:"linear-gradient(135deg,#09090b 0%,#0b0f0b 45%,#111318 100%)",color:"#fff",fontFamily:"Inter,system-ui,sans-serif"},
  main:{maxWidth:1180,margin:"0 auto",padding:"28px 20px 70px"},
  nav:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16},
  logo:{fontWeight:950,fontSize:24,letterSpacing:"-.05em"},sub:{color:"#94a3b8",fontSize:13,marginTop:4},actions:{display:"flex",gap:10},
  primary:{textDecoration:"none",borderRadius:999,padding:"11px 15px",background:"linear-gradient(135deg,#84cc16,#bef264)",color:"#10210a",fontWeight:950},
  logout:{border:"1px solid rgba(239,68,68,.24)",borderRadius:999,padding:"11px 15px",background:"rgba(239,68,68,.1)",color:"#fecaca",fontWeight:900,cursor:"pointer"},
  hero:{padding:"68px 0 32px",maxWidth:760},badge:{display:"inline-flex",border:"1px solid rgba(190,242,100,.25)",background:"rgba(163,230,53,.12)",color:"#d9f99d",borderRadius:999,padding:"8px 12px",fontWeight:900,fontSize:13},
  h1:{fontSize:54,lineHeight:1.03,letterSpacing:"-.08em",margin:"22px 0 0"},p:{color:"#a7b4c8",fontSize:18,lineHeight:1.65},
  grid:{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:14,marginBottom:14},card:{borderRadius:24,padding:22,background:"rgba(15,23,42,.72)",border:"1px solid rgba(163,230,53,.16)"},
  cardTitle:{color:"#94a3b8",fontSize:13,fontWeight:900},cardValue:{marginTop:10,color:"#d9f99d",fontSize:38,fontWeight:950},
  twoCol:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14},panel:{borderRadius:24,padding:22,background:"rgba(17,19,24,.82)",border:"1px solid rgba(163,230,53,.16)"},
  list:{display:"grid",gap:10},row:{display:"flex",justifyContent:"space-between",padding:12,borderRadius:14,background:"rgba(255,255,255,.05)",textTransform:"capitalize"},
  step:{padding:12,borderRadius:14,background:"rgba(163,230,53,.08)",color:"#d9f99d",fontWeight:850},error:{border:"1px solid rgba(239,68,68,.3)",background:"rgba(239,68,68,.1)",color:"#fecaca",borderRadius:18,padding:14,marginBottom:14}
};
