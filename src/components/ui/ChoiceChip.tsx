import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { radii, spacing } from '../../theme';
import type { Palette } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';

type ChoiceChipProps = {
  isRTL?: boolean;
  label: string;
  onPress: () => void;
  selected?: boolean;
};

export function ChoiceChip({
  isRTL = false,
  label,
  onPress,
  selected = false,
}: ChoiceChipProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.label,
          selected && styles.labelSelected,
          isRTL && styles.textRtl,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const getStyles = (colors: Palette) =>
  StyleSheet.create({
    base: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderColor: colors.border,
      borderRadius: radii.pill,
      borderWidth: 1,
      marginBottom: spacing.sm,
      marginRight: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
    },
    label: {
      color: colors.textSoft,
      fontSize: 13,
      fontWeight: '700',
    },
    labelSelected: {
      color: colors.background,
    },
    pressed: {
      opacity: 0.86,
    },
    selected: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    textRtl: {
      textAlign: 'right',
      writingDirection: 'rtl',
    },
  });
