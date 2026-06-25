import { Platform } from 'react-native';

export const colors = {
  background: '#08131D',
  backgroundDeep: '#102231',
  surface: '#13293A',
  surfaceStrong: '#17374A',
  surfaceMuted: '#0E1F2D',
  border: 'rgba(255, 255, 255, 0.10)',
  text: '#F6F8FB',
  textMuted: '#A9C2D0',
  textSoft: '#DCE8EE',
  accent: '#FF8B67',
  accentStrong: '#FF7043',
  accentMuted: 'rgba(255, 139, 103, 0.18)',
  mint: '#7BE0C5',
  gold: '#FFD27D',
  success: '#70D5AE',
  danger: '#FF7B7B',
  input: '#0A1B28',
  overlay: 'rgba(6, 12, 18, 0.72)',
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
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },
  android: {
    elevation: 8,
  },
  default: {},
});
