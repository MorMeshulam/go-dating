import type { Locale } from '../../types/common';
import { getLocalizedText, getQuestionById } from './questionBank';
import type {
  ProfileAnswerMap,
  ProfileAnswerValue,
  ProfileQuestion,
  RoutingCondition,
  RoutingLogic,
  RoutingProfile,
  RoutingResult,
  Stage1QuestionBank,
  Stage2ModuleLoader,
} from './types';

export const stage1QuestionBank =
  require('../../content/stage1-routing-questions.v1.json') as Stage1QuestionBank;

export const routingLogic =
  require('../../content/stage1-routing-logic.v1.json') as RoutingLogic;

export const moduleLoader =
  require('../../content/stage2-module-loader.v1.json') as Stage2ModuleLoader;

/** Stage-1 routing questions, ordered by their declared displayOrder. */
export function getStage1Questions(): ProfileQuestion[] {
  return [...stage1QuestionBank.questions].sort(
    (left, right) => (left.displayOrder ?? 0) - (right.displayOrder ?? 0),
  );
}

export function getStage1QuestionById(questionId: string) {
  return stage1QuestionBank.questions.find(
    question => question.id === questionId,
  );
}

export function getStage1SectionById(sectionId: string) {
  return stage1QuestionBank.sections.find(section => section.id === sectionId);
}

function asArray(value: ProfileAnswerValue | undefined): string[] {
  if (value === undefined) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

/** A condition passes when the answer to its question includes any expected id. */
function conditionMatches(
  condition: RoutingCondition,
  answers: ProfileAnswerMap,
) {
  const selected = asArray(answers[condition.questionId]);

  return condition.includes.some(expected => selected.includes(expected));
}

function allConditionsMatch(
  conditions: RoutingCondition[],
  answers: ProfileAnswerMap,
) {
  return conditions.every(condition => conditionMatches(condition, answers));
}

/**
 * Evaluate stage-1 answers against the routing rules. The highest-priority
 * matching rule wins; otherwise the fallback profile is used. Secondary trait
 * tags are collected from every matching tag rule.
 */
export function evaluateRouting(
  stage1Answers: ProfileAnswerMap,
): RoutingResult {
  const rankedRules = [...routingLogic.routingRules].sort(
    (left, right) => right.priority - left.priority,
  );

  const matchedRule = rankedRules.find(rule =>
    allConditionsMatch(rule.whenAll, stage1Answers),
  );

  const secondaryTags = routingLogic.secondaryTagRules
    .filter(rule => allConditionsMatch(rule.whenAll, stage1Answers))
    .flatMap(rule => rule.addTags);

  return {
    matchedRuleId: matchedRule?.id ?? null,
    profileId:
      matchedRule?.assignProfile ?? routingLogic.fallbackRule.assignProfile,
    secondaryTags: Array.from(new Set(secondaryTags)),
    usedFallback: !matchedRule,
  };
}

/**
 * Stage-1 routing questions already cover the same ground as several stage-2
 * questions (with different ids). This maps each stage-1 question to its stage-2
 * equivalent, including how the answer-option ids translate, so we can pre-fill
 * the stage-2 answer and skip asking it a second time.
 *
 * Deliberately excluded: `what_matters_most_in_a_match_first` -> `top_values`
 * (a priority ranking, not the same as listing your core values) and
 * `how_much_help_do_you_want_from_us` (no stage-2 equivalent question).
 */
type Stage1ToStage2Map = {
  stage2QuestionId: string;
  valueMap: Record<string, string>;
};

const stage1ToStage2: Record<string, Stage1ToStage2Map> = {
  who_are_you_open_to_meeting: {
    stage2QuestionId: 'seeking_genders',
    valueMap: {
      women: 'seek_women',
      men: 'seek_men',
      non_binary: 'seek_non_binary',
      genderfluid: 'seek_genderfluid',
      open_to_all: 'seek_open_all',
    },
  },
  what_are_you_looking_for_now: {
    stage2QuestionId: 'relationship_goal',
    valueMap: {
      long_term: 'goal_long_term',
      marriage_minded: 'goal_marriage',
      slow_burn: 'goal_slow_burn',
      exploring: 'goal_exploring',
      guided_matchmaking: 'goal_high_touch_matchmaker',
    },
  },
  what_pace_feels_right: {
    stage2QuestionId: 'dating_pace',
    valueMap: {
      careful: 'pace_deliberate',
      open_but_careful: 'pace_open_but_careful',
      ready_soon: 'pace_ready_soon',
    },
  },
  how_private_do_you_want_to_be: {
    stage2QuestionId: 'privacy_reveal_mode',
    valueMap: {
      very_private: 'reveal_mutual_yes',
      balanced_private: 'reveal_photo_blur',
      more_open: 'reveal_audio_first',
    },
  },
  what_level_of_verification_do_you_expect: {
    stage2QuestionId: 'verification_status_preference',
    valueMap: {
      basic: 'verify_basic',
      identity_checked: 'verify_identity_checked',
      human_reviewed: 'verify_human_reviewed',
    },
  },
  how_ready_are_you_for_a_real_relationship: {
    stage2QuestionId: 'emotional_readiness',
    valueMap: {
      ready_now: 'ready_now',
      warming_up: 'warming_up',
      slow_reentry: 'prefer_slow_reentry',
    },
  },
};

const stage2QuestionsCoveredByStage1 = new Set(
  Object.values(stage1ToStage2).map(entry => entry.stage2QuestionId),
);

/**
 * Translate stage-1 routing answers into pre-filled stage-2 answers, so the
 * questions that stage-1 already covered can be skipped without losing data.
 */
export function deriveStage2Answers(
  stage1Answers: ProfileAnswerMap,
): ProfileAnswerMap {
  const derived: ProfileAnswerMap = {};

  Object.entries(stage1ToStage2).forEach(([stage1QuestionId, mapping]) => {
    const sourceAnswer = stage1Answers[stage1QuestionId];

    if (sourceAnswer === undefined) {
      return;
    }

    const stage2Question = getQuestionById(mapping.stage2QuestionId);

    if (!stage2Question) {
      return;
    }

    const mappedValues = asArray(sourceAnswer)
      .map(value => mapping.valueMap[value])
      .filter(Boolean) as string[];

    if (mappedValues.length === 0) {
      return;
    }

    derived[mapping.stage2QuestionId] =
      stage2Question.type === 'multi_select' ? mappedValues : mappedValues[0];
  });

  return derived;
}

export function getRoutingProfile(
  profileId: string,
): RoutingProfile | undefined {
  return routingLogic.routingProfiles.find(profile => profile.id === profileId);
}

export function getRoutingProfileLabel(profileId: string, locale: Locale) {
  const profile = getRoutingProfile(profileId);

  return profile ? getLocalizedText(profile.label, locale) : profileId;
}

function getModulePlan(profileId: string) {
  return (
    moduleLoader.profileModulePlans.find(
      plan => plan.profileId === profileId,
    ) ??
    moduleLoader.profileModulePlans.find(
      plan => plan.profileId === routingLogic.fallbackRule.assignProfile,
    )
  );
}

function getModuleDefinition(moduleId: string) {
  return moduleLoader.moduleDefinitions.find(module => module.id === moduleId);
}

/**
 * Resolve the ordered list of stage-2 question ids for a routing result.
 *
 * Pipeline: union of always-load + profile modules -> expand to question ids in
 * module order -> drop post-match-only questions -> apply priority/defer hints
 * from the plan and active trait-tag overrides via a stable reordering -> cap at
 * the configured maximum before deferral.
 */
export function buildStage2QuestionIds(routing: RoutingResult): string[] {
  const plan = getModulePlan(routing.profileId);

  if (!plan) {
    return [];
  }

  const {
    alwaysLoadModules,
    deferToPostMatchIfVisibilityIs,
    maxStage2QuestionsBeforeDeferral,
  } = moduleLoader.globalRules;

  const moduleIds = Array.from(
    new Set([...alwaysLoadModules, ...plan.loadModules]),
  );

  // Expand modules into their question ids, preserving module + question order.
  const baseQuestionIds: string[] = [];

  moduleIds.forEach(moduleId => {
    const definition = getModuleDefinition(moduleId);

    definition?.questionIds.forEach(questionId => {
      if (!baseQuestionIds.includes(questionId)) {
        baseQuestionIds.push(questionId);
      }
    });
  });

  // Drop questions already answered in stage-1, then defer questions that
  // should only surface after a mutual reveal.
  const visibleQuestionIds = baseQuestionIds.filter(questionId => {
    if (stage2QuestionsCoveredByStage1.has(questionId)) {
      return false;
    }

    const question = getQuestionById(questionId);

    if (!question) {
      return false;
    }

    return !deferToPostMatchIfVisibilityIs.includes(question.visibility);
  });

  // Collect priority/defer hints from the plan and every active trait override.
  const activeOverrides = moduleLoader.traitTagOverrides.filter(override =>
    routing.secondaryTags.includes(override.tag),
  );

  const promotedIds = new Set([
    ...plan.priorityQuestionIds,
    ...activeOverrides.flatMap(override => override.promoteQuestionIds),
  ]);

  const demotedIds = new Set([
    ...plan.deferQuestionIds,
    ...activeOverrides.flatMap(override => override.demoteQuestionIds),
  ]);

  // A question can be both hinted up and down (across plan + tags); promotion wins.
  const rank = (questionId: string) => {
    if (promotedIds.has(questionId)) {
      return 0;
    }

    if (demotedIds.has(questionId)) {
      return 2;
    }

    return 1;
  };

  // Stable sort by rank, keeping the natural module order within each band.
  const orderedIds = visibleQuestionIds
    .map((questionId, index) => ({ questionId, index }))
    .sort((left, right) => {
      const rankDelta = rank(left.questionId) - rank(right.questionId);

      return rankDelta !== 0 ? rankDelta : left.index - right.index;
    })
    .map(entry => entry.questionId);

  return orderedIds.slice(0, maxStage2QuestionsBeforeDeferral);
}

export function getStage2Questions(routing: RoutingResult): ProfileQuestion[] {
  return buildStage2QuestionIds(routing)
    .map(questionId => getQuestionById(questionId))
    .filter(Boolean) as ProfileQuestion[];
}
