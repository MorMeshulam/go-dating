import React from 'react';

import { AuthProvider } from '../state/auth/AuthContext';
import { AppPreferencesProvider } from '../state/preferences/AppPreferencesContext';
import { ThemeProvider } from '../theme/ThemeContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppPreferencesProvider>
        <AuthProvider>{children}</AuthProvider>
      </AppPreferencesProvider>
    </ThemeProvider>
  );
}
