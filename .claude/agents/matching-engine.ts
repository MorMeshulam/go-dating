// Standalone compatibility scoring engine — no app imports, fully portable.

type ProfileAnswerValue = string | string[];
type ProfileAnswerMap = Record<string, ProfileAnswerValue | undefined>;

type CompatibilityBreakdown = {
  ageBandCompatibility: number;
  boundaryRespect: number;
  genderMatch: number;
  goalAlignment: number;
  pacingCompatibility: number;
  privacyStyleMatch: number;
  valuesOverlap: number;
};

export type CompatibilityScore = {
  breakdown: CompatibilityBreakdown;
  explanation: { en: string; he: string };
  isViable: boolean;
  total: number;
};

// ── helpers ──────────────────────────────────────────────────────────────────

function asArray(value: ProfileAnswerValue | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function str(value: ProfileAnswerValue | undefined): string {
  const arr = asArray(value);
  return arr[0] ?? '';
}

function shared(a: string[], b: string[]): string[] {
  return a.filter(v => b.includes(v));
}

// ── gender filter ─────────────────────────────────────────────────────────────

const GENDER_TO_SEEK: Record<string, string> = {
  woman: 'seek_women',
  man: 'seek_men',
  non_binary: 'seek_non_binary',
  genderfluid: 'seek_genderfluid',
};

function scoreGenderMatch(a: ProfileAnswerMap, b: ProfileAnswerMap): number {
  const genderA = str(a.gender_identity);
  const genderB = str(b.gender_identity);
  const seekA = asArray(a.seeking_genders);
  const seekB = asArray(b.seeking_genders);
  const openAll = 'seek_open_all';

  const aSeeksB =
    seekA.includes(openAll) || seekA.includes(GENDER_TO_SEEK[genderB] ?? '');
  const bSeeksA =
    seekB.includes(openAll) || seekB.includes(GENDER_TO_SEEK[genderA] ?? '');

  return aSeeksB && bSeeksA ? 100 : 0;
}

// ── goal alignment ────────────────────────────────────────────────────────────

const SERIOUS_GOALS = new Set(['goal_long_term', 'goal_marriage']);
const CASUAL_GOALS = new Set(['goal_exploring', 'goal_slow_burn']);

function scoreGoalAlignment(a: ProfileAnswerMap, b: ProfileAnswerMap): number {
  const goalsA = asArray(a.relationship_goal);
  const goalsB = asArray(b.relationship_goal);
  const overlap = shared(goalsA, goalsB);

  if (overlap.length > 0) {
    const bothSerious =
      overlap.some(g => SERIOUS_GOALS.has(g));
    return bothSerious ? 100 : 80;
  }

  const aSerious = goalsA.some(g => SERIOUS_GOALS.has(g));
  const bSerious = goalsB.some(g => SERIOUS_GOALS.has(g));
  const aCasual = goalsA.some(g => CASUAL_GOALS.has(g));
  const bCasual = goalsB.some(g => CASUAL_GOALS.has(g));

  if ((aSerious && bCasual) || (aCasual && bSerious)) return 20;
  return 50;
}

// ── pacing compatibility ──────────────────────────────────────────────────────

type PaceScore = Record<string, Record<string, number>>;

const PACE_MATRIX: PaceScore = {
  pace_deliberate: {
    pace_deliberate: 100,
    pace_open_but_careful: 80,
    pace_ready_soon: 35,
  },
  pace_open_but_careful: {
    pace_deliberate: 80,
    pace_open_but_careful: 90,
    pace_ready_soon: 70,
  },
  pace_ready_soon: {
    pace_deliberate: 35,
    pace_open_but_careful: 70,
    pace_ready_soon: 90,
  },
};

function scorePacing(a: ProfileAnswerMap, b: ProfileAnswerMap): number {
  const pA = str(a.dating_pace);
  const pB = str(b.dating_pace);
  return PACE_MATRIX[pA]?.[pB] ?? 50;
}

// ── values overlap ────────────────────────────────────────────────────────────

function scoreValuesOverlap(a: ProfileAnswerMap, b: ProfileAnswerMap): number {
  const vA = asArray(a.top_values);
  const vB = asArray(b.top_values);
  const count = shared(vA, vB).length;
  if (count >= 2) return 100;
  if (count === 1) return 60;
  return 20;
}

// ── boundary respect ──────────────────────────────────────────────────────────

function scoreBoundaryRespect(a: ProfileAnswerMap, b: ProfileAnswerMap): number {
  const bA = asArray(a.hard_boundaries);
  const bB = asArray(b.hard_boundaries);

  let score = 80;

  // pace boundaries — if A wants pace respected but B is ready_soon, tension
  if (bA.includes('boundary_respect_pace') && str(b.dating_pace) === 'pace_ready_soon') {
    score -= 30;
  }
  if (bB.includes('boundary_respect_pace') && str(a.dating_pace) === 'pace_ready_soon') {
    score -= 30;
  }

  // privacy boundaries — no_socials_first / no_phone_first are self-consistent (both want privacy = good)
  // They only cause issues if one party's reveal_mode conflicts
  const aNoSocials = bA.includes('boundary_no_socials_first');
  const bNoSocials = bB.includes('boundary_no_socials_first');
  if (aNoSocials || bNoSocials) {
    // compatible — both value privacy
    score = Math.min(score + 5, 100);
  }

  return Math.max(0, Math.min(100, score));
}

// ── age band compatibility ────────────────────────────────────────────────────

const AGE_BANDS = ['22_28', '29_35', '36_42', '43_50', '51_plus'];

function scoreAgeBand(a: ProfileAnswerMap, b: ProfileAnswerMap): number {
  const iA = AGE_BANDS.indexOf(str(a.age_band));
  const iB = AGE_BANDS.indexOf(str(b.age_band));

  if (iA === -1 || iB === -1) return 60; // unknown → neutral
  const gap = Math.abs(iA - iB);

  if (gap === 0) return 100;
  if (gap === 1) return 75;
  if (gap === 2) return 45;
  return 20;
}

// ── privacy style match ───────────────────────────────────────────────────────

type PrivacyScore = Record<string, Record<string, number>>;

const PRIVACY_MATRIX: PrivacyScore = {
  reveal_mutual_yes: {
    reveal_mutual_yes: 100,
    reveal_after_concierge: 80,
    reveal_audio_first: 70,
    reveal_photo_blur: 65,
  },
  reveal_after_concierge: {
    reveal_mutual_yes: 80,
    reveal_after_concierge: 95,
    reveal_audio_first: 75,
    reveal_photo_blur: 70,
  },
  reveal_audio_first: {
    reveal_mutual_yes: 70,
    reveal_after_concierge: 75,
    reveal_audio_first: 85,
    reveal_photo_blur: 80,
  },
  reveal_photo_blur: {
    reveal_mutual_yes: 65,
    reveal_after_concierge: 70,
    reveal_audio_first: 80,
    reveal_photo_blur: 85,
  },
};

function scorePrivacy(a: ProfileAnswerMap, b: ProfileAnswerMap): number {
  const pA = str(a.privacy_reveal_mode);
  const pB = str(b.privacy_reveal_mode);
  return PRIVACY_MATRIX[pA]?.[pB] ?? 50;
}

// ── explanation ───────────────────────────────────────────────────────────────

const DIMENSION_LABELS: Record<
  keyof CompatibilityBreakdown,
  { en: string; he: string }
> = {
  genderMatch: {
    en: 'mutual attraction alignment',
    he: 'התאמת משיכה הדדית',
  },
  goalAlignment: {
    en: 'shared relationship goals',
    he: 'יעדי קשר משותפים',
  },
  pacingCompatibility: {
    en: 'compatible dating pace',
    he: 'קצב היכרות תואם',
  },
  valuesOverlap: {
    en: 'overlapping core values',
    he: 'ערכי ליבה משותפים',
  },
  boundaryRespect: {
    en: 'mutual boundary respect',
    he: 'כבוד הדדי לגבולות',
  },
  ageBandCompatibility: {
    en: 'compatible life stage',
    he: 'שלב חיים תואם',
  },
  privacyStyleMatch: {
    en: 'aligned privacy preferences',
    he: 'העדפות פרטיות תואמות',
  },
};

function buildExplanation(
  breakdown: CompatibilityBreakdown,
  total: number,
): { en: string; he: string } {
  const ranked = (
    Object.keys(breakdown) as Array<keyof CompatibilityBreakdown>
  )
    .filter(k => k !== 'genderMatch')
    .sort((a, b) => breakdown[b] - breakdown[a]);

  const topKey = ranked[0];
  const label = DIMENSION_LABELS[topKey];

  if (total >= 80) {
    return {
      en: `Strong ${label.en} makes this a high-potential match.`,
      he: `${label.he} חזקה הופכת זאת להתאמה בעלת פוטנציאל גבוה.`,
    };
  }
  if (total >= 60) {
    return {
      en: `Solid ${label.en} gives this match a meaningful foundation.`,
      he: `${label.he} טובה מעניקה להתאמה זו בסיס משמעותי.`,
    };
  }
  return {
    en: `Some compatibility exists around ${label.en}, but key differences may need conversation.`,
    he: `קיימת תאימות מסוימת סביב ${label.he}, אך הבדלים מרכזיים עשויים לדרוש שיחה.`,
  };
}

// ── main export ───────────────────────────────────────────────────────────────

export function scoreCompatibility(
  profileA: ProfileAnswerMap,
  profileB: ProfileAnswerMap,
): CompatibilityScore {
  const genderMatch = scoreGenderMatch(profileA, profileB);

  if (genderMatch === 0) {
    return {
      breakdown: {
        ageBandCompatibility: 0,
        boundaryRespect: 0,
        genderMatch: 0,
        goalAlignment: 0,
        pacingCompatibility: 0,
        privacyStyleMatch: 0,
        valuesOverlap: 0,
      },
      explanation: {
        en: 'Mutual attraction preferences do not align.',
        he: 'העדפות המשיכה ההדדיות אינן תואמות.',
      },
      isViable: false,
      total: 0,
    };
  }

  const goalAlignment = scoreGoalAlignment(profileA, profileB);
  const pacingCompatibility = scorePacing(profileA, profileB);
  const valuesOverlap = scoreValuesOverlap(profileA, profileB);
  const boundaryRespect = scoreBoundaryRespect(profileA, profileB);
  const ageBandCompatibility = scoreAgeBand(profileA, profileB);
  const privacyStyleMatch = scorePrivacy(profileA, profileB);

  const total = Math.round(
    goalAlignment * 0.22 +
      pacingCompatibility * 0.18 +
      valuesOverlap * 0.2 +
      boundaryRespect * 0.15 +
      ageBandCompatibility * 0.12 +
      privacyStyleMatch * 0.13,
  );

  const breakdown: CompatibilityBreakdown = {
    ageBandCompatibility,
    boundaryRespect,
    genderMatch,
    goalAlignment,
    pacingCompatibility,
    privacyStyleMatch,
    valuesOverlap,
  };

  return {
    breakdown,
    explanation: buildExplanation(breakdown, total),
    isViable: true,
    total,
  };
}
