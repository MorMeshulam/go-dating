import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '../../theme';

export function AppBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.root}>
      <View style={[styles.orb, styles.orbPrimary]} />
      <View style={[styles.orb, styles.orbSecondary]} />
      <View style={[styles.orb, styles.orbTertiary]} />
      <View style={styles.overlay} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(255, 139, 103, 0.20)',
    height: 260,
    right: -50,
    top: -40,
    width: 260,
  },
  orbSecondary: {
    backgroundColor: 'rgba(123, 224, 197, 0.13)',
    bottom: 180,
    height: 240,
    left: -80,
    width: 240,
  },
  orbTertiary: {
    backgroundColor: 'rgba(255, 210, 125, 0.10)',
    height: 180,
    right: 80,
    top: 260,
    width: 180,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(8, 19, 29, 0.58)',
  },
});
