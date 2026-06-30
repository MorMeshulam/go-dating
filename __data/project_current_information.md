# Project Information — GoDating (go-dating)

_Last updated: 2026-06-29. Synthesized from full codebase read of `/Users/edenmeshulam/Documents/Eden/go-dating`._

---

## Overview

The project is an AI-powered premium matchmaking platform designed to create fewer but higher-quality and more meaningful romantic matches than traditional swipe-based dating apps. The current concept combines algorithmic matching with human review in order to improve trust, quality control, and match outcomes.

## Core Problem

The product is being positioned against the weaknesses of mainstream dating apps, which are described as creating endless swiping, low-quality matches, and user fatigue. The project assumes that a segment of users wants a more serious, curated, and trust-based relationship experience rather than a high-volume engagement product.

## Solution Positioning

The platform is positioned as a premium matchmaking layer rather than a standard dating app. Its value proposition is based on AI-assisted matching combined with human expertise so that compatibility scoring is improved by human judgment, quality review, and a more selective process.

## Product Description

The current product concept is based on a strict and structured onboarding process. Each user is expected to register, answer questions, and describe themselves to build a detailed personal profile reflecting preferences, personality, and desires. After profile creation, the system searches for a strong match using both AI analysis and human review. Once a promising match is found, the platform allows the user to send a greeting or personal letter before the date, and eventually the app coordinates a date in a place chosen by the platform.

## Product Flow

The high-trust product journey:

1. Register and verify identity
2. Build a deep profile
3. AI plus human matching and curation
4. Mutual approval with greeting or personal note
5. Curated date setup by the platform

## Business Model

| Tier       | Pricing        | Notes                        |
| ---------- | -------------- | ---------------------------- |
| Free       | ₪0             | Entry-level acquisition tier |
| Premium    | ₪49–79/month   | First paid tier              |
| Matchmaker | ₪149–249/month | Hybrid expert-assisted tier  |
| VIP        | ₪499–999/month | High-touch premium service   |

Alternative revenue model:

- Pay-per-match: ₪19–39 per approved match
- Conversation unlock: ₪9–19 to unlock conversations

Additional revenue streams: Events, dating coaching, profile photography, styling services.

## Go-To-Market

Staged launch: free tier + one paid tier first, then expand to Matchmaker and VIP after initial traction.

## Financial Projection

Working projection: 10,000 users, 15% paying → ~₪148,500 MRR. VIP upsell opportunity estimated at ~₪49,900 MRR.

## Competitive Advantage

- Human-reviewed matches
- Higher trust and safety
- Higher success rates
- Premium positioning

## Vision

Become the most trusted relationship platform in Israel and beyond.

## Target Market

Primary market: Israel. The application is fully bilingual in Hebrew (RTL) and English (LTR), with Hebrew being the primary language for the Israeli market.

---

## Technical Architecture

### Runtime and Toolchain

| Item             | Version / Detail                                            |
| ---------------- | ----------------------------------------------------------- |
| React Native     | 0.86.0 (bare workflow, no Expo)                             |
| React            | 19.2.3                                                      |
| TypeScript       | 5.8.3                                                       |
| Node.js          | >= 22.11.0 (engines field)                                  |
| Bundler          | Metro (standard `@react-native/metro-config`)               |
| Babel            | `@react-native/babel-preset`                                |
| ESLint           | `@react-native` config                                      |
| Prettier         | 2.8.8 (singleQuote, trailingComma: all, arrowParens: avoid) |
| Jest             | 29.x with `@react-native/jest-preset`                       |
| New Architecture | Enabled (`RCTNewArchEnabled: true` in iOS Info.plist)       |
| Android RTL      | Declared (`android:supportsRtl="true"` in AndroidManifest)  |

### Runtime Dependencies (Complete List)

The application has exactly ONE third-party runtime dependency beyond React and React Native core:

```
react-native-safe-area-context: ^5.5.2
```

**Critically absent** (not installed, representing the gap between current state and production readiness):

- React Navigation (no navigation library at all)
- Zustand or any external state manager
- React Native Reanimated or Gesture Handler
- react-i18next or any i18n library
- Firebase, Supabase, or any backend SDK
- TanStack Query or any data-fetching layer
- AsyncStorage or MMKV (no persistence layer)
- React Native MMKV / SecureStore
- Push notification library
- Analytics library

### iOS Native Configuration

- Bundle ID: `$(PRODUCT_BUNDLE_IDENTIFIER)` (Xcode managed)
- Display name: `GoDating`
- Supported orientations: Portrait only on iPhone; all orientations on iPad
- Location usage key present but empty description (not currently used)
- `NSAllowsArbitraryLoads: false` (strict ATS)
- `NSAllowsLocalNetworking: true` (dev server)
- Min iOS version: determined by `min_ios_version_supported` in Podfile (RN 0.86 sets this to iOS 15.1+)

### Android Native Configuration

- App name: `GoDating`
- Package: `com.anonymousmatchapp`
- Launch mode: `singleTask`
- Window soft input: `adjustResize`
- Internet permission declared
- RTL support: `android:supportsRtl="true"`

---

## Folder and Module Structure

```
go-dating/
  App.tsx                        # Root component (SafeAreaProvider + StatusBar + AppProviders + AppShell)
  index.js                       # AppRegistry entry point
  src/
    app/
      AppProviders.tsx           # Context provider composition (AppPreferences → Auth)
      AppShell.tsx               # Thin wrapper that renders RootNavigator
    navigation/
      RootNavigator.tsx          # Conditional-render navigation (no library)
    features/
      auth/
        AuthEntryScreen.tsx      # Login and register UI (mock only)
      language/
        LanguageSelectionScreen.tsx  # First-run locale picker
      onboarding/
        ProfileFlowScreen.tsx    # 11-step questionnaire wizard
        questionBank.ts          # Question lookup and utility functions
        types.ts                 # TypeScript types for questions and answers
      home/
        HomeScreen.tsx           # Post-onboarding dashboard with mock matches
      discovery/
        matchmaking.ts           # Local scoring algorithm with 3 mock candidates
    state/
      auth/
        AuthContext.tsx          # Auth state (mock), profile answers, flow state
      preferences/
        AppPreferencesContext.tsx  # Locale, isRTL, hasSelectedLocale
    components/
      layout/
        AppScreen.tsx            # Screen wrapper (SafeAreaView + KeyboardAvoiding + ScrollView)
        AppBackground.tsx        # Animated orb background with dark overlay
      ui/
        Button.tsx               # primary / secondary / ghost variants
        TextField.tsx            # Labeled text input with RTL support
        ChoiceChip.tsx           # Selectable pill for single/multi select questions
    content/
      copy.ts                    # All bilingual UI strings (en/he)
      profile-question-bank.v1.json  # Complete question bank JSON (22 questions, 8 sections)
    theme/
      index.ts                   # Design tokens: colors, spacing, radii, typeScale, shadows
    types/
      common.ts                  # Locale and LocalizedText types
```

---

## Navigation Architecture

The current "navigation" system is a **conditional render** in `RootNavigator.tsx`, not a navigation library. The decision tree is:

```
hasSelectedLocale? No  → LanguageSelectionScreen
isAuthenticated?   No  → AuthEntryScreen (mode: login | register)
hasCompletedProfile? No → ProfileFlowScreen
Default                 → HomeScreen
```

State transitions are driven by calling context functions:

- `setLocale(locale)` → sets `hasSelectedLocale: true`, triggers auth screen
- `loginMock()` / `registerMock()` → sets `isAuthenticated: true`, triggers profile flow
- `completeProfile(answers)` → sets `hasCompletedProfile: true`, triggers home
- `editProfile()` → resets `hasCompletedProfile: false`, returns to profile flow
- `logout()` → resets `isAuthenticated: false`, returns to auth screen

**There is no React Navigation stack.** There are no route names, navigation params, back stack, or deep link handlers. Every transition is a full unmount/remount.

---

## State Management

State is managed with two React Context providers:

### AppPreferencesContext (`src/state/preferences/AppPreferencesContext.tsx`)

| State             | Type              | Initial | Purpose                  |
| ----------------- | ----------------- | ------- | ------------------------ |
| locale            | `'en' \| 'he'`    | `'en'`  | Current app language     |
| hasSelectedLocale | boolean           | `false` | Gate for language screen |
| isRTL             | boolean (derived) | `false` | `locale === 'he'`        |

Exposed via `useAppPreferences()` hook.

### AuthContext (`src/state/auth/AuthContext.tsx`)

| State               | Type                    | Initial   | Purpose                |
| ------------------- | ----------------------- | --------- | ---------------------- |
| isAuthenticated     | boolean                 | `false`   | Auth gate              |
| hasCompletedProfile | boolean                 | `false`   | Onboarding gate        |
| authScreenMode      | `'login' \| 'register'` | `'login'` | Switches auth form     |
| profileAnswers      | ProfileAnswerMap        | seed data | Stores all Q&A answers |

Exposed via `useAuth()` hook. Initial `profileAnswers` is hardcoded seed data (not empty), which pre-fills the profile flow with answers for development purposes.

**No state persistence.** Both contexts live in memory only. App restart resets all state to initial values.

---

## Bilingual / RTL Implementation

### Current Approach

RTL is implemented as a manual, component-level prop-drilling pattern:

1. `isRTL` boolean comes from `useAppPreferences()`
2. Each screen reads `isRTL` and conditionally applies style overrides:
   - Text: `{ textAlign: 'right', writingDirection: 'rtl' }`
   - Row layouts: `{ flexDirection: 'row-reverse' }`
3. UI components (`Button`, `TextField`, `ChoiceChip`) accept an `isRTL` prop

### Missing RTL Primitives

`I18nManager.forceRTL()` is never called. This means:

- The native layout engine does not know the app is in RTL mode
- Native components (TextInput cursor, system UI elements) may not align correctly
- Icons and images are not automatically mirrored

### i18n String System

All bilingual strings are in `src/content/copy.ts` as a typed `const` object. The access pattern is:

```typescript
copy.auth.loginTitle[locale]; // 'Log in' or 'כניסה'
```

Types are enforced via `LocalizedText = Record<Locale, string>` from `src/types/common.ts`. The question bank JSON uses the same `{ en: string, he: string }` shape for all user-facing text, accessed via `getLocalizedText(text, locale)`.

**Note:** `LanguageSelectionScreen` uses some copy keys (`languageGate.description`, `languageGate.title`, `languageGate.note`) that are stored as plain English strings, not locale-keyed — they are shown before the user selects a language, which is intentional but the design tradeoff is hardcoded to English.

---

## Question Bank

### Structure

The question bank lives in `src/content/profile-question-bank.v1.json` and is typed by `ProfileQuestionBank` from `src/features/onboarding/types.ts`. It contains 22 questions across 8 sections.

### Sections (8 total)

| Section ID                    | English Title                 | Question Count |
| ----------------------------- | ----------------------------- | -------------- |
| identity_basics               | Identity Basics               | 5              |
| attraction_preferences        | Attraction Preferences        | 3              |
| relationship_intent           | Relationship Intent           | 3              |
| values_and_lifestyle          | Values and Lifestyle          | 3              |
| personality_and_communication | Personality and Communication | 3              |
| boundaries_and_privacy        | Boundaries and Privacy        | 3              |
| date_preferences              | Date Preferences              | 3              |
| trust_and_verification        | Trust and Verification        | 2              |

### Questions in the Current Onboarding Flow (11 of 22)

The flow is defined by `initialProfileFlowQuestionIds` in `questionBank.ts`:

| #   | Question ID         | Type                     | Required | Matching Weight | Section                |
| --- | ------------------- | ------------------------ | -------- | --------------- | ---------------------- |
| 1   | profile_alias       | single_select            | yes      | low             | identity_basics        |
| 2   | age_band            | single_select            | yes      | high            | identity_basics        |
| 3   | gender_identity     | single_select            | yes      | high            | identity_basics        |
| 4   | seeking_genders     | multi_select (max 4)     | yes      | high            | attraction_preferences |
| 5   | relationship_goal   | multi_select (max 3)     | yes      | high            | relationship_intent    |
| 6   | dating_pace         | single_select            | yes      | high            | relationship_intent    |
| 7   | top_values          | multi_select (max 5)     | yes      | high            | values_and_lifestyle   |
| 8   | hard_boundaries     | multi_select (max 5)     | yes      | high            | boundaries_and_privacy |
| 9   | privacy_reveal_mode | single_select            | yes      | high            | boundaries_and_privacy |
| 10  | first_date_style    | single_select            | yes      | medium          | date_preferences       |
| 11  | self_summary        | long_text (80-320 chars) | yes      | medium          | identity_basics        |

The remaining 11 questions (pronouns, preferred_partner_age_band, distance_preference, emotional_readiness, lifestyle_rhythm, children_family_outlook, conversation_style, social_energy, love_language, public_profile_elements, date_coordination_preference, pre_date_message_style, verification_status_preference, safety_support_preference) are defined in the bank but NOT shown in the current flow.

### Question Types

- `single_select` — renders as ChoiceChip grid, one selection at a time
- `multi_select` — renders as ChoiceChip grid with optional maxSelections cap
- `long_text` — renders as multiline TextInput (minLength: 80, maxLength: 320 for self_summary)

---

## Design System

### Colors (Dark mode only — no light mode)

| Token          | Value                    | Usage                          |
| -------------- | ------------------------ | ------------------------------ |
| background     | `#08131D`                | Root screen background         |
| backgroundDeep | `#102231`                | Deeper background layers       |
| surface        | `#13293A`                | Cards, auth forms              |
| surfaceStrong  | `#17374A`                | Stat cards, secondary buttons  |
| surfaceMuted   | `#0E1F2D`                | Photo card background          |
| border         | `rgba(255,255,255,0.10)` | Card borders                   |
| text           | `#F6F8FB`                | Primary text                   |
| textMuted      | `#A9C2D0`                | Secondary/helper text          |
| textSoft       | `#DCE8EE`                | Body copy, chip labels         |
| accent         | `#FF8B67`                | CTAs, selected chips, progress |
| accentStrong   | `#FF7043`                | Stronger accent usage          |
| accentMuted    | `rgba(255,139,103,0.18)` | Badge backgrounds              |
| mint           | `#7BE0C5`                | Eyebrows, indicators           |
| gold           | `#FFD27D`                | Helper text, notes             |
| success        | `#70D5AE`                | Success states                 |
| danger         | `#FF7B7B`                | Error states                   |
| input          | `#0A1B28`                | TextInput backgrounds          |
| overlay        | `rgba(6,12,18,0.72)`     | Modal overlays, concierge card |

### Typography (typeScale)

| Token    | Size | Usage                         |
| -------- | ---- | ----------------------------- |
| overline | 11px | —                             |
| caption  | 12px | Meta labels, pills, eyebrows  |
| body     | 15px | Standard body copy            |
| subtitle | 18px | Sub-headings                  |
| title    | 24px | Section titles, match aliases |
| hero     | 34px | Screen titles                 |

### Spacing

`xs:6, sm:10, md:16, lg:24, xl:32, xxl:48`

### Border Radii

`sm:14, md:22, lg:30, xl:40, pill:999`

### Shadows

Platform-split: iOS uses `shadowColor/Opacity/Radius/Offset`; Android uses `elevation: 8`.

### AppBackground

Three absolute-positioned color orbs (accent, mint, gold with low opacity) plus a dark overlay layer create a premium atmospheric background. Not animated — purely View-based.

### Implemented Components

| Component     | Path                                      | Variants / Props                                    |
| ------------- | ----------------------------------------- | --------------------------------------------------- |
| Button        | `src/components/ui/Button.tsx`            | primary, secondary, ghost; disabled; style override |
| TextField     | `src/components/ui/TextField.tsx`         | isRTL, label; passes TextInputProps                 |
| ChoiceChip    | `src/components/ui/ChoiceChip.tsx`        | selected, isRTL, onPress                            |
| AppScreen     | `src/components/layout/AppScreen.tsx`     | scroll (default true), contentContainerStyle        |
| AppBackground | `src/components/layout/AppBackground.tsx` | children only                                       |

### Design System Gaps (Not Yet Built)

The following components referenced in project architecture are absent:
`Modal`, `BottomSheet`, `Avatar`, `Badge`, `ProgressBar`, `Stepper`, `Radio`, `Checkbox`, `Slider`, `QuestionCard`, `EmptyState`, `LoadingState`, `ErrorState`, `Toast/Snackbar`

---

## Screens — Current Status

| Screen                  | File                                                | Status          | Notes                                                                                |
| ----------------------- | --------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------ |
| LanguageSelectionScreen | `src/features/language/LanguageSelectionScreen.tsx` | Complete (MVP)  | Shows en/he cards; static strings pre-locale                                         |
| AuthEntryScreen         | `src/features/auth/AuthEntryScreen.tsx`             | Complete (mock) | Login + register toggle; all auth is mock; no real validation                        |
| ProfileFlowScreen       | `src/features/onboarding/ProfileFlowScreen.tsx`     | Complete (MVP)  | 11-question wizard; progress bar; section labels; skip logic; marked modified in git |
| HomeScreen              | `src/features/home/HomeScreen.tsx`                  | Complete (mock) | Profile stats; 3 mock matches with scores; profile summary; concierge notes          |
| MatchDetailScreen       | —                                                   | Not built       | No per-match detail view                                                             |
| DateCoordinationScreen  | —                                                   | Not built       | Date setup flow absent                                                               |
| MutualApprovalScreen    | —                                                   | Not built       | Approve/reject match flow absent                                                     |
| ProfileEditScreen       | —                                                   | Not built       | Editing returns to ProfileFlowScreen (resets wizard)                                 |
| SettingsScreen          | —                                                   | Not built       | No settings surface                                                                  |
| NotificationsScreen     | —                                                   | Not built       | Push not integrated                                                                  |
| SubscriptionScreen      | —                                                   | Not built       | No paywall or tier selection                                                         |
| VerificationScreen      | —                                                   | Not built       | No identity verification flow                                                        |
| ConciergeScreen         | —                                                   | Not built       | Human matchmaker chat absent                                                         |
| OnboardingIntroScreen   | —                                                   | Not built       | No pre-flow splash/tour                                                              |

---

## Matchmaking Engine (Current State)

`src/features/discovery/matchmaking.ts` implements a **fully local, deterministic scoring algorithm** against 3 hardcoded mock candidates.

### Mock Candidates

| Alias       | Area             | Relationship Goals   | Pace             | Privacy            |
| ----------- | ---------------- | -------------------- | ---------------- | ------------------ |
| Atlas River | Tel Aviv radius  | long_term, marriage  | deliberate       | reveal_mutual_yes  |
| Nova Thread | Jerusalem radius | long_term, exploring | open_but_careful | reveal_audio_first |
| Cedar Bloom | Central district | slow_burn, exploring | open_but_careful | reveal_photo_blur  |

### Scoring Formula

```
score = 70 (base)
      + sharedGoals.length × 8      (relationship_goal overlap)
      + sharedValues.length × 5     (top_values overlap)
      + sharedPrivacy.length × 5    (privacy_reveal_mode match)
      + sharedDateStyle.length × 4  (first_date_style overlap)
      + sharedPace.length × 4       (dating_pace match)
```

Results sorted descending by score. First 3 shown on HomeScreen.

### Reasons Generation

The `reasons` array (shown as pills) is built from shared goals, shared values, and a hardcoded privacy-compatibility string. The hardcoded strings (`'Compatible privacy rules'` / `'גבולות פרטיות תואמים'`) bypass the copy system — a consistency issue.

---

## API and Backend Integration

**There is no backend integration of any kind.** The entire application runs on local in-memory mock data. Specifically:

- Authentication: `loginMock()` and `registerMock()` both simply call `setIsAuthenticated(true)`
- Profile storage: answers stored in React state only
- Matching: local algorithm against 3 hardcoded candidates
- No HTTP client (axios, fetch wrappers, etc.)
- No environment variables for API endpoints
- No Firebase, Supabase, or any BaaS SDK

---

## Open Technical Gaps and Next Steps

### Critical Path (Blockers for any real users)

1. **No React Navigation** — The conditional-render navigation system cannot support the full product (tabs, stacks, modals, deep linking). React Navigation v7 (`@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`) needs to be installed and the navigation graph redesigned as proper stacks.

2. **No state persistence** — `react-native-mmkv` or `@react-native-async-storage/async-storage` needed. At minimum: locale preference, auth token, and onboarding progress must survive app restart.

3. **No real authentication** — Firebase Auth or Supabase Auth (with phone/OTP for Israel) must replace the mock. The Israeli market strongly favors phone number auth.

4. **`I18nManager.forceRTL()` not called** — When user selects Hebrew, `I18nManager.forceRTL(true)` must be called and the app restarted (or a restart prompted) so the native layer properly mirrors layout. Without this, RTL is only cosmetic on the RN side and native components misbehave.

5. **No error or loading states** — Every async operation (future: auth, profile save, match fetch) needs error and loading UI. None exists.

### High Priority (Required before beta)

6. **Photo upload absent** — The product requires a profile photo as the "primary matching asset." Camera/gallery access, image upload to storage (Firebase Storage / Supabase Storage), and blurred photo rendering are all missing.

7. **self_summary has no character counter** — The field requires 80–320 characters, but there is no counter UI. Users cannot know how close they are to the minimum.

8. **ChoiceChip grid direction bug** — `ProfileFlowScreen` renders the chip grid with `flexDirection: 'row-reverse'` as a hardcoded unconditional style. This reverses chip order regardless of locale, which looks wrong in English (LTR). The RTL reversal should only apply when `isRTL` is true.

9. **No accessibility beyond Button role** — TextInput fields, ChoiceChips, Pressables need `accessibilityLabel` and `accessibilityHint`. Screen reader support is absent.

10. **Package name inconsistency** — Android package is `com.anonymousmatchapp`; iOS project is `AnonymousMatchApp`. The repo name is `go-dating`. These should be aligned before first public release.

### Medium Priority (Quality and scale)

11. **No i18n library** — The custom `copy.ts` pattern has no support for pluralization, interpolation, date/number formatting, or namespaced lazy loading. `react-i18next` should replace it before the string count grows further.

12. **Question bank loaded via `require()`** — `require('../../content/profile-question-bank.v1.json')` prevents tree-shaking and makes the full JSON available in the JS bundle. Consider lazy loading or compiling question content into typed modules.

13. **ProfileFlowScreen does not resume mid-flow** — If the user backgrounds the app and returns, they start at question 1 again. Draft progress should be persisted to local storage.

14. **No branching/skip logic in question flow** — The flow is strictly linear. The question bank has a `visibility` field on each question but it is not used by `ProfileFlowScreen`. Conditional question display (e.g., skip `children_family_outlook` if age band is 22–28) is not implemented.

15. **Dark mode only** — No light mode. iOS 13+ and Android 10+ users who prefer light mode get a forced dark theme. At minimum, respect `useColorScheme()` and either support a light theme or explicitly opt out with a note.

16. **No animations** — Screen transitions, progress bar fill, chip selection state change, and card entry are all instant. React Native Reanimated 3 is needed for 60fps animated interactions.

17. **The matchmaking reasons string bypasses the copy system** — Two inline locale-check strings in `matchmaking.ts` (lines 128–130) should be moved to `copy.ts`.

18. **No tests beyond a smoke test** — `__tests__/App.test.tsx` only verifies the root renders without crashing. No unit tests for question bank utilities, scoring algorithm, or RTL helpers.

### Architectural Decisions Pending

19. **Navigation model** — Tab navigation (home/matches/profile/settings) vs. a single-stack model needs to be decided before adding screens.

20. **Backend choice** — Firebase vs. Supabase vs. custom Node.js API. This decision affects auth, real-time notifications, storage, and the human matchmaker tooling.

21. **Subscription and paywall** — Which tier to launch with, whether to use RevenueCat or a custom paywall implementation, and whether to gate the profile flow or the match reveal.

22. **Human matchmaker tooling** — The product's core differentiator (human review) has no admin interface defined. An internal web dashboard or CMS is needed before real users can be reviewed.

23. **Identity verification flow** — The question bank includes verification preference questions, but no verification mechanism (video selfie, ID check, etc.) is planned in the codebase.

---

## Presentation Assets

During initial investor deck work, two redesigned investor decks were created:

- English investor deck v2: `__data/Investor_Matchmaking_Deck_English_v2 (1).html`
- Hebrew investor deck v2: `__data/Investor_Matchmaking_Deck_Hebrew_v2 (1).html`

Both include product narrative, product flow slide (verification → profile → AI+human matching → mutual approval → curated date), and the pricing model.

---

## Open Investor Material Gaps

The project materials are currently strongest on concept, product flow, monetization, and positioning. The main missing investor materials are: market size (TAM/SAM/SOM for Israel and diaspora), team and founders section, and fundraising ask with use-of-funds breakdown.
