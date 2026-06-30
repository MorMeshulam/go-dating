import React, { createContext, useContext, useMemo, useState } from 'react';

import type {
  ProfileAnswerMap,
  RoutingResult,
} from '../../features/onboarding/types';

type AuthScreenMode = 'login' | 'register';

type CompleteProfileInput = {
  routing: RoutingResult;
  stage1Answers: ProfileAnswerMap;
  stage2Answers: ProfileAnswerMap;
};

type AuthContextValue = {
  authScreenMode: AuthScreenMode;
  completeProfile: (input: CompleteProfileInput) => void;
  dismissPricing: () => void;
  editProfile: () => void;
  hasCompletedProfile: boolean;
  hasSeenPricing: boolean;
  isAuthenticated: boolean;
  loginMock: () => void;
  logout: () => void;
  profileAnswers: ProfileAnswerMap;
  registerMock: () => void;
  routing: RoutingResult | null;
  showLogin: () => void;
  showRegister: () => void;
  stage1Answers: ProfileAnswerMap;
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
  const [hasSeenPricing, setHasSeenPricing] = useState(false);
  const [profileAnswers, setProfileAnswers] =
    useState<ProfileAnswerMap>(initialProfileAnswers);
  const [stage1Answers, setStage1Answers] = useState<ProfileAnswerMap>({});
  const [routing, setRouting] = useState<RoutingResult | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      authScreenMode,
      completeProfile: ({ routing: nextRouting, stage1Answers: nextStage1, stage2Answers }) => {
        setStage1Answers(nextStage1);
        setRouting(nextRouting);
        setProfileAnswers(stage2Answers);
        setHasCompletedProfile(true);
      },
      dismissPricing: () => {
        setHasSeenPricing(true);
      },
      editProfile: () => {
        setHasCompletedProfile(false);
      },
      hasCompletedProfile,
      hasSeenPricing,
      isAuthenticated,
      loginMock: () => {
        setIsAuthenticated(true);
      },
      logout: () => {
        setIsAuthenticated(false);
        setAuthScreenMode('login');
        setHasSeenPricing(false);
      },
      profileAnswers,
      registerMock: () => {
        setIsAuthenticated(true);
      },
      routing,
      showLogin: () => {
        setAuthScreenMode('login');
      },
      showRegister: () => {
        setAuthScreenMode('register');
      },
      stage1Answers,
    }),
    [
      authScreenMode,
      hasCompletedProfile,
      hasSeenPricing,
      isAuthenticated,
      profileAnswers,
      routing,
      stage1Answers,
    ],
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
