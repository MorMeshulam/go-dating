import React, { createContext, useContext, useMemo, useState } from 'react';

import type { Locale } from '../../types/common';

type AppPreferencesContextValue = {
  hasSelectedLocale: boolean;
  isRTL: boolean;
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(
  null,
);

export function AppPreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasSelectedLocale, setHasSelectedLocale] = useState(false);
  const [locale, setLocale] = useState<Locale>('en');

  const value = useMemo<AppPreferencesContextValue>(
    () => ({
      hasSelectedLocale,
      isRTL: locale === 'he',
      locale,
      setLocale: (nextLocale) => {
        setLocale(nextLocale);
        setHasSelectedLocale(true);
      },
    }),
    [hasSelectedLocale, locale],
  );

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  );
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);

  if (!context) {
    throw new Error('useAppPreferences must be used within AppPreferencesProvider');
  }

  return context;
}
