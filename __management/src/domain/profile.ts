/**
 * Shared profile vocabulary for the CMS, the mock-data generator, and the
 * matching agent. Kept in one place so collection options, seed data, and
 * scoring all speak the same language.
 */

export const GENDERS = ['woman', 'man', 'non_binary', 'genderfluid'] as const;
export type Gender = (typeof GENDERS)[number];

export const SEEKING = [
  'women',
  'men',
  'non_binary',
  'genderfluid',
  'everyone',
] as const;
export type Seeking = (typeof SEEKING)[number];

export const AGE_BANDS = [
  '18_24',
  '25_29',
  '30_34',
  '35_39',
  '40_44',
  '45_49',
  '50_plus',
] as const;
export type AgeBand = (typeof AGE_BANDS)[number];

export const RELATIONSHIP_GOALS = [
  'long_term',
  'marriage',
  'slow_burn',
  'exploring',
  'matchmaker',
] as const;
export type RelationshipGoal = (typeof RELATIONSHIP_GOALS)[number];

export const DATING_PACES = ['deliberate', 'open', 'ready_soon'] as const;
export type DatingPace = (typeof DATING_PACES)[number];

export const READINESS = ['ready_now', 'warming_up', 'slow_reentry'] as const;
export type Readiness = (typeof READINESS)[number];

export const PRIVACY = ['high', 'balanced', 'open'] as const;
export type Privacy = (typeof PRIVACY)[number];

export const VALUES = [
  'honesty',
  'ambition',
  'family',
  'spiritual',
  'adventure',
  'calm',
  'kindness',
] as const;
export type Value = (typeof VALUES)[number];

/** Dimensionality of the mock "appearance" vector used for image-match scoring. */
export const APPEARANCE_DIMENSIONS = 8;

/** Helper to turn a string-literal tuple into Payload select options. */
export const toOptions = (values: readonly string[]) =>
  values.map(value => ({ label: value, value }));
