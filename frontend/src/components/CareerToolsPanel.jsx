import React, { useEffect, useMemo, useState } from "react";
import {
  analyzeJobDescription,
  evaluateCoding,
  evaluateInterviewAnswer,
  evaluateSTAR,
  reviewResume,
  startInterview,
  uploadResume,
} from "../services/careerApi";
import { apiHealthCheck } from "../services/apiClient";

const tools = [
  { key: "resume_reviewer", title: "Resume Reviewer", icon: "📄", tag: "Resume", description: "Upload or paste your resume and get ATS feedback." },
  { key: "jd_analyzer", title: "JD Analyzer", icon: "💼", tag: "Jobs", description: "Paste a JD and find match score + roadmap." },
  { key: "star_evaluator", title: "STAR Evaluator", icon: "⭐", tag: "Interview", description: "Score behavioral answers using STAR." },
  { key: "interview_engine", title: "Interview Engine", icon: "🎯", tag: "Mock", description: "Generate questions and evaluate answers." },
  { key: "coding_interview", title: "Coding Coach", icon: "💻", tag: "Coding", description: "Evaluate code, edge cases, and complexity." },
  { key: "communication", title: "Communication", icon: "🎤", tag: "Voice", description: "Practice clarity, pace, and confidence in chat." },
];

export default function CareerToolsPanel({ onUseTool }) {
  const [activeKey, setActiveKey] = useState("resume_reviewer");
  const [backendStatus, setBackendStatus] = useState("checking");
  const active = useMemo(() => tools.find((tool) => tool.key === activeKey) || tools[0], [activeKey]);

  useEffect(() => {
    let alive = true;
    apiHealthCheck()
      .then(() => alive && setBackendStatus("connected"))
      .catch(() => alive && setBackendStatus("offline"));
    return () => { alive = false; };
  }, []);

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>Career Tools</div>
          <div style={styles.title}>AI Career Coach</div>
        </div>
        <span style={{
          ...styles.statusPill,
          color: backendStatus === "connected" ? "#d9f99d" : "#fecaca",
          borderColor: backendStatus === "connected" ? "rgba(163,230,53,.35)" : "rgba(239,68,68,.35)",
          background: backendStatus === "connected" ? "rgba(163,230,53,.10)" : "rgba(239,68,68,.10)",
        }}>
          {backendStatus === "connected" ? "Backend Live" : backendStatus === "checking" ? "Checking" : "Backend Offline"}
        </span>
      </div>

      <div style={styles.toolList}>
        {tools.map((tool) => {
          const selected = tool.key === activeKey;
          return (
            <button key={tool.key} onClick={() => setActiveKey(tool.key)} style={{...styles.toolButton, borderColor: selected ? "rgba(190,242,100,.55)" : "rgba(148,163,184,.14)", background: selected ? "rgba(163,230,53,.14)" : "rgba(255,255,255,.045)"}}>
              <div style={styles.toolTop}><span style={styles.icon}>{tool.icon}</span><span style={styles.toolTitle}>{tool.title}</span></div>
              <p style={styles.toolText}>{tool.description}</p>
              <span style={styles.tag}>{tool.tag}</span>
            </button>
          );
        })}
      </div>

      <div style={styles.workflowCard}>
        <div style={styles.workflowTitle}>{active.icon} {active.title}</div>
        {activeKey === "resume_reviewer" && <ResumeReviewer />}
        {activeKey === "jd_analyzer" && <JDAnalyzer />}
        {activeKey === "star_evaluator" && <STAREvaluator />}
        {activeKey === "interview_engine" && <InterviewEngine onUseTool={onUseTool} />}
        {activeKey === "coding_interview" && <CodingCoach />}
        {activeKey === "communication" && <CommunicationCoach onUseTool={onUseTool} />}
      </div>
    </div>
  );
}

function ResumeReviewer() {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTextReview = async () => {
    if (!resumeText.trim()) return setResult({ ok: false, error: "Paste resume text first." });
    await runRequest(setLoading, setResult, () => reviewResume({ resumeText, targetRole }));
  };

  const runUploadReview = async () => {
    if (!file) return setResult({ ok: false, error: "Choose a PDF, DOCX, or TXT resume first." });
    await runRequest(setLoading, setResult, () => uploadResume(file));
  };

  return (
    <div style={styles.formStack}>
      <input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="Target role" style={styles.input} />
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files?.[0] || null); }}
        style={{...styles.dropBox, borderColor: dragging ? "rgba(190,242,100,.7)" : "rgba(190,242,100,.28)" }}
      >
        <input type="file" accept=".pdf,.docx,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} style={styles.fileInput} />
        <div style={styles.fileHint}>{file ? `Selected: ${file.name}` : "Drag & drop resume, or choose PDF/DOCX/TXT"}</div>
      </div>
      <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Or paste resume text here..." style={styles.textarea} />
      <div style={styles.buttonRow}>
        <button onClick={runTextReview} style={styles.startButton} disabled={loading}>{loading ? "Analyzing..." : "Analyze Text"}</button>
        <button onClick={runUploadReview} style={styles.secondaryButton} disabled={loading}>Analyze Upload</button>
      </div>
      <ResultPanel result={result} />
    </div>
  );
}

function JDAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!jobDescription.trim()) return setResult({ ok: false, error: "Paste a job description first." });
    await runRequest(setLoading, setResult, () => analyzeJobDescription({ resumeText, jobDescription }));
  };

  return (
    <div style={styles.formStack}>
      <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste job description..." style={styles.textarea} />
      <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Optional: paste resume text for match score..." style={styles.smallTextarea} />
      <button onClick={run} style={styles.startButton} disabled={loading}>{loading ? "Analyzing..." : "Analyze JD Match"}</button>
      <ResultPanel result={result} />
    </div>
  );
}

function STAREvaluator() {
  const [question, setQuestion] = useState("Tell me about a challenging project.");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const run = async () => {
    if (!answer.trim()) return setResult({ ok: false, error: "Paste your answer first." });
    await runRequest(setLoading, setResult, () => evaluateSTAR({ question, answer }));
  };
  return (
    <div style={styles.formStack}>
      <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Interview question" style={styles.input} />
      <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Paste your behavioral answer..." style={styles.textarea} />
      <button onClick={run} style={styles.startButton} disabled={loading}>{loading ? "Evaluating..." : "Evaluate STAR"}</button>
      <ResultPanel result={result} />
    </div>
  );
}

function InterviewEngine({ onUseTool }) {
  const [role, setRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState("entry");
  const [interviewType, setInterviewType] = useState("behavioral");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const start = async () => {
    await runRequest(setLoading, (res) => {
      setResult(res);
      if (res.ok) setQuestion(res.data.first_question || "");
    }, () => startInterview({ role, difficulty, interviewType }));
  };

  const evaluate = async () => {
    if (!question.trim() || !answer.trim()) return setResult({ ok: false, error: "Need a question and an answer first." });
    await runRequest(setLoading, setResult, () => evaluateInterviewAnswer({ question, answer, role }));
  };

  return (
    <div style={styles.formStack}>
      <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" style={styles.input} />
      <div style={styles.inlineGrid}>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={styles.select}><option value="entry">Entry</option><option value="medium">Medium</option><option value="advanced">Advanced</option></select>
        <select value={interviewType} onChange={(e) => setInterviewType(e.target.value)} style={styles.select}><option value="behavioral">Behavioral</option><option value="technical">Technical</option><option value="coding">Coding</option></select>
      </div>
      <button onClick={start} style={styles.startButton} disabled={loading}>{loading ? "Starting..." : "Generate Question"}</button>
      {question && <div style={styles.questionBox}><strong>Question:</strong><p>{question}</p><button style={styles.secondaryButton} onClick={() => onUseTool?.(`Mock interview question: ${question}`)}>Send to Chat</button></div>}
      <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Paste your answer..." style={styles.textarea} />
      <button onClick={evaluate} style={styles.secondaryButton} disabled={loading}>Evaluate Answer</button>
      <ResultPanel result={result} />
    </div>
  );
}

function CodingCoach() {
  const [question, setQuestion] = useState("Given an array, return indices of two numbers that add to target.");
  const [language, setLanguage] = useState("javascript");
  const [solution, setSolution] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const run = async () => {
    if (!solution.trim()) return setResult({ ok: false, error: "Paste your solution first." });
    await runRequest(setLoading, setResult, () => evaluateCoding({ question, solution, language }));
  };
  return (
    <div style={styles.formStack}>
      <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Coding question" style={styles.smallTextarea} />
      <select value={language} onChange={(e) => setLanguage(e.target.value)} style={styles.select}><option value="javascript">JavaScript</option><option value="python">Python</option><option value="java">Java</option><option value="cpp">C++</option></select>
      <textarea value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="Paste code or approach..." style={styles.codeTextarea} />
      <button onClick={run} style={styles.startButton} disabled={loading}>{loading ? "Reviewing..." : "Review Code"}</button>
      <ResultPanel result={result} />
    </div>
  );
}

function CommunicationCoach({ onUseTool }) {
  const prompt = "Act as my communication coach. Ask me one interview question, listen to my answer, and give feedback on clarity, confidence, filler words, pace, and structure.";
  return (
    <div style={styles.formStack}>
      <p style={styles.workflowText}>Use the microphone in the chat area. The assistant will listen, reply, and speak back if Auto Speak is enabled.</p>
      <button style={styles.startButton} onClick={() => onUseTool?.(prompt)}>Start Voice Practice in Chat</button>
    </div>
  );
}

async function runRequest(setLoading, setResult, requestFn) {
  try {
    setLoading(true);
    const data = await requestFn();
    setResult({ ok: true, data });
  } catch (error) {
    setResult({ ok: false, error: error.message || "Something went wrong." });
  } finally {
    setLoading(false);
  }
}

function ResultPanel({ result }) {
  if (!result) return null;
  if (!result.ok) return <div style={styles.errorBox}>⚠️ {result.error}</div>;
  const data = result.data;
  return (
    <div style={styles.resultBox}>
      <div style={styles.resultTitle}>Analysis Result</div>
      {"ats_score" in data && <ScoreCard label="ATS Score" value={data.ats_score} />}
      {"match_score" in data && <ScoreCard label="JD Match" value={data.match_score} />}
      {"overall_score" in data && <ScoreCard label="STAR Score" value={data.overall_score} />}
      {"score" in data && <ScoreCard label="Interview Score" value={data.score} />}
      {"correctness_estimate" in data && <ScoreCard label="Code Score" value={data.correctness_estimate} />}
      <PrettyList title="Strengths" items={data.strengths} />
      <PrettyList title="Improvements" items={data.improvements || data.feedback} />
      <PrettyList title="Missing Keywords" items={data.missing_keywords} />
      <PrettyJson data={data} />
    </div>
  );
}

function ScoreCard({ label, value }) {
  const score = Number(value) || 0;
  return <div style={styles.scoreCard}><div><div style={styles.scoreLabel}>{label}</div><div style={styles.scoreStatus}>{score >= 85 ? "Excellent" : score >= 70 ? "Good" : "Needs Work"}</div></div><div style={styles.scoreCircle}>{score}%</div></div>;
}

function PrettyList({ title, items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return <div style={styles.prettyList}><strong>{title}</strong>{items.slice(0, 6).map((item, idx) => <div key={idx} style={styles.prettyItem}>• {typeof item === "string" ? item : JSON.stringify(item)}</div>)}</div>;
}

function PrettyJson({ data }) {
  return <details style={styles.details}><summary style={styles.summary}>Raw JSON</summary><pre style={styles.jsonBox}>{JSON.stringify(data, null, 2)}</pre></details>;
}

const styles = {
  panel:{height:"100%",minHeight:0,overflowY:"auto",padding:16,color:"#ffffff"},
  header:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:14},
  eyebrow:{fontSize:11,color:"#bef264",fontWeight:950,letterSpacing:".14em",textTransform:"uppercase"},
  title:{marginTop:4,fontSize:22,fontWeight:950,letterSpacing:"-.05em"},
  statusPill:{border:"1px solid",borderRadius:999,padding:"7px 10px",fontSize:11,fontWeight:900,whiteSpace:"nowrap"},
  toolList:{display:"grid",gap:9},
  toolButton:{border:"1px solid",borderRadius:18,padding:12,textAlign:"left",color:"#ffffff",cursor:"pointer"},
  toolTop:{display:"flex",alignItems:"center",gap:9},icon:{fontSize:18},toolTitle:{fontSize:13,fontWeight:950},
  toolText:{margin:"7px 0",color:"#94a3b8",fontSize:12,lineHeight:1.45},
  tag:{display:"inline-flex",color:"#d9f99d",fontSize:10,fontWeight:900,border:"1px solid rgba(163,230,53,.18)",borderRadius:999,padding:"4px 8px",background:"rgba(163,230,53,.08)"},
  workflowCard:{marginTop:14,borderRadius:22,padding:14,background:"linear-gradient(135deg, rgba(163,230,53,.13), rgba(255,255,255,.045))",border:"1px solid rgba(190,242,100,.18)"},
  workflowTitle:{fontSize:15,fontWeight:950,marginBottom:12},
  workflowText:{color:"#cbd5e1",fontSize:13,lineHeight:1.55},
  formStack:{display:"grid",gap:10},
  input:baseInput(42),select:baseInput(42),
  textarea:{...baseInput(132),paddingTop:10,resize:"vertical",lineHeight:1.45},
  smallTextarea:{...baseInput(84),paddingTop:10,resize:"vertical",lineHeight:1.45},
  codeTextarea:{...baseInput(150),paddingTop:10,resize:"vertical",lineHeight:1.45,fontFamily:"Consolas, Monaco, monospace",fontSize:12},
  dropBox:{border:"1px dashed rgba(190,242,100,.28)",borderRadius:16,padding:12,background:"rgba(15,23,42,.45)"},
  fileInput:{width:"100%",color:"#cbd5e1",fontSize:12},fileHint:{marginTop:6,color:"#94a3b8",fontSize:12},
  buttonRow:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8},inlineGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8},
  startButton:{border:"none",borderRadius:16,padding:"12px 14px",background:"linear-gradient(135deg,#a3e635,#84cc16)",color:"#10210a",fontSize:13,fontWeight:950,cursor:"pointer"},
  secondaryButton:{border:"1px solid rgba(190,242,100,.22)",borderRadius:16,padding:"11px 12px",background:"rgba(163,230,53,.09)",color:"#ecfccb",fontSize:12,fontWeight:900,cursor:"pointer"},
  questionBox:{border:"1px solid rgba(190,242,100,.18)",borderRadius:16,padding:12,background:"rgba(15,23,42,.5)",color:"#e2e8f0",fontSize:13,lineHeight:1.5},
  resultBox:{border:"1px solid rgba(190,242,100,.18)",borderRadius:18,padding:12,background:"rgba(2,6,23,.58)",display:"grid",gap:10},
  resultTitle:{color:"#d9f99d",fontWeight:950,fontSize:13},
  errorBox:{border:"1px solid rgba(239,68,68,.28)",borderRadius:16,padding:12,color:"#fecaca",background:"rgba(239,68,68,.08)",fontSize:13},
  scoreCard:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,padding:12,borderRadius:16,background:"rgba(163,230,53,.08)",border:"1px solid rgba(163,230,53,.16)"},
  scoreLabel:{color:"#ffffff",fontWeight:950,fontSize:13},scoreStatus:{marginTop:3,color:"#94a3b8",fontSize:11},
  scoreCircle:{width:62,height:62,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid rgba(190,242,100,.55)",boxShadow:"0 0 24px rgba(163,230,53,.22)",color:"#ecfccb",fontWeight:950,fontSize:15,flexShrink:0},
  prettyList:{display:"grid",gap:6,padding:10,borderRadius:14,background:"rgba(255,255,255,.045)",color:"#dbeafe",fontSize:12,lineHeight:1.45},
  prettyItem:{color:"#cbd5e1"},details:{border:"1px solid rgba(255,255,255,.08)",borderRadius:14,padding:10},summary:{cursor:"pointer",fontWeight:900,color:"#d9f99d"},
  jsonBox:{margin:"10px 0 0",maxHeight:220,overflow:"auto",padding:10,borderRadius:14,background:"rgba(0,0,0,.28)",color:"#cbd5e1",fontSize:11,lineHeight:1.5,whiteSpace:"pre-wrap"},
};
function baseInput(height){return{width:"100%",height,borderRadius:14,border:"1px solid rgba(148,163,184,.18)",background:"rgba(15,23,42,.78)",color:"#ffffff",outline:"none",padding:"0 12px",fontSize:13,fontFamily:"inherit"};}
