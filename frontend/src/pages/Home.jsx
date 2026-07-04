import React from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

const modes = [
  ["Interview Coach", "Practice behavioral and technical interviews.", "/session/interview_coach"],
  ["Resume Reviewer", "Review resume and ATS keywords.", "/session/resume_reviewer"],
  ["JD Analyzer", "Analyze job descriptions and fit.", "/session/jd_analyzer"],
  ["STAR Evaluator", "Improve behavioral answers.", "/session/star_evaluator"],
];

export default function Home() {
  const authed = isAuthenticated();

  return (
    <div style={styles.page}>
      <div style={styles.glowA} />
      <div style={styles.glowB} />

      <main style={styles.main}>
        <nav style={styles.nav}>
          <div style={styles.logo}>AI Presence</div>
          <div style={styles.navActions}>
            {!authed && (
              <Link to="/login" style={styles.navGhost}>
                Login
              </Link>
            )}
            <Link to={authed ? "/session/interview_coach" : "/register"} style={styles.navButton}>
              {authed ? "Launch App" : "Get Started"}
            </Link>
          </div>
        </nav>

        <section style={styles.hero}>
          <div style={styles.badge}>Voice-first AI Career Coach</div>
          <h1 style={styles.h1}>
            Practice interviews, review resumes, and build confidence with AI.
          </h1>
          <p style={styles.p}>
            AI Presence combines voice interaction, adaptive coaching, backend memory,
            authentication, resume intelligence, and career workflows into one polished assistant.
          </p>

          <div style={styles.actions}>
            <Link to={authed ? "/session/interview_coach" : "/register"} style={styles.primary}>
              {authed ? "Start Interview Practice" : "Create Free Account"}
            </Link>
            <Link to={authed ? "/session/resume_reviewer" : "/login"} style={styles.secondary}>
              {authed ? "Review Resume" : "Login"}
            </Link>
          </div>
        </section>

        <section style={styles.grid}>
          {modes.map(([title, text, url]) => (
            <Link key={title} to={authed ? url : "/register"} style={styles.card}>
              <h3>{title}</h3>
              <p>{text}</p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#09090b 0%,#0b0f0b 45%,#111318 100%)",
    color: "#fff",
    fontFamily: "Inter,system-ui,sans-serif",
    position: "relative",
    overflow: "hidden",
  },

  glowA: {
    position: "absolute",
    top: -160,
    left: -120,
    width: 520,
    height: 520,
    borderRadius: "50%",
    background: "rgba(132,204,22,.25)",
    filter: "blur(130px)",
  },

  glowB: {
    position: "absolute",
    right: -160,
    bottom: -170,
    width: 540,
    height: 540,
    borderRadius: "50%",
    background: "rgba(163,230,53,.18)",
    filter: "blur(130px)",
  },

  main: {
    position: "relative",
    zIndex: 2,
    maxWidth: 1180,
    margin: "0 auto",
    padding: "26px 20px 70px",
  },

  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    fontWeight: 950,
    fontSize: 24,
    letterSpacing: "-.05em",
  },

  navActions: {
    display: "flex",
    gap: 10,
  },

  navGhost: {
    textDecoration: "none",
    borderRadius: 999,
    padding: "10px 15px",
    background: "rgba(255,255,255,.06)",
    border: "1px solid rgba(255,255,255,.12)",
    color: "#fff",
    fontWeight: 850,
  },

  navButton: {
    textDecoration: "none",
    borderRadius: 999,
    padding: "10px 15px",
    background: "rgba(163,230,53,.15)",
    border: "1px solid rgba(163,230,53,.28)",
    color: "#d9f99d",
    fontWeight: 950,
  },

  hero: {
    padding: "110px 0 70px",
    maxWidth: 850,
  },

  badge: {
    display: "inline-flex",
    border: "1px solid rgba(190,242,100,.25)",
    background: "rgba(163,230,53,.12)",
    color: "#d9f99d",
    borderRadius: 999,
    padding: "8px 12px",
    fontWeight: 850,
    fontSize: 13,
  },

  h1: {
    fontSize: 64,
    lineHeight: 1.02,
    letterSpacing: "-.08em",
    margin: "24px 0 0",
  },

  p: {
    maxWidth: 720,
    color: "#a7b4c8",
    fontSize: 18,
    lineHeight: 1.75,
  },

  actions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 28,
  },

  primary: {
    textDecoration: "none",
    borderRadius: 999,
    padding: "14px 18px",
    background: "linear-gradient(135deg,#84cc16,#bef264)",
    color: "#10210a",
    fontWeight: 950,
  },

  secondary: {
    textDecoration: "none",
    borderRadius: 999,
    padding: "14px 18px",
    background: "rgba(255,255,255,.08)",
    border: "1px solid rgba(255,255,255,.14)",
    color: "#fff",
    fontWeight: 950,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,minmax(0,1fr))",
    gap: 14,
  },

  card: {
    textDecoration: "none",
    color: "#fff",
    minHeight: 160,
    borderRadius: 24,
    padding: 22,
    background: "rgba(15,23,42,.72)",
    border: "1px solid rgba(148,163,184,.14)",
  },
};
