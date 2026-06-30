import {
  AGE_BANDS,
  APPEARANCE_DIMENSIONS,
  DATING_PACES,
  GENDERS,
  PRIVACY,
  READINESS,
  RELATIONSHIP_GOALS,
  VALUES,
  type Gender,
  type Seeking,
} from '../domain/profile';

export type MockUser = {
  email: string;
  password: string;
  role: 'member';
  isMock: true;
  displayName: string;
  gender: Gender;
  seekingGenders: Seeking[];
  ageBand: string;
  relationshipGoal: string;
  datingPace: string;
  emotionalReadiness: string;
  privacy: string;
  topValues: string[];
  city: string;
  selfSummary: string;
  photo: {
    seed: string;
    appearanceScore: number;
    appearanceVector: number[];
  };
};

/** Deterministic PRNG (mulberry32) so the 1000 seeds are reproducible. */
function createRng(seed: number) {
  let state = seed >>> 0;

  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const womenNames = [
  'Noa', 'Maya', 'Shira', 'Tamar', 'Yael', 'Adi', 'Roni', 'Lior',
  'Hila', 'Dana', 'Gal', 'Avigail', 'Mika', 'Ella', 'Sivan', 'Noya',
];
const menNames = [
  'Itai', 'Daniel', 'Yonatan', 'Omer', 'Eitan', 'Amit', 'Guy', 'Nadav',
  'Tomer', 'Ori', 'Ido', 'Ariel', 'Bar', 'Eden', 'Yuval', 'Roi',
];
const neutralNames = ['Alex', 'Sol', 'Ariel', 'Noam', 'Stav', 'Or', 'Shai', 'Lee'];

const cities = [
  'Tel Aviv', 'Jerusalem', 'Haifa', 'Be’er Sheva', 'Ramat Gan',
  'Herzliya', 'Netanya', 'Rishon LeZion', 'Eilat', 'Modiin',
];

const summaryTemplates = [
  'Curious, warm, and happiest on a long walk with good conversation.',
  'Into hiking, books, and slow Friday dinners with people I love.',
  'Ambitious by day, easygoing by night — looking for something real.',
  'Sea swims, live music, and honest talks are my thing.',
  'Calm, kind, and ready for a partnership that grows over time.',
  'Big on family, travel, and finding the humor in everyday life.',
];

function pick<T>(rng: () => number, items: T[]): T {
  return items[Math.floor(rng() * items.length)];
}

function pickMany<T>(rng: () => number, items: T[], max: number): T[] {
  const count = 1 + Math.floor(rng() * max);
  const pool = [...items];
  const chosen: T[] = [];

  for (let i = 0; i < count && pool.length > 0; i += 1) {
    chosen.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
  }

  return chosen;
}

function seekingFor(rng: () => number, gender: Gender): Seeking[] {
  const roll = rng();
  if (roll < 0.15) {
    return ['everyone'];
  }

  // Mostly opposite-gender, with a healthy share of same-gender and inclusive.
  if (gender === 'man') {
    return roll < 0.7 ? ['women'] : pickMany(rng, ['men', 'non_binary'], 2);
  }
  if (gender === 'woman') {
    return roll < 0.7 ? ['men'] : pickMany(rng, ['women', 'non_binary'], 2);
  }
  return pickMany(rng, ['women', 'men', 'non_binary', 'genderfluid'], 3);
}

function appearanceVector(rng: () => number): number[] {
  return Array.from({ length: APPEARANCE_DIMENSIONS }, () => Number((rng() * 2 - 1).toFixed(3)));
}

/** Build `count` reproducible mock members spanning every gender. */
export function generateMockUsers(count: number): MockUser[] {
  const rng = createRng(20260630);
  const users: MockUser[] = [];

  for (let i = 0; i < count; i += 1) {
    // Weighted gender spread: ~45% women, ~45% men, ~10% non-binary/genderfluid.
    const genderRoll = rng();
    const gender: Gender =
      genderRoll < 0.45
        ? 'woman'
        : genderRoll < 0.9
          ? 'man'
          : genderRoll < 0.96
            ? 'non_binary'
            : 'genderfluid';

    const namePool =
      gender === 'woman'
        ? womenNames
        : gender === 'man'
          ? menNames
          : neutralNames;

    users.push({
      email: `mock+${i}@dateright.local`,
      password: 'mockpass123',
      role: 'member',
      isMock: true,
      displayName: `${pick(rng, namePool)} ${String.fromCharCode(65 + Math.floor(rng() * 26))}.`,
      gender,
      seekingGenders: seekingFor(rng, gender),
      ageBand: pick(rng, [...AGE_BANDS]),
      relationshipGoal: pick(rng, [...RELATIONSHIP_GOALS]),
      datingPace: pick(rng, [...DATING_PACES]),
      emotionalReadiness: pick(rng, [...READINESS]),
      privacy: pick(rng, [...PRIVACY]),
      topValues: pickMany(rng, [...VALUES], 4),
      city: pick(rng, cities),
      selfSummary: pick(rng, summaryTemplates),
      photo: {
        seed: `seed-${i}`,
        appearanceScore: Number((rng() * 5).toFixed(2)),
        appearanceVector: appearanceVector(rng),
      },
    });
  }

  return users;
}
