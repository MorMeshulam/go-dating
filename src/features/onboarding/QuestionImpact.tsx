import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { copy } from '../../content/copy';
import { useAppPreferences } from '../../state/preferences/AppPreferencesContext';
import type { Palette } from '../../theme';
import { radii, spacing, typeScale } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';

type MatchingWeight = 'low' | 'medium' | 'high';

const levelByWeight: Record<MatchingWeight, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

/**
 * Shows how much a question influences matching, so members can tell the
 * high-stakes steps from the lighter ones. Derived from `matchingWeight`.
 */
export function QuestionImpact({ weight }: { weight: MatchingWeight }) {
  const { colors } = useTheme();
  const { isRTL, locale } = useAppPreferences();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const level = levelByWeight[weight];
  const isKey = weight === 'high';

  return (
    <View
      style={[styles.pill, isKey && styles.pillKey, isRTL && styles.pillRtl]}
    >
      {isKey ? <Text style={styles.star}>★</Text> : null}
      <View style={styles.meter}>
        {[0, 1, 2].map(index => (
          <View
            key={index}
            style={[styles.dot, index < level && styles.dotOn]}
          />
        ))}
      </View>
      <Text style={[styles.label, isKey && styles.labelKey]}>
        {copy.onboarding.impact[weight][locale]}
      </Text>
    </View>
  );
}

const getStyles = (colors: Palette) =>
  StyleSheet.create({
    pill: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: colors.surfaceStrong,
      borderRadius: radii.pill,
      flexDirection: 'row',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: 7,
    },
    pillKey: {
      backgroundColor: colors.accentMuted,
    },
    pillRtl: {
      flexDirection: 'row-reverse',
    },
    star: {
      color: colors.accentStrong,
      fontSize: typeScale.caption,
    },
    meter: {
      flexDirection: 'row',
      gap: 3,
    },
    dot: {
      backgroundColor: colors.border,
      borderRadius: 999,
      height: 6,
      width: 6,
    },
    dotOn: {
      backgroundColor: colors.accent,
    },
    label: {
      color: colors.textSoft,
      fontSize: typeScale.caption,
      fontWeight: '800',
    },
    labelKey: {
      color: colors.accentStrong,
    },
  });
