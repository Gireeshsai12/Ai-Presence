import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/authService";

export default function AuthPage({ mode = "login" }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const location = useLocation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("demo@aipresence.dev");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectTo = location.state?.from || "/session/interview_coach";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    if (isRegister && !fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    try {
      setLoading(true);

      if (isRegister) {
        await registerUser({ fullName, email, password });
      } else {
        await loginUser({ email, password });
      }

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />

      <main style={styles.shell}>
        <section style={styles.brandPanel}>
          <Link to="/" style={styles.backLink}>← Home</Link>
          <div style={styles.badge}>AI Presence</div>
          <h1 style={styles.title}>
            {isRegister ? "Create your AI career workspace." : "Welcome back to AI Presence."}
          </h1>
          <p style={styles.subtitle}>
            Save sessions, connect resume intelligence, and continue interview practice with a persistent full-stack backend.
          </p>

          <div style={styles.featureGrid}>
            <Feature title="Voice-first coaching" text="Practice with text or speech." />
            <Feature title="Resume + JD AI" text="Analyze fit and gaps." />
            <Feature title="Memory-ready" text="Keep career context." />
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <div style={styles.cardEyebrow}>{isRegister ? "Register" : "Login"}</div>
              <h2 style={styles.cardTitle}>
                {isRegister ? "Create account" : "Sign in"}
              </h2>
            </div>
            <div style={styles.statusPill}>Backend Auth</div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {isRegister && (
              <label style={styles.label}>
                Full name
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={styles.input}
                  placeholder="Gireesh Sai Kalluri"
                />
              </label>
            )}

            <label style={styles.label}>
              Email
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                type="email"
                placeholder="you@example.com"
              />
            </label>

            <label style={styles.label}>
              Password
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                type="password"
                placeholder="At least 8 characters"
              />
            </label>

            {error && <div style={styles.error}>{error}</div>}

            <button type="submit" disabled={loading} style={styles.primaryButton}>
              {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
            </button>

            <div style={styles.switchText}>
              {isRegister ? "Already have an account?" : "New to AI Presence?"}{" "}
              <Link to={isRegister ? "/login" : "/register"} style={styles.switchLink}>
                {isRegister ? "Login" : "Create account"}
              </Link>
            </div>

            <div style={styles.demoNote}>
              For local testing, use any email/password when registering.
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

function Feature({ title, text }) {
  return (
    <div style={styles.feature}>
      <div style={styles.featureTitle}>{title}</div>
      <div style={styles.featureText}>{text}</div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#09090b 0%,#0b0f0b 45%,#111318 100%)",
    color: "#fff",
    fontFamily: "Inter, system-ui, sans-serif",
    position: "relative",
    overflow: "hidden",
  },

  glowOne: {
    position: "absolute",
    top: -160,
    left: -120,
    width: 520,
    height: 520,
    borderRadius: "50%",
    background: "rgba(132,204,22,.25)",
    filter: "blur(130px)",
  },

  glowTwo: {
    position: "absolute",
    right: -160,
    bottom: -170,
    width: 540,
    height: 540,
    borderRadius: "50%",
    background: "rgba(163,230,53,.18)",
    filter: "blur(130px)",
  },

  shell: {
    position: "relative",
    zIndex: 2,
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.1fr) 430px",
    gap: 32,
    maxWidth: 1180,
    margin: "0 auto",
    padding: "52px 22px",
    alignItems: "center",
  },

  brandPanel: {
    maxWidth: 720,
  },

  backLink: {
    display: "inline-flex",
    textDecoration: "none",
    color: "#d9f99d",
    background: "rgba(163,230,53,.14)",
    border: "1px solid rgba(163,230,53,.28)",
    borderRadius: 999,
    padding: "9px 13px",
    fontSize: 13,
    fontWeight: 900,
    marginBottom: 42,
  },

  badge: {
    display: "inline-flex",
    border: "1px solid rgba(190,242,100,.25)",
    background: "rgba(163,230,53,.12)",
    color: "#d9f99d",
    borderRadius: 999,
    padding: "8px 12px",
    fontWeight: 900,
    fontSize: 13,
  },

  title: {
    fontSize: 58,
    lineHeight: 1.02,
    letterSpacing: "-.08em",
    margin: "24px 0 0",
  },

  subtitle: {
    maxWidth: 640,
    color: "#a7b4c8",
    fontSize: 18,
    lineHeight: 1.75,
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginTop: 34,
  },

  feature: {
    border: "1px solid rgba(163,230,53,.14)",
    background: "rgba(255,255,255,.05)",
    borderRadius: 22,
    padding: 16,
  },

  featureTitle: {
    fontWeight: 950,
    fontSize: 14,
  },

  featureText: {
    marginTop: 6,
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 1.45,
  },

  card: {
    background: "rgba(17,19,24,.88)",
    border: "1px solid rgba(163,230,53,.18)",
    borderRadius: 30,
    padding: 24,
    boxShadow: "0 24px 70px rgba(0,0,0,.38)",
    backdropFilter: "blur(18px)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 22,
  },

  cardEyebrow: {
    color: "#bef264",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: ".14em",
    fontWeight: 950,
  },

  cardTitle: {
    margin: "5px 0 0",
    fontSize: 30,
    letterSpacing: "-.06em",
  },

  statusPill: {
    border: "1px solid rgba(163,230,53,.22)",
    borderRadius: 999,
    padding: "7px 10px",
    color: "#d9f99d",
    background: "rgba(163,230,53,.08)",
    fontSize: 11,
    fontWeight: 900,
  },

  form: {
    display: "grid",
    gap: 14,
  },

  label: {
    display: "grid",
    gap: 8,
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: 850,
  },

  input: {
    height: 48,
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(15,23,42,.78)",
    color: "#ffffff",
    outline: "none",
    padding: "0 14px",
    fontSize: 14,
    fontFamily: "inherit",
  },

  error: {
    border: "1px solid rgba(239,68,68,.28)",
    background: "rgba(239,68,68,.1)",
    color: "#fecaca",
    borderRadius: 16,
    padding: 12,
    fontSize: 13,
  },

  primaryButton: {
    border: "none",
    borderRadius: 16,
    padding: "14px 16px",
    background: "linear-gradient(135deg,#a3e635,#84cc16)",
    color: "#10210a",
    fontSize: 14,
    fontWeight: 950,
    cursor: "pointer",
    marginTop: 6,
  },

  switchText: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 13,
  },

  switchLink: {
    color: "#d9f99d",
    fontWeight: 950,
    textDecoration: "none",
  },

  demoNote: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 12,
    lineHeight: 1.5,
  },
};
