import React, { useMemo } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import { radii, spacing } from '../../theme';
import type { Palette } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: ButtonVariant;
};

export function Button({
  disabled = false,
  label,
  onPress,
  style,
  variant = 'primary',
}: ButtonProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
    </Pressable>
  );
}

const getStyles = (colors: Palette) =>
  StyleSheet.create({
    base: {
      alignItems: 'center',
      borderRadius: radii.md,
      justifyContent: 'center',
      minHeight: 54,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    disabled: {
      opacity: 0.45,
    },
    ghost: {
      backgroundColor: colors.transparent,
    },
    ghostLabel: {
      color: colors.textSoft,
    },
    label: {
      fontSize: 15,
      fontWeight: '800',
      letterSpacing: 0.2,
    },
    pressed: {
      opacity: 0.86,
    },
    primary: {
      backgroundColor: colors.accent,
    },
    primaryLabel: {
      color: colors.onAccent,
    },
    secondary: {
      backgroundColor: colors.surfaceStrong,
      borderColor: colors.border,
      borderWidth: 1,
    },
    secondaryLabel: {
      color: colors.text,
    },
  });
