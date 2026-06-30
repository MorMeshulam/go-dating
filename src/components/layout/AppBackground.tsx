import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Palette } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';

export function AppBackground({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.root}>
      <View style={[styles.orb, styles.orbPrimary]} />
      <View style={[styles.orb, styles.orbSecondary]} />
      <View style={[styles.orb, styles.orbTertiary]} />
      {children}
    </View>
  );
}

const getStyles = (colors: Palette) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
      overflow: 'hidden',
    },
    orb: {
      position: 'absolute',
      borderRadius: 999,
    },
    orbPrimary: {
      backgroundColor: colors.accent,
      opacity: 0.18,
      height: 260,
      right: -50,
      top: -40,
      width: 260,
    },
    orbSecondary: {
      backgroundColor: colors.mint,
      opacity: 0.16,
      bottom: 180,
      height: 240,
      left: -80,
      width: 240,
    },
    orbTertiary: {
      backgroundColor: colors.gold,
      opacity: 0.14,
      height: 180,
      right: 80,
      top: 260,
      width: 180,
    },
  });
