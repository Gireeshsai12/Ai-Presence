export const colors = {
  bg: '#09090b',
  bg2: '#0b0f0b',
  panel: 'rgba(17, 19, 24, 0.76)',
  panelStrong: 'rgba(17, 19, 24, 0.94)',
  card: 'rgba(255, 255, 255, 0.055)',
  cardStrong: 'rgba(255, 255, 255, 0.085)',
  border: 'rgba(163, 230, 53, 0.16)',
  borderStrong: 'rgba(190, 242, 100, 0.26)',
  text: '#f8fafc',
  textSoft: '#e2e8f0',
  muted: '#94a3b8',
  muted2: '#64748b',
  blue: '#a3e635',
  blue2: '#bef264',
  green: '#a3e635',
  amber: '#facc15',
  purple: '#84cc16',
  red: '#ef4444',
  primary: '#a3e635',
  primaryHover: '#bef264',
  primaryDark: '#65a30d',
};

export const shadow = {
  soft: '0 14px 38px rgba(0,0,0,0.24)',
  strong: '0 24px 70px rgba(0,0,0,0.38)',
  blue: '0 0 38px rgba(163,230,53,0.34)',
  lime: '0 0 42px rgba(163,230,53,0.36)',
};

export const glass = {
  background: colors.panel,
  border: `1px solid ${colors.border}`,
  boxShadow: shadow.strong,
  backdropFilter: 'blur(18px)',
};

export const buttonBase = {
  border: '1px solid rgba(163,230,53,0.18)',
  borderRadius: 999,
  padding: '10px 13px',
  background: 'rgba(163,230,53,0.08)',
  color: '#ecfccb',
  fontSize: 12,
  fontWeight: 850,
  cursor: 'pointer',
};
