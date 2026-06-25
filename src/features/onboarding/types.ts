import type { Locale, LocalizedText } from '../../types/common';

export type ProfileQuestionType = 'single_select' | 'multi_select' | 'long_text';

export type ProfileAnswerOption = {
  id: string;
  label: LocalizedText;
};

export type ProfileQuestionValidation = {
  maxLength?: number;
  minLength?: number;
};

export type ProfileQuestion = {
  answers?: ProfileAnswerOption[];
  exampleAnswers?: Array<{
    locale: Locale;
    value: string;
  }>;
  helpText?: LocalizedText;
  id: string;
  matchingWeight: 'low' | 'medium' | 'high';
  maxSelections?: number;
  prompt: LocalizedText;
  required: boolean;
  sectionId: string;
  type: ProfileQuestionType;
  validation?: ProfileQuestionValidation;
  visibility: string;
};

export type ProfileQuestionSection = {
  description: LocalizedText;
  id: string;
  title: LocalizedText;
};

export type ProfileQuestionBank = {
  entity: string;
  product: {
    name: LocalizedText;
    summary: LocalizedText;
  };
  questions: ProfileQuestion[];
  sections: ProfileQuestionSection[];
  supportedLocales: Locale[];
  version: string;
};

export type ProfileAnswerValue = string | string[];
export type ProfileAnswerMap = Record<string, ProfileAnswerValue | undefined>;
