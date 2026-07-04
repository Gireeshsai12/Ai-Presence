import React from "react";

export function renderMarkdown(text = "") {
  const lines = String(text).split("\n");
  const elements = [];
  let codeBuffer = [];
  let inCode = false;

  const flushCode = (index) => {
    if (codeBuffer.length === 0) return;

    elements.push(
      <pre key={`code-${index}`} style={styles.codeBlock}>
        <code>{codeBuffer.join("\n")}</code>
      </pre>
    );

    codeBuffer = [];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCode) {
        flushCode(index);
        inCode = false;
      } else {
        inCode = true;
      }
      return;
    }

    if (inCode) {
      codeBuffer.push(line);
      return;
    }

    if (!trimmed) {
      elements.push(<div key={`space-${index}`} style={{ height: 8 }} />);
      return;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={index} style={styles.h3}>
          {trimmed.replace("### ", "")}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={index} style={styles.h2}>
          {trimmed.replace("## ", "")}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("- ")) {
      elements.push(
        <div key={index} style={styles.bullet}>
          <span style={styles.bulletDot}>•</span>
          <span>{trimmed.replace("- ", "")}</span>
        </div>
      );
      return;
    }

    elements.push(
      <p key={index} style={styles.paragraph}>
        {line}
      </p>
    );
  });

  if (inCode) flushCode("final");

  return elements;
}

const styles = {
  paragraph: {
    margin: "0 0 8px",
    lineHeight: 1.7,
  },

  h2: {
    margin: "14px 0 8px",
    fontSize: 18,
    lineHeight: 1.35,
    color: "#ffffff",
  },

  h3: {
    margin: "12px 0 6px",
    fontSize: 15,
    lineHeight: 1.35,
    color: "#dbeafe",
  },

  bullet: {
    display: "flex",
    gap: 8,
    marginBottom: 7,
    lineHeight: 1.6,
  },

  bulletDot: {
    color: "#60a5fa",
    fontWeight: 900,
  },

  codeBlock: {
    margin: "10px 0",
    padding: 14,
    borderRadius: 14,
    background: "rgba(2,6,23,0.82)",
    border: "1px solid rgba(148,163,184,0.16)",
    color: "#dbeafe",
    overflowX: "auto",
    fontSize: 13,
    lineHeight: 1.6,
  },
};