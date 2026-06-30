import type { Locale, LocalizedText } from '../../types/common';

export type ProfileQuestionType =
  | 'single_select'
  | 'multi_select'
  | 'long_text';

export type ProfileAnswerOption = {
  id: string;
  label: LocalizedText;
};

export type ProfileQuestionValidation = {
  maxLength?: number;
  minLength?: number;
};

export type ProfileQuestion = {
  analyticsKey?: string;
  answers?: ProfileAnswerOption[];
  displayOrder?: number;
  examples?: LocalizedText[];
  helpText?: LocalizedText;
  id: string;
  mapsToAxis?: string;
  matchingWeight: 'low' | 'medium' | 'high';
  maxSelections?: number;
  prompt: LocalizedText;
  purpose?: string;
  required: boolean;
  sectionId: string;
  storesTraitTags?: string[];
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

// --- Stage 1 routing ---------------------------------------------------------

export type Stage1QuestionBank = {
  entity: string;
  product: {
    name: LocalizedText;
    summary: LocalizedText;
  };
  purpose: string;
  questions: ProfileQuestion[];
  routingAxes: string[];
  sections: ProfileQuestionSection[];
  supportedLocales: Locale[];
  version: string;
};

export type RoutingCondition = {
  includes: string[];
  questionId: string;
};

export type RoutingRule = {
  assignProfile: string;
  id: string;
  priority: number;
  whenAll: RoutingCondition[];
};

export type SecondaryTagRule = {
  addTags: string[];
  id: string;
  whenAll: RoutingCondition[];
};

export type RoutingProfile = {
  id: string;
  label: LocalizedText;
  loadsModules: string[];
  secondaryTags: string[];
};

export type RoutingLogic = {
  description: LocalizedText;
  entity: string;
  fallbackRule: {
    assignProfile: string;
    reason: string;
  };
  routingProfiles: RoutingProfile[];
  routingRules: RoutingRule[];
  secondaryTagRules: SecondaryTagRule[];
  version: string;
};

// --- Stage 2 module loader ---------------------------------------------------

export type ModuleDefinition = {
  id: string;
  label: LocalizedText;
  order: number;
  questionIds: string[];
  required: boolean;
  sectionId: string;
};

export type ProfileModulePlan = {
  deferQuestionIds: string[];
  loadModules: string[];
  priorityQuestionIds: string[];
  profileId: string;
};

export type TraitTagOverride = {
  demoteQuestionIds: string[];
  promoteQuestionIds: string[];
  tag: string;
};

export type ModuleLoaderGlobalRules = {
  alwaysLoadModules: string[];
  deferToPostMatchIfVisibilityIs: string[];
  keepInternalOnlyQuestionsInMatchingPayload: boolean;
  maxStage2QuestionsBeforeDeferral: number;
};

export type Stage2ModuleLoader = {
  description: LocalizedText;
  entity: string;
  globalRules: ModuleLoaderGlobalRules;
  moduleDefinitions: ModuleDefinition[];
  profileModulePlans: ProfileModulePlan[];
  sourceQuestionBank: string;
  traitTagOverrides: TraitTagOverride[];
  version: string;
};

// --- Routing result ----------------------------------------------------------

export type RoutingResult = {
  matchedRuleId: string | null;
  profileId: string;
  secondaryTags: string[];
  usedFallback: boolean;
};
