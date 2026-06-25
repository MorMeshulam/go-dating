import type { Locale, LocalizedText } from '../../types/common';
import type {
  ProfileAnswerMap,
  ProfileAnswerValue,
  ProfileQuestion,
  ProfileQuestionBank,
} from './types';

export const profileQuestionBank =
  require('../../content/profile-question-bank.v1.json') as ProfileQuestionBank;

export const initialProfileFlowQuestionIds = [
  'profile_alias',
  'age_band',
  'gender_identity',
  'seeking_genders',
  'relationship_goal',
  'dating_pace',
  'top_values',
  'hard_boundaries',
  'privacy_reveal_mode',
  'first_date_style',
  'self_summary',
] as const;

export function getLocalizedText(text: LocalizedText, locale: Locale) {
  return text[locale] ?? text.en;
}

export function getQuestionById(questionId: string) {
  return profileQuestionBank.questions.find((question) => question.id === questionId);
}

export function getSectionById(sectionId: string) {
  return profileQuestionBank.sections.find((section) => section.id === sectionId);
}

export function getProfileFlowQuestions() {
  return initialProfileFlowQuestionIds
    .map((questionId) => getQuestionById(questionId))
    .filter(Boolean) as ProfileQuestion[];
}

export function isQuestionAnswered(
  question: ProfileQuestion,
  value: ProfileAnswerValue | undefined,
) {
  if (value === undefined) {
    return !question.required;
  }

  if (typeof value === 'string') {
    if (question.type === 'long_text') {
      const minLength = question.validation?.minLength ?? 1;

      return value.trim().length >= minLength;
    }

    return value.length > 0;
  }

  return value.length > 0 || !question.required;
}

export function getAnswerLabel(
  question: ProfileQuestion,
  answerId: string,
  locale: Locale,
) {
  return question.answers?.find((answer) => answer.id === answerId)
    ? getLocalizedText(
        question.answers.find((answer) => answer.id === answerId)!.label,
        locale,
      )
    : answerId;
}

export function formatAnswerValue(
  questionId: string,
  value: ProfileAnswerValue | undefined,
  locale: Locale,
) {
  const question = getQuestionById(questionId);

  if (!question || value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    if (question.type === 'long_text') {
      return value;
    }

    return getAnswerLabel(question, value, locale);
  }

  return value
    .map((answerId) => getAnswerLabel(question, answerId, locale))
    .join(' • ');
}

export function getAnsweredCount(answerMap: ProfileAnswerMap) {
  return getProfileFlowQuestions().filter((question) =>
    isQuestionAnswered(question, answerMap[question.id]),
  ).length;
}
