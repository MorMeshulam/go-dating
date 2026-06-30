import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CompassLogo } from '../../components/brand/CompassLogo';
import { AppScreen } from '../../components/layout/AppScreen';
import { ThemeSwitcher } from '../../components/ui/ThemeSwitcher';
import { copy } from '../../content/copy';
import { useAppPreferences } from '../../state/preferences/AppPreferencesContext';
import type { Palette } from '../../theme';
import { radii, shadows, spacing, typeScale } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import type { Locale } from '../../types/common';

const languageOptions: Array<{ id: Locale; flag: string; label: string }> = [
  { id: 'en', flag: '🇬🇧', label: 'English' },
  { id: 'he', flag: '🇮🇱', label: 'עברית' },
];

export function LanguageSelectionScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const { setLocale } = useAppPreferences();

  return (
    <AppScreen scroll={false} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <CompassLogo size={112} />
        <Text style={styles.brand}>{copy.appName.en}</Text>
        <Text style={styles.tagline}>{copy.appTagline.en}</Text>
        <Text style={styles.taglineAlt}>{copy.appTagline.he}</Text>
      </View>

      <View style={styles.languageRow}>
        {languageOptions.map(option => (
          <Pressable
            key={option.id}
            onPress={() => setLocale(option.id)}
            style={({ pressed }) => [
              styles.languageButton,
              pressed && styles.languageButtonPressed,
            ]}
          >
            <Text style={styles.flag}>{option.flag}</Text>
            <Text style={styles.languageLabel}>{option.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.themeBlock}>
        <Text style={styles.themeLabel}>{copy.languageGate.themeLabel}</Text>
        <ThemeSwitcher />
      </View>
    </AppScreen>
  );
}

const getStyles = (colors: Palette) =>
  StyleSheet.create({
    content: {
      alignItems: 'center',
      gap: spacing.xxl,
      justifyContent: 'center',
    },
    hero: {
      alignItems: 'center',
      gap: spacing.sm,
    },
    brand: {
      color: colors.text,
      fontSize: 40,
      fontWeight: '800',
      letterSpacing: -1.2,
      marginTop: spacing.lg,
    },
    tagline: {
      color: colors.textSoft,
      fontSize: typeScale.body,
      paddingHorizontal: spacing.lg,
      textAlign: 'center',
    },
    taglineAlt: {
      color: colors.textMuted,
      fontSize: typeScale.caption,
      paddingHorizontal: spacing.lg,
      textAlign: 'center',
      writingDirection: 'rtl',
    },
    languageRow: {
      flexDirection: 'row',
      gap: spacing.md,
      width: '100%',
    },
    languageButton: {
      ...shadows,
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radii.lg,
      borderWidth: 1,
      flex: 1,
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
    },
    languageButtonPressed: {
      opacity: 0.85,
    },
    flag: {
      fontSize: 36,
    },
    languageLabel: {
      color: colors.text,
      fontSize: typeScale.subtitle,
      fontWeight: '800',
    },
    themeBlock: {
      alignItems: 'center',
      gap: spacing.md,
    },
    themeLabel: {
      color: colors.textMuted,
      fontSize: typeScale.caption,
      fontWeight: '800',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
  });
