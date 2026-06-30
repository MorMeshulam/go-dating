---
name: project-snapshot
description: File inventory and module roles for go-dating as of 2026-06-29 full codebase audit
metadata:
  type: project
---

Full codebase audit completed 2026-06-29. Summary of every module's role:

**Entry points:**
- `index.js` — AppRegistry.registerComponent, registers 'AnonymousMatchApp'
- `App.tsx` — SafeAreaProvider + StatusBar + AppProviders + AppShell

**App shell:**
- `src/app/AppProviders.tsx` — composes AppPreferencesProvider wrapping AuthProvider
- `src/app/AppShell.tsx` — thin wrapper rendering RootNavigator

**Navigation:**
- `src/navigation/RootNavigator.tsx` — conditional render (NOT React Navigation)

**State:**
- `src/state/preferences/AppPreferencesContext.tsx` — locale, isRTL, hasSelectedLocale
- `src/state/auth/AuthContext.tsx` — auth flags, profile answers, mock auth functions

**Screens (4 total):**
- `src/features/language/LanguageSelectionScreen.tsx` — first-run locale picker
- `src/features/auth/AuthEntryScreen.tsx` — login/register (mock)
- `src/features/onboarding/ProfileFlowScreen.tsx` — 11-step questionnaire wizard (modified in git)
- `src/features/home/HomeScreen.tsx` — dashboard with mock matches

**Domain logic:**
- `src/features/onboarding/questionBank.ts` — question lookup and formatting utilities
- `src/features/onboarding/types.ts` — TypeScript types for question bank
- `src/features/discovery/matchmaking.ts` — local scoring against 3 mock candidates

**Content:**
- `src/content/copy.ts` — all bilingual UI strings as typed const object
- `src/content/profile-question-bank.v1.json` — 22 questions / 8 sections

**Components:**
- `src/components/layout/AppScreen.tsx` — SafeAreaView + KeyboardAvoiding + ScrollView
- `src/components/layout/AppBackground.tsx` — orb background + dark overlay
- `src/components/ui/Button.tsx` — primary / secondary / ghost
- `src/components/ui/TextField.tsx` — labeled input with RTL
- `src/components/ui/ChoiceChip.tsx` — selectable pill

**Theme:**
- `src/theme/index.ts` — colors, spacing, radii, typeScale, shadows

**Types:**
- `src/types/common.ts` — Locale ('en'|'he'), LocalizedText

**Tests:**
- `__tests__/App.test.tsx` — single smoke test (renders without crashing)

**Why:** Snapshot taken to give future sessions a quick reference without re-reading every file.

**How to apply:** Use this as a quick file lookup. Always verify current state with actual file reads before making changes.
