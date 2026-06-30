import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppScreen } from '../../components/layout/AppScreen';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { copy } from '../../content/copy';
import { useAuth } from '../../state/auth/AuthContext';
import { useAppPreferences } from '../../state/preferences/AppPreferencesContext';
import { colors, radii, shadows, spacing, typeScale } from '../../theme';

type AuthEntryScreenProps = {
  mode: 'login' | 'register';
};

export function AuthEntryScreen({ mode }: AuthEntryScreenProps) {
  const { loginMock, registerMock, showLogin, showRegister } = useAuth();
  const { isRTL, locale } = useAppPreferences();
  const [email, setEmail] = useState('hello@anonymousmatch.app');
  const [password, setPassword] = useState('password');
  const [fullName, setFullName] = useState('Maya Cohen');

  const isLogin = mode === 'login';

  const title = isLogin ? copy.auth.loginTitle[locale] : copy.auth.registerTitle[locale];
  const description = isLogin
    ? copy.auth.loginDescription[locale]
    : copy.auth.registerDescription[locale];

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <View style={styles.brandBlock}>
        <Text style={[styles.brand, isRTL && styles.textRtl]}>
          {copy.appName[locale]}
        </Text>
        <Text style={[styles.tagline, isRTL && styles.textRtl]}>
          {copy.appTagline[locale]}
        </Text>
      </View>

      <View style={styles.authCard}>
        <View style={[styles.topRow, isRTL && styles.rowRtl]}>
          <View style={styles.modePill}>
            <Text style={styles.modePillLabel}>
              {isLogin ? copy.auth.loginCta[locale] : copy.auth.registerCta[locale]}
            </Text>
          </View>
          <View style={styles.mockPill}>
            <Text style={styles.mockPillLabel}>
            {copy.common.mockedAccess[locale]}
            </Text>
          </View>
        </View>

        <Text style={[styles.cardTitle, isRTL && styles.textRtl]}>{title}</Text>
        <Text style={[styles.cardDescription, isRTL && styles.textRtl]}>
          {description}
        </Text>
        {!isLogin && (
          <TextField
            isRTL={isRTL}
            label={copy.auth.fullName[locale]}
            onChangeText={setFullName}
            placeholder={copy.auth.fullName[locale]}
            value={fullName}
          />
        )}

        <TextField
          autoCapitalize="none"
          isRTL={isRTL}
          keyboardType="email-address"
          label={copy.auth.email[locale]}
          onChangeText={setEmail}
          placeholder="name@example.com"
          value={email}
        />
        <TextField
          isRTL={isRTL}
          label={copy.auth.password[locale]}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          value={password}
        />

        <Button
          label={isLogin ? copy.auth.loginCta[locale] : copy.auth.registerCta[locale]}
          onPress={isLogin ? loginMock : registerMock}
          style={styles.primaryButton}
        />

        <Button
          label={
            isLogin
              ? copy.auth.switchToRegister[locale]
              : copy.auth.switchToLogin[locale]
          }
          onPress={isLogin ? showRegister : showLogin}
          variant="ghost"
        />

        <Text style={[styles.helperText, isRTL && styles.textRtl]}>
          {copy.common.instantAccessNote[locale]}
        </Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  authCard: {
    ...shadows,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: spacing.xl,
  },
  brand: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  brandBlock: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  cardDescription: {
    color: colors.textMuted,
    fontSize: typeScale.body,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.9,
    marginBottom: spacing.xs,
  },
  content: {
    gap: spacing.md,
    justifyContent: 'center',
    paddingTop: spacing.xxl,
  },
  helperText: {
    color: colors.gold,
    fontSize: typeScale.caption,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: spacing.sm,
  },
  mockPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentMuted,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  mockPillLabel: {
    color: colors.accent,
    fontSize: typeScale.caption,
    fontWeight: '800',
  },
  modePill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  modePillLabel: {
    color: colors.textSoft,
    fontSize: typeScale.caption,
    fontWeight: '800',
  },
  primaryButton: {
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  tagline: {
    color: colors.textMuted,
    fontSize: typeScale.body,
    lineHeight: 21,
    maxWidth: 280,
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  textRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
});
