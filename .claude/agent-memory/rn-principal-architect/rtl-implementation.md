---
name: rtl-implementation
description: RTL is manual prop-drilling of isRTL boolean; I18nManager.forceRTL() is never called; one known directional bug
metadata:
  type: project
---

RTL implementation pattern used throughout the app:

1. `isRTL` boolean comes from `useAppPreferences()` context
2. Text components: conditionally apply `{ textAlign: 'right', writingDirection: 'rtl' }` with `isRTL && styles.textRtl`
3. Row layouts: conditionally apply `{ flexDirection: 'row-reverse' }` with `isRTL && styles.rowRtl`
4. Shared UI components (Button, TextField, ChoiceChip) accept `isRTL` as a prop

**Critical gap:** `I18nManager.forceRTL()` is never called anywhere. Native layout direction is not set. When adding Hebrew support, this must be called on locale change (and app restart triggered) so native components (TextInput cursor, system UI) align correctly.

**Known bug:** `ProfileFlowScreen.tsx` renders the ChoiceChip grid with unconditional `flexDirection: 'row-reverse'` (the `optionsWrap` style, line 274). This reverses chip order in English mode too. Should be `isRTL ? styles.rowRtl : undefined`.

**String system:** All bilingual strings in `src/content/copy.ts` as typed const object. Access pattern: `copy.section.key[locale]`. Types: `LocalizedText = Record<Locale, string>`. No i18n library — no pluralization, interpolation, or lazy loading.

**How to apply:** Always use the `isRTL && styles.textRtl` / `isRTL && styles.rowRtl` pattern for new screens. Do not hardcode `flexDirection: 'row-reverse'` without making it conditional on `isRTL`. Plan to add `I18nManager.forceRTL()` call before any Hebrew user testing.
