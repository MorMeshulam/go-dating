import type { LocalizedText, Locale } from '../../types/common';
import {
  formatAnswerValue,
  getQuestionById,
} from '../onboarding/questionBank';
import type { ProfileAnswerMap, ProfileAnswerValue } from '../onboarding/types';

type MatchCandidate = {
  alias: string;
  area: LocalizedText;
  dateStyles: string[];
  id: string;
  note: LocalizedText;
  pace: string;
  privacy: string;
  relationshipGoals: string[];
  topValues: string[];
};

export type RankedMatch = MatchCandidate & {
  reasons: string[];
  score: number;
};

const matchCandidates: MatchCandidate[] = [
  {
    alias: 'Atlas River',
    area: {
      en: 'Tel Aviv radius',
      he: 'אזור תל אביב',
    },
    dateStyles: ['date_coffee_walk', 'date_wellness'],
    id: 'atlas_river',
    note: {
      en: 'Human review says this candidate is emotionally direct, grounded, and strong on follow-through.',
      he: 'הבקרה האנושית מציינת שמדובר במועמד ישיר רגשית, יציב וחזק בהמשכיות.',
    },
    pace: 'pace_deliberate',
    privacy: 'reveal_mutual_yes',
    relationshipGoals: ['goal_long_term', 'goal_marriage'],
    topValues: ['value_honesty', 'value_family', 'value_kindness'],
  },
  {
    alias: 'Nova Thread',
    area: {
      en: 'Jerusalem radius',
      he: 'אזור ירושלים',
    },
    dateStyles: ['date_gallery', 'date_coffee_walk'],
    id: 'nova_thread',
    note: {
      en: 'Strong fit for members who want reflective conversation, softer pacing, and clearer privacy boundaries.',
      he: 'התאמה חזקה למי שמחפש/ת שיחה עמוקה, קצב רך יותר וגבולות פרטיות ברורים.',
    },
    pace: 'pace_open_but_careful',
    privacy: 'reveal_audio_first',
    relationshipGoals: ['goal_long_term', 'goal_exploring'],
    topValues: ['value_spiritual', 'value_calm_communication', 'value_honesty'],
  },
  {
    alias: 'Cedar Bloom',
    area: {
      en: 'Central district',
      he: 'אזור המרכז',
    },
    dateStyles: ['date_gallery', 'date_dinner'],
    id: 'cedar_bloom',
    note: {
      en: 'Warm energy, creative conversation, and a good fit for members who want a thoughtful but not frozen pace.',
      he: 'אנרגיה חמה, שיחה יצירתית והתאמה טובה למי שרוצה קצב מחושב אבל לא קפוא.',
    },
    pace: 'pace_open_but_careful',
    privacy: 'reveal_photo_blur',
    relationshipGoals: ['goal_slow_burn', 'goal_exploring'],
    topValues: ['value_adventure', 'value_calm_communication', 'value_honesty'],
  },
];

function asArray(value: ProfileAnswerValue | undefined) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function overlap(left: string[], right: string[]) {
  return left.filter((value) => right.includes(value));
}

export function getRankedMatches(profileAnswers: ProfileAnswerMap, locale: Locale) {
  const intentAnswers = asArray(profileAnswers.relationship_goal);
  const valueAnswers = asArray(profileAnswers.top_values);
  const privacyAnswer = asArray(profileAnswers.privacy_reveal_mode);
  const dateStyleAnswer = asArray(profileAnswers.first_date_style);
  const paceAnswer = asArray(profileAnswers.dating_pace);

  return matchCandidates
    .map<RankedMatch>((candidate) => {
      const sharedGoals = overlap(intentAnswers, candidate.relationshipGoals);
      const sharedValues = overlap(valueAnswers, candidate.topValues);
      const sharedPrivacy = overlap(privacyAnswer, [candidate.privacy]);
      const sharedDateStyle = overlap(dateStyleAnswer, candidate.dateStyles);
      const sharedPace = overlap(paceAnswer, [candidate.pace]);

      const score =
        70 +
        sharedGoals.length * 8 +
        sharedValues.length * 5 +
        sharedPrivacy.length * 5 +
        sharedDateStyle.length * 4 +
        sharedPace.length * 4;

      const goalQuestion = getQuestionById('relationship_goal');
      const valueQuestion = getQuestionById('top_values');

      const reasons = [
        sharedGoals[0] && goalQuestion
          ? formatAnswerValue(goalQuestion.id, sharedGoals[0], locale)
          : null,
        sharedValues[0] && valueQuestion
          ? formatAnswerValue(valueQuestion.id, sharedValues[0], locale)
          : null,
        sharedPrivacy.length
          ? locale === 'he'
            ? 'גבולות פרטיות תואמים'
            : 'Compatible privacy rules'
          : locale === 'he'
            ? 'קצב חשיפה משלים'
            : 'Complementary reveal pace',
      ].filter(Boolean) as string[];

      return {
        ...candidate,
        reasons,
        score,
      };
    })
    .sort((left, right) => right.score - left.score);
}
