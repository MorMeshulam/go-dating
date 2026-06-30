import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import type { Palette } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';

/**
 * Brand compass: fades and slides up on mount, with a needle that gently
 * sways — a calm "finding your direction" motif for DateRight. Built on the
 * Animated API so it needs no third-party animation/SVG packages.
 */
export function CompassLogo({ size = 108 }: { size?: number }) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors, size), [colors, size]);

  const entrance = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(sway, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => loop.stop();
  }, [entrance, sway]);

  const translateY = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  const rotate = sway.interpolate({
    inputRange: [0, 1],
    outputRange: ['-12deg', '12deg'],
  });

  return (
    <Animated.View
      style={[styles.wrap, { opacity: entrance, transform: [{ translateY }] }]}
    >
      <View style={styles.ring}>
        <View style={[styles.tick, styles.tickNorth]} />
        <View style={[styles.tick, styles.tickMuted, styles.tickSouth]} />
        <View style={[styles.tick, styles.tickMuted, styles.tickEast]} />
        <View style={[styles.tick, styles.tickMuted, styles.tickWest]} />

        <Animated.View style={[styles.needle, { transform: [{ rotate }] }]}>
          <View style={styles.needleNorth} />
          <View style={styles.needleSouth} />
        </Animated.View>

        <View style={styles.hub} />
      </View>
    </Animated.View>
  );
}

const getStyles = (colors: Palette, size: number) => {
  const half = size / 2;
  const needleLen = size * 0.3;
  const needleBase = size * 0.11;
  const hub = size * 0.16;
  const tick = size * 0.05;

  return StyleSheet.create({
    wrap: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    ring: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.accent,
      borderRadius: half,
      borderWidth: 2,
      height: size,
      justifyContent: 'center',
      shadowColor: colors.accentStrong,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 18,
      width: size,
    },
    tick: {
      backgroundColor: colors.accent,
      borderRadius: tick,
      height: tick,
      position: 'absolute',
      width: tick,
    },
    tickMuted: {
      backgroundColor: colors.border,
    },
    tickNorth: {
      top: tick * 1.6,
    },
    tickSouth: {
      bottom: tick * 1.6,
    },
    tickEast: {
      right: tick * 1.6,
    },
    tickWest: {
      left: tick * 1.6,
    },
    needle: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    needleNorth: {
      borderBottomColor: colors.accentStrong,
      borderBottomWidth: needleLen,
      borderLeftColor: colors.transparent,
      borderLeftWidth: needleBase,
      borderRightColor: colors.transparent,
      borderRightWidth: needleBase,
      height: 0,
      width: 0,
    },
    needleSouth: {
      borderLeftColor: colors.transparent,
      borderLeftWidth: needleBase,
      borderRightColor: colors.transparent,
      borderRightWidth: needleBase,
      borderTopColor: colors.textMuted,
      borderTopWidth: needleLen,
      height: 0,
      width: 0,
    },
    hub: {
      backgroundColor: colors.surface,
      borderColor: colors.accent,
      borderRadius: hub / 2,
      borderWidth: 2,
      height: hub,
      position: 'absolute',
      width: hub,
    },
  });
};
