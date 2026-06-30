---
name: state-management
description: Two React Context providers, no persistence, no Zustand; all data is in-memory mock
metadata:
  type: project
---

State is split across two React Context providers composed in `src/app/AppProviders.tsx`:

**AppPreferencesContext** (`src/state/preferences/AppPreferencesContext.tsx`):
- `locale: 'en' | 'he'` (default 'en')
- `hasSelectedLocale: boolean` (default false)
- `isRTL: boolean` (derived: locale === 'he')
- Hook: `useAppPreferences()`

**AuthContext** (`src/state/auth/AuthContext.tsx`):
- `isAuthenticated: boolean` (default false)
- `hasCompletedProfile: boolean` (default false)
- `authScreenMode: 'login' | 'register'` (default 'login')
- `profileAnswers: ProfileAnswerMap` (seed data pre-populated for dev)
- Hook: `useAuth()`
- `loginMock()` and `registerMock()` both just set `isAuthenticated: true`

No persistence layer exists. App restart resets everything. No AsyncStorage, MMKV, or SecureStore.

No Zustand, no Redux, no external state library. The plan is likely Zustand for future features.

**How to apply:** Any feature that needs to survive app restart must add a persistence layer first. Don't write code that assumes persisted state.
