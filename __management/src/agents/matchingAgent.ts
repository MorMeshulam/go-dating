import type {
  AgeBand,
  DatingPace,
  Gender,
  Privacy,
  Readiness,
  RelationshipGoal,
  Seeking,
  Value,
} from '../domain/profile';
import { AGE_BANDS } from '../domain/profile';

/** Minimal profile shape the matching agent needs to score a pairing. */
export type MatchProfile = {
  id: string;
  displayName?: string;
  gender?: Gender;
  seekingGenders?: Seeking[];
  ageBand?: AgeBand;
  relationshipGoal?: RelationshipGoal;
  datingPace?: DatingPace;
  emotionalReadiness?: Readiness;
  privacy?: Privacy;
  topValues?: Value[];
  city?: string;
  photo?: { appearanceVector?: number[] };
};

export type MatchResult = {
  candidate: string;
  candidateName?: string;
  score: number;
  reasons: string[];
};

const genderToSeeking: Record<Gender, Seeking> = {
  woman: 'women',
  man: 'men',
  non_binary: 'non_binary',
  genderfluid: 'genderfluid',
};

/** Does `viewer` want to meet someone of `target`'s gender? */
function isOpenTo(viewer: MatchProfile, target: MatchProfile): boolean {
  if (!viewer.seekingGenders || viewer.seekingGenders.length === 0) {
    return true;
  }

  if (viewer.seekingGenders.includes('everyone')) {
    return true;
  }

  if (!target.gender) {
    return true;
  }

  return viewer.seekingGenders.includes(genderToSeeking[target.gender]);
}

/** Both sides must be open to each other's gender to be eligible. */
export function isMutuallyEligible(a: MatchProfile, b: MatchProfile): boolean {
  return a.id !== b.id && isOpenTo(a, b) && isOpenTo(b, a);
}

function bandDistance(a?: AgeBand, b?: AgeBand): number | null {
  if (!a || !b) {
    return null;
  }

  return Math.abs(AGE_BANDS.indexOf(a) - AGE_BANDS.indexOf(b));
}

function cosineSimilarity(a?: number[], b?: number[]): number {
  if (!a || !b || a.length === 0 || a.length !== b.length) {
    return 0;
  }

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  if (magA === 0 || magB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

const sharedCount = <T>(a: T[] = [], b: T[] = []): number =>
  a.filter(item => b.includes(item)).length;

/**
 * Score a single pairing across intent, pace, readiness, values, privacy, age,
 * location, and a mock image-similarity signal. Returns the score plus the
 * human-readable reasons that drove it.
 */
export function scorePair(
  member: MatchProfile,
  candidate: MatchProfile,
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  if (member.relationshipGoal && member.relationshipGoal === candidate.relationshipGoal) {
    score += 25;
    reasons.push('Looking for the same kind of relationship');
  }

  const paceGap =
    member.datingPace && candidate.datingPace
      ? Math.abs(
          ['deliberate', 'open', 'ready_soon'].indexOf(member.datingPace) -
            ['deliberate', 'open', 'ready_soon'].indexOf(candidate.datingPace),
        )
      : null;
  if (paceGap === 0) {
    score += 15;
    reasons.push('A dating pace that matches');
  } else if (paceGap === 1) {
    score += 7;
  }

  if (member.emotionalReadiness && member.emotionalReadiness === candidate.emotionalReadiness) {
    score += 10;
    reasons.push('Similar emotional readiness');
  }

  const sharedValues = sharedCount(member.topValues, candidate.topValues);
  if (sharedValues > 0) {
    score += Math.min(sharedValues * 6, 24);
    reasons.push(`${sharedValues} shared core value${sharedValues > 1 ? 's' : ''}`);
  }

  if (member.privacy && member.privacy === candidate.privacy) {
    score += 8;
    reasons.push('Aligned on privacy');
  }

  const ageGap = bandDistance(member.ageBand, candidate.ageBand);
  if (ageGap === 0) {
    score += 10;
    reasons.push('Same age range');
  } else if (ageGap === 1) {
    score += 5;
    reasons.push('Close in age');
  }

  if (member.city && candidate.city && member.city === candidate.city) {
    score += 8;
    reasons.push(`Both in ${member.city}`);
  }

  const appearance = cosineSimilarity(
    member.photo?.appearanceVector,
    candidate.photo?.appearanceVector,
  );
  if (appearance > 0) {
    const appearancePoints = Math.round(appearance * 20);
    score += appearancePoints;
    if (appearance > 0.6) {
      reasons.push('Strong visual-type compatibility');
    }
  }

  return { score, reasons };
}

/**
 * The matching agent: filter to mutually-eligible candidates, score each, and
 * return the best `limit` matches for the member.
 */
export function computeTopMatches(
  member: MatchProfile,
  candidates: MatchProfile[],
  limit = 5,
): MatchResult[] {
  return candidates
    .filter(candidate => isMutuallyEligible(member, candidate))
    .map(candidate => {
      const { score, reasons } = scorePair(member, candidate);

      return {
        candidate: candidate.id,
        candidateName: candidate.displayName,
        score,
        reasons,
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

export const MATCHING_AGENT_VERSION = 'matching-agent.v1';
