---
name: navigation
description: Current navigation is a conditional-render function, not React Navigation; no route names or params exist
metadata:
  type: project
---

`src/navigation/RootNavigator.tsx` is a pure conditional render, not a navigation library. Decision tree:

1. `!hasSelectedLocale` → `<LanguageSelectionScreen />`
2. `!isAuthenticated` → `<AuthEntryScreen mode={authScreenMode} />`
3. `!hasCompletedProfile` → `<ProfileFlowScreen />`
4. Default → `<HomeScreen />`

There are no route names, no navigation params, no back stack, no deep link handlers, no React Navigation installed. Every screen transition is a full unmount/remount driven by context state changes.

State transitions:
- `setLocale()` → shows auth
- `loginMock()` / `registerMock()` → shows profile flow
- `completeProfile(answers)` → shows home
- `editProfile()` → resets to profile flow (full wizard restart)
- `logout()` → resets to auth

**Why:** Early MVP, sufficient for demo. Will need full React Navigation install before adding more screens.

**How to apply:** When adding any new screen, the first question must be whether to migrate to React Navigation. There is no existing "stack" to add a screen to — a nav library migration is required.
