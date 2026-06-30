import { Platform } from 'react-native';

export const colors = {
  // ── Backgrounds — soft blush hierarchy ──
  background: '#FEF5F8',
  backgroundDeep: '#FAEAEF',

  // ── Surfaces — white to blush off-white ──
  surface: '#FFFFFF',
  surfaceStrong: '#FAF0F4',
  surfaceMuted: '#F5E3EC',

  // ── Borders — rose-tinted transparency ──
  border: 'rgba(160, 55, 90, 0.10)',

  // ── Typography — warm plum scale ──
  text: '#2C1422',
  textMuted: '#A06070',
  textSoft: '#6B2E48',

  // ── Primary accent — vibrant dating rose ──
  accent: '#E8356A',
  accentStrong: '#C0185A',
  accentMuted: 'rgba(232, 53, 106, 0.12)',

  // ── Semantic signals ──
  mint: '#BF3F8A',
  gold: '#B07820',
  success: '#0D9B72',
  danger: '#C42B2B',

  // ── Input & overlay ──
  input: '#FBF0F4',
  overlay: 'rgba(250, 234, 242, 0.88)',

  // ── Chip / pill / indicator elements ──
  chipBackground: 'rgba(160, 55, 90, 0.07)',
  dotInactive: 'rgba(160, 55, 90, 0.18)',

  white: '#FFFFFF',
  transparent: 'transparent',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 14,
  md: 22,
  lg: 30,
  xl: 40,
  pill: 999,
};

export const typeScale = {
  overline: 11,
  caption: 12,
  body: 15,
  subtitle: 18,
  title: 24,
  hero: 34,
};

export const shadows = Platform.select({
  ios: {
    shadowColor: '#2D1810',
    shadowOpacity: 0.10,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },
  android: {
    elevation: 3,
  },
  default: {},
});
