import React from 'react';

export function renderMarkdown(text = '') {
  const lines = String(text).split('\n');
  const output = [];
  let code = [];
  let inCode = false;

  const flushCode = (key) => {
    if (!code.length) return;
    const value = code.join('\n');
    output.push(
      <div key={`code-${key}`} style={styles.codeWrap}>
        <button style={styles.copyCode} onClick={() => navigator.clipboard?.writeText(value)}>Copy code</button>
        <pre style={styles.codeBlock}><code>{value}</code></pre>
      </div>
    );
    code = [];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      if (inCode) {
        flushCode(index);
        inCode = false;
      } else {
        inCode = true;
      }
      return;
    }
    if (inCode) {
      code.push(line);
      return;
    }
    if (!trimmed) {
      output.push(<div key={`space-${index}`} style={{ height: 8 }} />);
      return;
    }
    if (trimmed.startsWith('### ')) {
      output.push(<h3 key={index} style={styles.h3}>{trimmed.replace('### ', '')}</h3>);
      return;
    }
    if (trimmed.startsWith('## ')) {
      output.push(<h2 key={index} style={styles.h2}>{trimmed.replace('## ', '')}</h2>);
      return;
    }
    if (trimmed.startsWith('- ')) {
      output.push(<div key={index} style={styles.bullet}><span style={styles.dot}>•</span><span>{trimmed.replace('- ', '')}</span></div>);
      return;
    }
    output.push(<p key={index} style={styles.p}>{line}</p>);
  });
  if (inCode) flushCode('final');
  return output;
}

const styles = {
  p: { margin: '0 0 8px', lineHeight: 1.7 },
  h2: { margin: '14px 0 8px', fontSize: 18, color: '#fff' },
  h3: { margin: '12px 0 6px', fontSize: 15, color: '#ecfccb' },
  bullet: { display: 'flex', gap: 8, marginBottom: 7, lineHeight: 1.6 },
  dot: { color: '#bef264', fontWeight: 900 },
  codeWrap: { position: 'relative', margin: '10px 0' },
  codeBlock: { margin: 0, padding: 14, borderRadius: 14, background: 'rgba(2,6,23,.85)', border: '1px solid rgba(148,163,184,.16)', color: '#ecfccb', overflowX: 'auto', fontSize: 13, lineHeight: 1.6 },
  copyCode: { position: 'absolute', top: 8, right: 8, border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.08)', color: '#cbd5e1', borderRadius: 999, padding: '5px 8px', fontSize: 10, cursor: 'pointer' },
};
