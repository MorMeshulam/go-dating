import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '../../theme';

export function AppBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.root}>
      <View style={[styles.orb, styles.orbPrimary]} />
      <View style={[styles.orb, styles.orbSecondary]} />
      <View style={[styles.orb, styles.orbTertiary]} />
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
    backgroundColor: 'rgba(232, 53, 106, 0.13)',
    height: 300,
    right: -70,
    top: -60,
    width: 300,
  },
  orbSecondary: {
    backgroundColor: 'rgba(191, 63, 138, 0.09)',
    bottom: 160,
    height: 260,
    left: -90,
    width: 260,
  },
  orbTertiary: {
    backgroundColor: 'rgba(255, 160, 190, 0.11)',
    height: 200,
    right: 60,
    top: 300,
    width: 200,
  },
});
