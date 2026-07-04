import React from 'react';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import { glass, buttonBase } from '../styles/theme';

export default function ConversationPanel({
  demoMode,
  demoStep,
  demoQuestionsLength,
  currentMode,
  messages,
  liveTranscript,
  isListening,
  aiState,
  onCopy,
  messagesAreaRef,
  input,
  setInput,
  onSend,
  onVoiceClick,
  onStartDemo,
  onStopDemo,
  onStopVoice,
  onClearChat,
  silenceCountdown,
  onPromptClick,
  onExportText,
  onExportMarkdown,
  onExportJson,
  onCopyConversation,
}) {
  return (
    <section style={styles.chatShell}>
      <div style={styles.chatTop}>
        <div style={styles.titleBlock}>
          <div style={styles.titleRow}>
            <div style={styles.chatTitle}>{demoMode ? 'Mock Interview' : 'Live Conversation'}</div>
            <span style={styles.livePill}>Live</span>
          </div>
          <div style={styles.chatSub}>
            {demoMode
              ? `Question ${demoStep + 1} of ${demoQuestionsLength}. Answer naturally and AI will coach you.`
              : currentMode.description}
          </div>
        </div>

        <div style={styles.chatActions}>
          {!demoMode ? (
            <button onClick={onStartDemo} style={styles.demoButton}>Interview Demo</button>
          ) : (
            <button onClick={onStopDemo} style={styles.dangerButton}>Stop Demo</button>
          )}
          <button onClick={onStopVoice} style={styles.softButton}>Stop Voice</button>
          <button onClick={onClearChat} style={styles.softButton}>Clear</button>
          <div style={styles.exportGroup}>
            <button onClick={onCopyConversation} style={styles.exportButton}>Copy</button>
            <button onClick={onExportText} style={styles.exportButton}>TXT</button>
            <button onClick={onExportMarkdown} style={styles.exportButton}>MD</button>
            <button onClick={onExportJson} style={styles.exportButton}>JSON</button>
          </div>
        </div>
      </div>

      <MessageList
        messages={messages}
        liveTranscript={liveTranscript}
        isListening={isListening}
        aiState={aiState}
        demoMode={demoMode}
        onCopy={onCopy}
        messagesAreaRef={messagesAreaRef}
        onPromptClick={onPromptClick}
      />

      {isListening && silenceCountdown !== null && (
        <div style={styles.silenceBar}>Auto-stop on silence in {silenceCountdown}s</div>
      )}

      <ChatInput
        input={input}
        setInput={setInput}
        onSend={onSend}
        onVoiceClick={onVoiceClick}
        isListening={isListening}
        placeholder={demoMode ? 'Type your interview answer...' : 'Type your message...'}
      />
    </section>
  );
}

const styles = {
  chatShell: {
    ...glass,
    minWidth: 0,
    minHeight: 0,
    borderRadius: 30,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },

  chatTop: {
    flexShrink: 0,
    minHeight: 78,
    padding: '14px 18px',
    borderBottom: '1px solid rgba(148,163,184,.14)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  titleBlock: {
    minWidth: 0,
  },

  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },

  chatTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 950,
    letterSpacing: '-.04em',
  },

  livePill: {
    padding: '5px 9px',
    borderRadius: 999,
    background: 'rgba(163,230,53,.1)',
    border: '1px solid rgba(163,230,53,.22)',
    color: '#d9f99d',
    fontSize: 11,
    fontWeight: 900,
  },

  chatSub: {
    marginTop: 5,
    color: '#94a3b8',
    fontSize: 12,
    maxWidth: 760,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  chatActions: {
    display: 'flex',
    gap: 8,
    flexShrink: 0,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },

  demoButton: {
    ...buttonBase,
    background: 'linear-gradient(135deg,#a3e635,#84cc16)',
    color: '#fff',
  },

  softButton: {
    ...buttonBase,
  },

  dangerButton: {
    ...buttonBase,
    background: 'rgba(239,68,68,.13)',
    color: '#fecaca',
  },

  exportGroup: {
    display: 'flex',
    gap: 5,
    paddingLeft: 4,
  },

  exportButton: {
    border: '1px solid rgba(190,242,100,.18)',
    borderRadius: 999,
    padding: '8px 9px',
    background: 'rgba(132,204,22,.10)',
    color: '#d9f99d',
    fontSize: 11,
    fontWeight: 850,
    cursor: 'pointer',
  },

  silenceBar: {
    flexShrink: 0,
    padding: '8px 14px',
    textAlign: 'center',
    background: 'rgba(245,158,11,.12)',
    color: '#fde68a',
    fontSize: 12,
    fontWeight: 850,
    borderTop: '1px solid rgba(245,158,11,.18)',
  },
};
