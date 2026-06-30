import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../../components/layout/AppScreen';
import { Button } from '../../components/ui/Button';
import { copy } from '../../content/copy';
import { useAppPreferences } from '../../state/preferences/AppPreferencesContext';
import type { Palette } from '../../theme';
import { radii, spacing, typeScale } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';

export type MilestoneVariant = 'routed' | 'done';

type MilestoneScreenProps = {
  variant: MilestoneVariant;
  /** Routed profile label, shown as a chip on the 'routed' milestone. */
  profileLabel?: string | null;
  onContinue: () => void;
};

/**
 * Celebratory interstitial shown at a phase boundary so members feel the
 * progress they've made before moving on.
 */
export function MilestoneScreen({
  variant,
  profileLabel,
  onContinue,
}: MilestoneScreenProps) {
  const { colors } = useTheme();
  const { isRTL, locale } = useAppPreferences();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const isRouted = variant === 'routed';
  const eyebrow = isRouted
    ? copy.onboarding.milestone.routedEyebrow[locale]
    : copy.onboarding.milestone.doneEyebrow[locale];
  const title = isRouted
    ? copy.onboarding.milestone.routedTitle[locale]
    : copy.onboarding.milestone.doneTitle[locale];
  const body = isRouted
    ? copy.onboarding.milestone.routedBody[locale]
    : copy.onboarding.milestone.doneBody[locale];
  const cta = isRouted
    ? copy.common.next[locale]
    : copy.onboarding.milestone.seeProfile[locale];

  return (
    <AppScreen scroll={false} contentContainerStyle={styles.content}>
      <View style={styles.center}>
        <SuccessMark />
        <Text style={[styles.eyebrow, isRTL && styles.textRtl]}>{eyebrow}</Text>
        <Text style={[styles.title, isRTL && styles.textRtl]}>{title}</Text>
        {isRouted && profileLabel ? (
          <View style={styles.profileChip}>
            <Text style={styles.profileChipText}>{profileLabel}</Text>
          </View>
        ) : null}
        <Text style={[styles.body, isRTL && styles.textRtl]}>{body}</Text>
      </View>

      <View style={styles.footer}>
        <Button label={cta} onPress={onContinue} />
      </View>
    </AppScreen>
  );
}

function SuccessMark() {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <Animated.View style={[styles.mark, { transform: [{ scale }] }]}>
      <Text style={styles.markCheck}>✓</Text>
    </Animated.View>
  );
}

const getStyles = (colors: Palette) =>
  StyleSheet.create({
    content: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: spacing.xl,
    },
    center: {
      alignItems: 'center',
      flex: 1,
      gap: spacing.md,
      justifyContent: 'center',
    },
    mark: {
      alignItems: 'center',
      backgroundColor: colors.accent,
      borderRadius: 999,
      height: 96,
      justifyContent: 'center',
      marginBottom: spacing.md,
      shadowColor: colors.accentStrong,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.35,
      shadowRadius: 20,
      width: 96,
    },
    markCheck: {
      color: colors.onAccent,
      fontSize: 48,
      fontWeight: '900',
      lineHeight: 54,
    },
    eyebrow: {
      color: colors.accentStrong,
      fontSize: typeScale.caption,
      fontWeight: '800',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    title: {
      color: colors.text,
      fontSize: typeScale.hero,
      fontWeight: '800',
      letterSpacing: -1,
      textAlign: 'center',
    },
    profileChip: {
      backgroundColor: colors.accentMuted,
      borderRadius: radii.pill,
      paddingHorizontal: spacing.md,
      paddingVertical: 8,
    },
    profileChipText: {
      color: colors.accentStrong,
      fontSize: typeScale.body,
      fontWeight: '800',
    },
    body: {
      color: colors.textMuted,
      fontSize: typeScale.body,
      lineHeight: 23,
      paddingHorizontal: spacing.lg,
      textAlign: 'center',
    },
    textRtl: {
      writingDirection: 'rtl',
    },
    footer: {
      paddingBottom: spacing.sm,
      paddingTop: spacing.md,
    },
  });
