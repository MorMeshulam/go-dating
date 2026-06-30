import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { radii, spacing } from '../../theme';
import type { Palette } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';

type TextFieldProps = TextInputProps & {
  isRTL?: boolean;
  label: string;
};

export function TextField({
  isRTL = false,
  label,
  multiline = false,
  ...rest
}: TextFieldProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, isRTL && styles.textRtl]}>{label}</Text>
      <TextInput
        multiline={multiline}
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          isRTL && styles.textRtl,
        ]}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...rest}
      />
    </View>
  );
}

const getStyles = (colors: Palette) =>
  StyleSheet.create({
    input: {
      backgroundColor: colors.input,
      borderColor: colors.border,
      borderRadius: radii.md,
      borderWidth: 1,
      color: colors.text,
      fontSize: 15,
      minHeight: 54,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    inputMultiline: {
      minHeight: 140,
    },
    label: {
      color: colors.textSoft,
      fontSize: 13,
      fontWeight: '700',
      marginBottom: spacing.sm,
    },
    textRtl: {
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    wrapper: {
      marginBottom: spacing.md,
    },
  });
