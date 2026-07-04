export function exportAsText(messages = [], filename = 'ai-presence-chat.txt') {
  const content = messages.map((msg) => `${msg.sender}: ${msg.text}`).join('\n\n');
  downloadFile(content, filename, 'text/plain');
}

export function exportAsMarkdown(messages = [], filename = 'ai-presence-chat.md') {
  const content = messages
    .map((msg) => `## ${msg.sender === 'You' ? 'You' : 'AI Presence'}\n\n${msg.text}`)
    .join('\n\n---\n\n');
  downloadFile(content, filename, 'text/markdown');
}

export function exportAsJson(messages = [], filename = 'ai-presence-chat.json') {
  downloadFile(
    JSON.stringify({ app: 'AI Presence', exportedAt: new Date().toISOString(), messages }, null, 2),
    filename,
    'application/json'
  );
}

export async function copyConversation(messages = []) {
  const content = messages.map((msg) => `${msg.sender}: ${msg.text}`).join('\n\n');
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(content);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = content;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
