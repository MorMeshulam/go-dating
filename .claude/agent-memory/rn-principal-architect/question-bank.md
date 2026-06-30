---
name: question-bank
description: 22 questions across 8 sections in JSON; only 11 used in current flow; types, sections, and answer shapes documented
metadata:
  type: project
---

Question bank at `src/content/profile-question-bank.v1.json`. Loaded via `require()` in `src/features/onboarding/questionBank.ts`. Typed by `ProfileQuestionBank` in `src/features/onboarding/types.ts`.

**Current flow (11 questions, all required):** profile_alias → age_band → gender_identity → seeking_genders → relationship_goal → dating_pace → top_values → hard_boundaries → privacy_reveal_mode → first_date_style → self_summary

**Defined by:** `initialProfileFlowQuestionIds` const array in `questionBank.ts`

**Types:** `single_select` | `multi_select` | `long_text`

**Key utility functions in questionBank.ts:**
- `getLocalizedText(text, locale)` — falls back to .en if locale missing
- `getQuestionById(id)` — lookup from bank
- `getSectionById(id)` — lookup from bank
- `getProfileFlowQuestions()` — returns the 11-question ordered array
- `isQuestionAnswered(question, value)` — respects required + minLength for long_text
- `formatAnswerValue(questionId, value, locale)` — human-readable string for any answer type
- `getAnsweredCount(answerMap)` — count of answered questions in current flow

**self_summary:** long_text, minLength 80, maxLength 320. Required. No char counter UI built yet.

**Sections (8):** identity_basics, attraction_preferences, relationship_intent, values_and_lifestyle, personality_and_communication, boundaries_and_privacy, date_preferences, trust_and_verification

**Unused questions (11):** pronouns, preferred_partner_age_band, distance_preference, emotional_readiness, lifestyle_rhythm, children_family_outlook, conversation_style, social_energy, love_language, public_profile_elements, date_coordination_preference, pre_date_message_style, verification_status_preference, safety_support_preference

**How to apply:** When adding questions to the flow, add IDs to `initialProfileFlowQuestionIds`. The JSON already has content ready.
