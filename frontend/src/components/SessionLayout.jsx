import React from 'react';
import ModeSidebar from './ModeSidebar';
import OrbPanel from './OrbPanel';
import ConversationPanel from './ConversationPanel';
import CareerToolsPanel from './CareerToolsPanel';
import { glass } from '../styles/theme';

export default function SessionLayout({
  selectedMode,
  onModeChange,
  sessions,
  activeSessionId,
  onNewSession,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  onToggleFavorite,
  orbState,
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
  showCareerTools,
}) {
  return (
    <main
      className={showCareerTools ? 'session-grid with-tools' : 'session-grid'}
      style={{
        ...styles.mainGrid,
        gridTemplateColumns: showCareerTools
          ? '310px minmax(0, 1fr) 330px'
          : '310px minmax(0, 1fr)',
      }}
    >
      <aside className="side-panel" style={styles.sideStack}>
        <ModeSidebar
          selectedMode={selectedMode}
          onModeChange={onModeChange}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onNewSession={onNewSession}
          onSelectSession={onSelectSession}
          onDeleteSession={onDeleteSession}
          onRenameSession={onRenameSession}
          onToggleFavorite={onToggleFavorite}
        />

        <OrbPanel
          orbState={orbState}
          demoMode={demoMode}
          demoStep={demoStep}
          demoQuestionsLength={demoQuestionsLength}
        />
      </aside>

      <ConversationPanel
        demoMode={demoMode}
        demoStep={demoStep}
        demoQuestionsLength={demoQuestionsLength}
        currentMode={currentMode}
        messages={messages}
        liveTranscript={liveTranscript}
        isListening={isListening}
        aiState={aiState}
        onCopy={onCopy}
        messagesAreaRef={messagesAreaRef}
        input={input}
        setInput={setInput}
        onSend={onSend}
        onVoiceClick={onVoiceClick}
        onStartDemo={onStartDemo}
        onStopDemo={onStopDemo}
        onStopVoice={onStopVoice}
        onClearChat={onClearChat}
        silenceCountdown={silenceCountdown}
        onPromptClick={onPromptClick}
        onExportText={onExportText}
        onExportMarkdown={onExportMarkdown}
        onExportJson={onExportJson}
        onCopyConversation={onCopyConversation}
      />

      {showCareerTools && (
        <aside className="tools-panel" style={styles.toolsPanel}>
          <CareerToolsPanel onUseTool={onPromptClick} compact />
        </aside>
      )}
    </main>
  );
}

const styles = {
  mainGrid: {
    position: 'relative',
    zIndex: 2,
    height: 'calc(100vh - 72px)',
    padding: '0 18px 18px',
    display: 'grid',
    gap: 16,
    overflow: 'hidden',
  },

  sideStack: {
    minHeight: 0,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    paddingRight: 4,
  },

  toolsPanel: {
    ...glass,
    minHeight: 0,
    height: '100%',
    overflowY: 'auto',
    borderRadius: 30,
    padding: 0,
  },
};
