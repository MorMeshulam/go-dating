import React from 'react';

import { AuthProvider } from '../state/auth/AuthContext';
import { AppPreferencesProvider } from '../state/preferences/AppPreferencesContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppPreferencesProvider>
      <AuthProvider>{children}</AuthProvider>
    </AppPreferencesProvider>
  );
}
