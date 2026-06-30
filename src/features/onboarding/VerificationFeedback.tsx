import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { copy } from '../../content/copy';
import { useAppPreferences } from '../../state/preferences/AppPreferencesContext';
import type { Palette } from '../../theme';
import { radii, spacing, typeScale } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import type { VerificationIssueCode, VerificationVerdict } from '../../agents';

// Most-telling issue first, so a single compact line stays useful.
const issuePriority: VerificationIssueCode[] = [
  'gibberish',
  'too_few_words',
  'too_short',
  'low_variety',
  'too_long',
];

type VerificationFeedbackProps = {
  verdict: VerificationVerdict;
  attempts: number;
  maxAttempts: number;
};

export function VerificationFeedback({
  verdict,
  attempts,
  maxAttempts,
}: VerificationFeedbackProps) {
  const { colors } = useTheme();
  const { isRTL, locale } = useAppPreferences();
  const styles = useMemo(() => getStyles(colors), [colors]);

  if (verdict.status === 'approved') {
    return null;
  }

  if (verdict.status === 'blocked') {
    return (
      <View style={[styles.panel, styles.panelBlocked]}>
        <Text style={[styles.title, isRTL && styles.textRtl]}>
          {copy.onboarding.verification.blockedTitle[locale]}
        </Text>
        <Text style={[styles.body, isRTL && styles.textRtl]}>
          {copy.onboarding.verification.blockedBody[locale]}
        </Text>
      </View>
    );
  }

  const topIssue =
    issuePriority.find(code => verdict.issues.includes(code)) ??
    verdict.issues[0];

  return (
    <View style={[styles.panel, styles.panelWarn]}>
      <View style={[styles.header, isRTL && styles.rowRtl]}>
        <Text style={[styles.title, isRTL && styles.textRtl]}>
          {copy.onboarding.verification.needsTitle[locale]}
        </Text>
        <Text style={styles.counter}>
          {copy.onboarding.verification.attempt[locale]} {attempts}/
          {maxAttempts}
        </Text>
      </View>
      {topIssue ? (
        <Text style={[styles.body, isRTL && styles.textRtl]}>
          {copy.onboarding.verification.issues[topIssue][locale]}
        </Text>
      ) : null}
    </View>
  );
}

const getStyles = (colors: Palette) =>
  StyleSheet.create({
    panel: {
      borderRadius: radii.md,
      gap: spacing.xs,
      marginTop: spacing.md,
      padding: spacing.md,
    },
    panelWarn: {
      backgroundColor: colors.accentMuted,
    },
    panelBlocked: {
      backgroundColor: colors.surfaceStrong,
      borderColor: colors.gold,
      borderWidth: 1,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    rowRtl: {
      flexDirection: 'row-reverse',
    },
    title: {
      color: colors.text,
      fontSize: typeScale.body,
      fontWeight: '800',
    },
    counter: {
      color: colors.textMuted,
      fontSize: typeScale.caption,
      fontWeight: '800',
    },
    body: {
      color: colors.textSoft,
      fontSize: typeScale.caption,
      lineHeight: 18,
    },
    textRtl: {
      textAlign: 'right',
      writingDirection: 'rtl',
    },
  });
