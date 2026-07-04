import React from "react";
import { getStoredUser, logout } from "../services/authService";

export default function SessionHeader({ status, onOpenInsights, onOpenSettings }) {
  const connected = status === "Connected";
  const user = getStoredUser();

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <a href="/" style={styles.home}>← Home</a>
        <div>
          <div style={styles.title}>AI Presence</div>
          <div style={styles.subtitle}>
            {user?.email ? `Signed in as ${user.email}` : "Voice-first AI career assistant platform"}
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div
          style={{
            ...styles.status,
            border: connected
              ? "1px solid rgba(163,230,53,.35)"
              : "1px solid rgba(239,68,68,.35)",
            color: connected ? "#d9f99d" : "#fecaca",
          }}
        >
          <span
            style={{
              ...styles.dot,
              background: connected ? "#a3e635" : "#ef4444",
            }}
          />
          {status}
        </div>

        <button onClick={onOpenInsights} style={styles.btn}>Insights</button>
        <button onClick={onOpenSettings} style={styles.btn}>Settings</button>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: 72,
    padding: "12px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    position: "relative",
    zIndex: 5,
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  home: {
    textDecoration: "none",
    color: "#d9f99d",
    background: "rgba(163,230,53,.14)",
    border: "1px solid rgba(163,230,53,.28)",
    borderRadius: 999,
    padding: "9px 13px",
    fontSize: 13,
    fontWeight: 900,
  },

  title: {
    fontSize: 22,
    fontWeight: 950,
    letterSpacing: "-.04em",
    color: "#fff",
  },

  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#94a3b8",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  status: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 12px",
    borderRadius: 999,
    background: "rgba(15,23,42,.72)",
    fontSize: 12,
    fontWeight: 850,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
  },

  btn: {
    border: "1px solid rgba(255,255,255,.14)",
    background: "rgba(255,255,255,.07)",
    color: "#f8fafc",
    borderRadius: 999,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 850,
    cursor: "pointer",
  },

  logoutBtn: {
    border: "1px solid rgba(239,68,68,.22)",
    background: "rgba(239,68,68,.1)",
    color: "#fecaca",
    borderRadius: 999,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 850,
    cursor: "pointer",
  },
};
