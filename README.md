# GoDating Native App

A standard React Native app structure for a privacy-first dating product with:

- Mock login and register screens
- A first profile creation flow driven by local bilingual configuration
- A post-onboarding home screen with curated match previews
- Native Android and iOS project folders, without Expo

## Main local data source

- [src/content/profile-question-bank.v1.json](/Users/mormeshulam/Mor/anonymous-match-app/src/content/profile-question-bank.v1.json)

## App structure

- [App.tsx](/Users/mormeshulam/Mor/anonymous-match-app/App.tsx): app bootstrap
- [src/app](/Users/mormeshulam/Mor/anonymous-match-app/src/app): providers and shell
- [src/navigation](/Users/mormeshulam/Mor/anonymous-match-app/src/navigation): root flow switching
- [src/state](/Users/mormeshulam/Mor/anonymous-match-app/src/state): mock auth and locale state
- [src/features/auth](/Users/mormeshulam/Mor/anonymous-match-app/src/features/auth): login and register screen
- [src/features/onboarding](/Users/mormeshulam/Mor/anonymous-match-app/src/features/onboarding): profile flow logic
- [src/features/home](/Users/mormeshulam/Mor/anonymous-match-app/src/features/home): home and match preview screen
- [src/features/discovery](/Users/mormeshulam/Mor/anonymous-match-app/src/features/discovery): mock matchmaking logic

## Run locally

Use Node `v22.21.1` or newer for this RN template.

```bash
cd /Users/mormeshulam/Mor/anonymous-match-app
npm install
npm run typecheck
npm start
```

Then run one of:

```bash
npm run ios
npm run android
```

# go-dating

# go-dating

# go-dating
