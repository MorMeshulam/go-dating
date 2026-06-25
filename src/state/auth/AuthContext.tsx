import React, { createContext, useContext, useMemo, useState } from 'react';

import type { ProfileAnswerMap } from '../../features/onboarding/types';

type AuthScreenMode = 'login' | 'register';

type AuthContextValue = {
  authScreenMode: AuthScreenMode;
  completeProfile: (answers: ProfileAnswerMap) => void;
  editProfile: () => void;
  hasCompletedProfile: boolean;
  isAuthenticated: boolean;
  loginMock: () => void;
  logout: () => void;
  profileAnswers: ProfileAnswerMap;
  registerMock: () => void;
  showLogin: () => void;
  showRegister: () => void;
};

const initialProfileAnswers: ProfileAnswerMap = {
  age_band: '29_35',
  dating_pace: 'pace_open_but_careful',
  first_date_style: 'date_coffee_walk',
  gender_identity: 'woman',
  hard_boundaries: ['boundary_respect_pace', 'boundary_no_socials_first'],
  privacy_reveal_mode: 'reveal_mutual_yes',
  profile_alias: 'north_echo',
  relationship_goal: ['goal_long_term'],
  seeking_genders: ['seek_men'],
  self_summary: '',
  top_values: ['value_honesty', 'value_calm_communication'],
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authScreenMode, setAuthScreenMode] = useState<AuthScreenMode>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);
  const [profileAnswers, setProfileAnswers] =
    useState<ProfileAnswerMap>(initialProfileAnswers);

  const value = useMemo<AuthContextValue>(
    () => ({
      authScreenMode,
      completeProfile: (answers) => {
        setProfileAnswers(answers);
        setHasCompletedProfile(true);
      },
      editProfile: () => {
        setHasCompletedProfile(false);
      },
      hasCompletedProfile,
      isAuthenticated,
      loginMock: () => {
        setIsAuthenticated(true);
      },
      logout: () => {
        setIsAuthenticated(false);
        setAuthScreenMode('login');
      },
      profileAnswers,
      registerMock: () => {
        setIsAuthenticated(true);
      },
      showLogin: () => {
        setAuthScreenMode('login');
      },
      showRegister: () => {
        setAuthScreenMode('register');
      },
    }),
    [authScreenMode, hasCompletedProfile, isAuthenticated, profileAnswers],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
