import { Platform } from 'react-native';

/**
 * Shape shared by every selectable palette. Components read these tokens
 * through `useTheme()` so switching the palette re-themes the whole app.
 */
export type Palette = {
  background: string;
  backgroundDeep: string;
  surface: string;
  surfaceStrong: string;
  surfaceMuted: string;
  border: string;
  text: string;
  textMuted: string;
  textSoft: string;
  accent: string;
  accentStrong: string;
  accentMuted: string;
  mint: string;
  gold: string;
  success: string;
  danger: string;
  input: string;
  /** Translucent, theme-toned panel tint (light). */
  overlay: string;
  /** Fixed dark scrim for text laid over photos, regardless of palette. */
  scrim: string;
  /** Legible text color on top of the accent color. */
  onAccent: string;
  /** Muted tint for inactive indicators (e.g. carousel dots). */
  dotInactive: string;
  white: string;
  transparent: string;
};

/** Soft warm pink / peach. */
const blush: Palette = {
  background: '#FFF6F4',
  backgroundDeep: '#FFE9E2',
  surface: '#FFFFFF',
  surfaceStrong: '#FFEDE8',
  surfaceMuted: '#FCF1EE',
  border: 'rgba(44, 34, 48, 0.08)',
  text: '#2C2230',
  textMuted: '#9B8C96',
  textSoft: '#5E5460',
  accent: '#FF8FA3',
  accentStrong: '#FB7392',
  accentMuted: 'rgba(255, 143, 163, 0.16)',
  mint: '#7FD3BC',
  gold: '#FFC274',
  success: '#5FC59A',
  danger: '#FF7E8A',
  input: '#FCF1EE',
  overlay: 'rgba(255, 255, 255, 0.72)',
  scrim: 'rgba(40, 24, 34, 0.55)',
  onAccent: '#3E0F1C',
  dotInactive: 'rgba(44, 34, 48, 0.18)',
  white: '#FFFFFF',
  transparent: 'transparent',
};

/** Soft green / aqua. */
const mint: Palette = {
  background: '#F1FBF7',
  backgroundDeep: '#DEF4EC',
  surface: '#FFFFFF',
  surfaceStrong: '#E2F5EE',
  surfaceMuted: '#EDF9F4',
  border: 'rgba(22, 48, 42, 0.08)',
  text: '#1E2E2A',
  textMuted: '#7E948C',
  textSoft: '#46574F',
  accent: '#5FC7A8',
  accentStrong: '#3DB893',
  accentMuted: 'rgba(95, 199, 168, 0.16)',
  mint: '#9BE0CF',
  gold: '#F4C97D',
  success: '#46C295',
  danger: '#FF8A8A',
  input: '#EDF9F4',
  overlay: 'rgba(255, 255, 255, 0.72)',
  scrim: 'rgba(16, 38, 32, 0.55)',
  onAccent: '#063127',
  dotInactive: 'rgba(22, 48, 42, 0.18)',
  white: '#FFFFFF',
  transparent: 'transparent',
};

/** Soft lavender / periwinkle. */
const lavender: Palette = {
  background: '#F7F5FE',
  backgroundDeep: '#EAE6FB',
  surface: '#FFFFFF',
  surfaceStrong: '#EEEAFB',
  surfaceMuted: '#F2EFFC',
  border: 'rgba(38, 32, 56, 0.08)',
  text: '#272233',
  textMuted: '#8E89A0',
  textSoft: '#544E66',
  accent: '#A99BF5',
  accentStrong: '#8B7CF0',
  accentMuted: 'rgba(169, 155, 245, 0.18)',
  mint: '#8FD9D6',
  gold: '#F6C97E',
  success: '#62C7A6',
  danger: '#FF8A9A',
  input: '#F2EFFC',
  overlay: 'rgba(255, 255, 255, 0.72)',
  scrim: 'rgba(28, 22, 44, 0.55)',
  onAccent: '#1B1340',
  dotInactive: 'rgba(38, 32, 56, 0.18)',
  white: '#FFFFFF',
  transparent: 'transparent',
};

export const themes = { blush, mint, lavender } as const;

export type ThemeName = keyof typeof themes;

/** Display order for the theme switcher. */
export const themeNames: ThemeName[] = ['blush', 'mint', 'lavender'];

export const themeLabels: Record<ThemeName, { en: string; he: string }> = {
  blush: { en: 'Blush', he: 'ורוד' },
  mint: { en: 'Mint', he: 'מנטה' },
  lavender: { en: 'Lavender', he: 'לבנדר' },
};

export const defaultThemeName: ThemeName = 'blush';

/**
 * Default palette for any non-component code that imports `colors` directly.
 * Components should prefer `useTheme()` so they react to palette switches.
 */
export const colors: Palette = themes[defaultThemeName];

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
    shadowColor: '#2A2230',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 12,
    },
  },
  android: {
    elevation: 6,
  },
  default: {},
});
