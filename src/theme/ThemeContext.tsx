import React, { createContext, useContext, useMemo, useState } from 'react';

import { defaultThemeName, themes } from './index';
import type { Palette, ThemeName } from './index';

type ThemeContextValue = {
  themeName: ThemeName;
  colors: Palette;
  setThemeName: (name: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>(defaultThemeName);

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeName,
      colors: themes[themeName],
      setThemeName,
    }),
    [themeName],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}
