import React from "react";

export default function AIHumanAvatar({ orbState = "idle" }) {
  const config = {
    idle: {
      label: "Ready",
      main: "#4f7cff",
      glow: "rgba(79,124,255,0.55)",
      ring: "rgba(96,165,250,0.35)",
      speed: "3.2s",
    },
    listening: {
      label: "Listening",
      main: "#22c55e",
      glow: "rgba(34,197,94,0.7)",
      ring: "rgba(34,197,94,0.45)",
      speed: "1.2s",
    },
    thinking: {
      label: "Thinking",
      main: "#f59e0b",
      glow: "rgba(245,158,11,0.7)",
      ring: "rgba(245,158,11,0.45)",
      speed: "1.6s",
    },
    speaking: {
      label: "Speaking",
      main: "#8b5cf6",
      glow: "rgba(139,92,246,0.75)",
      ring: "rgba(139,92,246,0.5)",
      speed: "0.9s",
    },
  };

  const state = config[orbState] || config.idle;

  return (
    <div style={styles.wrapper}>
      <style>
        {`
          @keyframes orbPulse {
            0% { transform: scale(0.92); opacity: 0.55; }
            50% { transform: scale(1.12); opacity: 1; }
            100% { transform: scale(0.92); opacity: 0.55; }
          }

          @keyframes orbRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes orbFloat {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }

          @keyframes wave {
            0% { height: 10px; opacity: 0.45; }
            50% { height: 34px; opacity: 1; }
            100% { height: 10px; opacity: 0.45; }
          }
        `}
      </style>

      <div style={styles.orbArea}>
        <div
          style={{
            ...styles.outerPulse,
            borderColor: state.ring,
            boxShadow: `0 0 70px ${state.glow}`,
            animation: `orbPulse ${state.speed} ease-in-out infinite`,
          }}
        />

        <div
          style={{
            ...styles.rotatingRing,
            borderTopColor: state.ring,
            borderRightColor: "transparent",
            animation: "orbRotate 8s linear infinite",
          }}
        />

        <div
          style={{
            ...styles.core,
            background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${state.main} 22%, #1e3a8a 70%, #020617 100%)`,
            boxShadow: `0 0 40px ${state.glow}, 0 0 95px ${state.glow}`,
            animation: "orbFloat 3s ease-in-out infinite",
          }}
        />

        {orbState === "speaking" && (
          <div style={styles.waveRow}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                style={{
                  ...styles.waveBar,
                  background: state.main,
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div style={styles.label}>{state.label}</div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    height: "250px",
    borderRadius: "22px",
    background:
      "radial-gradient(circle at center, rgba(37,99,235,0.22), rgba(2,6,23,0.96) 70%)",
    border: "1px solid rgba(148,163,184,0.14)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  orbArea: {
    width: "180px",
    height: "180px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  outerPulse: {
    position: "absolute",
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    border: "1px solid",
  },

  rotatingRing: {
    position: "absolute",
    width: "125px",
    height: "125px",
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.08)",
  },

  core: {
    width: "82px",
    height: "82px",
    borderRadius: "50%",
    zIndex: 2,
  },

  waveRow: {
    position: "absolute",
    bottom: "12px",
    display: "flex",
    gap: "5px",
    alignItems: "center",
    zIndex: 4,
  },

  waveBar: {
    width: "5px",
    borderRadius: "999px",
    animation: "wave 0.8s ease-in-out infinite",
  },

  label: {
    marginTop: "6px",
    fontSize: "12px",
    fontWeight: 900,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#dbeafe",
  },
};