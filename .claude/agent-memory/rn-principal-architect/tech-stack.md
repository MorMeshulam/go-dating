---
name: tech-stack
description: Complete installed dependency list and toolchain versions for go-dating; critically documents what is NOT installed
metadata:
  type: project
---

React Native 0.86.0, React 19.2.3, TypeScript 5.8.3, Node >=22.11.0. Bare workflow — no Expo.

Only ONE third-party runtime dependency: `react-native-safe-area-context ^5.5.2`.

**What is NOT installed (all still need to be added):**

- React Navigation (no navigation library at all)
- Zustand (no external state manager)
- React Native Reanimated or Gesture Handler
- react-i18next or any i18n library
- Firebase or Supabase SDK
- TanStack Query
- AsyncStorage or MMKV (no persistence)
- Push notification library
- Analytics

New Architecture enabled: `RCTNewArchEnabled: true` in iOS Info.plist. Android: `android:supportsRtl="true"`.

Android package: `com.anonymousmatchapp`. iOS project: `AnonymousMatchApp`. App display name: `GoDating`.

**Why:** Project is in early MVP/demo phase, no real backend needed yet. Every task requiring new deps should be treated as an architectural addition requiring package install + native setup.

**How to apply:** Before writing code that requires any missing library, flag that it needs to be installed first. Do not assume these libraries are available.
