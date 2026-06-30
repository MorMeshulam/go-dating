import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Palette } from '../../theme';
import { themeNames, themes } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';

/** Row of palette swatches that switches the whole app theme on tap. */
export function ThemeSwitcher() {
  const { colors, themeName, setThemeName } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      {themeNames.map(name => {
        const isSelected = name === themeName;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            key={name}
            onPress={() => setThemeName(name)}
            style={[styles.swatch, isSelected && styles.swatchSelected]}
          >
            <View
              style={[styles.dot, { backgroundColor: themes[name].accent }]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const getStyles = (colors: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    swatch: {
      alignItems: 'center',
      borderColor: colors.transparent,
      borderRadius: 999,
      borderWidth: 2,
      height: 40,
      justifyContent: 'center',
      width: 40,
    },
    swatchSelected: {
      borderColor: colors.text,
    },
    dot: {
      borderRadius: 999,
      height: 24,
      width: 24,
    },
  });
