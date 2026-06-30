---
name: known-gaps
description: Confirmed bugs and architectural gaps discovered during full codebase audit 2026-06-29
metadata:
  type: project
---

**Confirmed bugs:**

1. `ProfileFlowScreen.tsx` optionsWrap style has `flexDirection: 'row-reverse'` unconditionally — flips chip grid in English too. Fix: make conditional on `isRTL`.

2. `matchmaking.ts` lines ~128-130 build privacy reason strings with inline locale ternary instead of using the copy system. Should be in `copy.ts`.

3. `LanguageSelectionScreen` copy keys (`languageGate.description`, `languageGate.title`, `languageGate.note`) are plain English strings not locale-keyed — by design (shown before locale is chosen) but must be flagged as intentional.

4. `self_summary` TextInput has no character counter despite minLength:80/maxLength:320 requirement. Users cannot see progress toward minimum.

**Architectural gaps:**

5. `I18nManager.forceRTL()` never called — Hebrew users won't get proper native RTL behavior.

6. No state persistence — everything resets on app restart. Need MMKV or AsyncStorage.

7. No React Navigation — adding any screen requires library migration.

8. No error states, loading states, empty states — any async feature will need these built first.

9. No real authentication — loginMock/registerMock just set a boolean.

10. No photo upload — profile photo is a static mock asset.

11. Android package name `com.anonymousmatchapp` inconsistent with product direction.

12. Only one test (smoke test) — no unit tests for scoring, question bank utilities, or RTL helpers.

**How to apply:** Before starting any significant feature, check if it requires resolving one of these gaps first (especially navigation migration, persistence, or auth).
