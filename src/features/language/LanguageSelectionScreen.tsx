import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppScreen } from '../../components/layout/AppScreen';
import { copy } from '../../content/copy';
import { useAppPreferences } from '../../state/preferences/AppPreferencesContext';
import { colors, radii, shadows, spacing, typeScale } from '../../theme';
import type { Locale } from '../../types/common';

const languageCards: Array<{
  id: Locale;
  subtitle: string;
  title: string;
}> = [
  {
    id: 'en',
    subtitle: 'Continue in English',
    title: 'English',
  },
  {
    id: 'he',
    subtitle: 'המשך/י בעברית',
    title: 'עברית',
  },
];

export function LanguageSelectionScreen() {
  const { setLocale } = useAppPreferences();

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>FIRST STEP</Text>
        <Text style={styles.title}>{copy.languageGate.title}</Text>
        <Text style={styles.description}>{copy.languageGate.description}</Text>
      </View>

      <View style={styles.cardList}>
        {languageCards.map((languageCard) => (
          <Pressable
            key={languageCard.id}
            onPress={() => setLocale(languageCard.id)}
            style={({ pressed }) => [
              styles.languageCard,
              pressed && styles.languageCardPressed,
            ]}
          >
            <Text style={styles.languageTitle}>{languageCard.title}</Text>
            <Text style={styles.languageSubtitle}>{languageCard.subtitle}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.note}>{copy.languageGate.note}</Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  cardList: {
    gap: spacing.md,
  },
  content: {
    gap: spacing.xl,
    justifyContent: 'center',
    paddingTop: spacing.xl,
  },
  description: {
    color: colors.textSoft,
    fontSize: typeScale.body,
    lineHeight: 23,
  },
  eyebrow: {
    color: colors.mint,
    fontSize: typeScale.caption,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  heroCard: {
    backgroundColor: colors.overlay,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: spacing.xl,
  },
  languageCard: {
    ...shadows,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    minHeight: 118,
    padding: spacing.xl,
  },
  languageCardPressed: {
    opacity: 0.86,
  },
  languageSubtitle: {
    color: colors.textMuted,
    fontSize: typeScale.body,
    lineHeight: 22,
  },
  languageTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginBottom: spacing.xs,
  },
  note: {
    color: colors.gold,
    fontSize: typeScale.caption,
    fontWeight: '700',
    lineHeight: 18,
  },
  title: {
    color: colors.text,
    fontSize: typeScale.hero,
    fontWeight: '800',
    letterSpacing: -1.1,
    lineHeight: 40,
    marginBottom: spacing.sm,
  },
});
