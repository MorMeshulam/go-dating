import React from 'react';

import { AuthEntryScreen } from '../features/auth/AuthEntryScreen';
import { HomeScreen } from '../features/home/HomeScreen';
import { LanguageSelectionScreen } from '../features/language/LanguageSelectionScreen';
import { ProfileFlowScreen } from '../features/onboarding/ProfileFlowScreen';
import { useAuth } from '../state/auth/AuthContext';
import { useAppPreferences } from '../state/preferences/AppPreferencesContext';

export function RootNavigator() {
  const { hasSelectedLocale } = useAppPreferences();
  const { authScreenMode, hasCompletedProfile, isAuthenticated } = useAuth();

  if (!hasSelectedLocale) {
    return <LanguageSelectionScreen />;
  }

  if (!isAuthenticated) {
    return <AuthEntryScreen mode={authScreenMode} />;
  }

  if (!hasCompletedProfile) {
    return <ProfileFlowScreen />;
  }

  return <HomeScreen />;
}
