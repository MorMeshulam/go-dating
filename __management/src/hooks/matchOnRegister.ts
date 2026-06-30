import type { CollectionAfterChangeHook } from 'payload/types';

import {
  computeTopMatches,
  MATCHING_AGENT_VERSION,
  type MatchProfile,
} from '../agents/matchingAgent';

const toMatchProfile = (user: Record<string, unknown>): MatchProfile =>
  ({
    id: String(user.id),
    displayName: user.displayName as string,
    gender: user.gender as MatchProfile['gender'],
    seekingGenders: user.seekingGenders as MatchProfile['seekingGenders'],
    ageBand: user.ageBand as MatchProfile['ageBand'],
    relationshipGoal: user.relationshipGoal as MatchProfile['relationshipGoal'],
    datingPace: user.datingPace as MatchProfile['datingPace'],
    emotionalReadiness: user.emotionalReadiness as MatchProfile['emotionalReadiness'],
    privacy: user.privacy as MatchProfile['privacy'],
    topValues: user.topValues as MatchProfile['topValues'],
    city: user.city as string,
    photo: user.photo as MatchProfile['photo'],
  }) satisfies MatchProfile;

/**
 * When a real member registers, run the matching agent against the mock pool
 * and persist their top 5 matches. Mock seeds and admins are skipped so the
 * agent only fires for genuine sign-ups.
 */
export const matchOnRegister: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create' || doc.role !== 'member' || doc.isMock) {
    return doc;
  }

  const { payload } = req;

  const pool = await payload.find({
    collection: 'users',
    where: { isMock: { equals: true } },
    limit: 5000,
    depth: 0,
  });

  const results = computeTopMatches(
    toMatchProfile(doc),
    pool.docs.map(toMatchProfile),
    5,
  );

  await payload.create({
    collection: 'matches',
    data: {
      member: doc.id,
      generatedAt: new Date().toISOString(),
      generatedBy: MATCHING_AGENT_VERSION,
      results: results.map(result => ({
        candidate: result.candidate,
        score: result.score,
        reasons: result.reasons.map(reason => ({ reason })),
      })),
    },
  });

  payload.logger.info(
    `Matching agent produced ${results.length} matches for ${doc.email}`,
  );

  return doc;
};
