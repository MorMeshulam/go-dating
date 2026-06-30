import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '../../components/layout/AppScreen';
import { Button } from '../../components/ui/Button';
import { ChoiceChip } from '../../components/ui/ChoiceChip';
import { copy } from '../../content/copy';
import { useAuth } from '../../state/auth/AuthContext';
import { useAppPreferences } from '../../state/preferences/AppPreferencesContext';
import { radii, shadows, spacing, typeScale } from '../../theme';
import type { Palette } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import {
  getLocalizedText,
  getSectionById,
  isQuestionAnswered,
} from './questionBank';
import {
  deriveStage2Answers,
  evaluateRouting,
  getRoutingProfileLabel,
  getStage1Questions,
  getStage1SectionById,
  getStage2Questions,
} from './profileRouting';
import type {
  ProfileAnswerMap,
  ProfileAnswerValue,
  ProfileQuestion,
  RoutingResult,
} from './types';
import { MilestoneScreen } from './MilestoneScreen';
import type { MilestoneVariant } from './MilestoneScreen';
import { QuestionImpact } from './QuestionImpact';
import { VerificationFeedback } from './VerificationFeedback';
import {
  getInputVerifier,
  MAX_VERIFICATION_ATTEMPTS,
  type VerificationVerdict,
} from '../../agents';

type FlowPhase = 'stage1' | 'stage2';

function updateMultiValue(
  currentValue: ProfileAnswerValue | undefined,
  nextValue: string,
  maxSelections?: number,
) {
  const currentValues = Array.isArray(currentValue)
    ? currentValue
    : currentValue
    ? [currentValue]
    : [];

  if (currentValues.includes(nextValue)) {
    return currentValues.filter(value => value !== nextValue);
  }

  if (maxSelections && currentValues.length >= maxSelections) {
    return currentValues;
  }

  return [...currentValues, nextValue];
}

export function ProfileFlowScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const {
    completeProfile,
    profileAnswers,
    stage1Answers: savedStage1,
  } = useAuth();
  const { isRTL, locale } = useAppPreferences();

  const stage1Questions = useMemo(() => getStage1Questions(), []);

  const [phase, setPhase] = useState<FlowPhase>('stage1');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stage1Answers, setStage1Answers] =
    useState<ProfileAnswerMap>(savedStage1);
  const [stage2Answers, setStage2Answers] =
    useState<ProfileAnswerMap>(profileAnswers);
  const [routing, setRouting] = useState<RoutingResult | null>(null);
  const [milestone, setMilestone] = useState<MilestoneVariant | null>(null);
  const [verifyAttempts, setVerifyAttempts] = useState(0);
  const [verdict, setVerdict] = useState<VerificationVerdict | null>(null);

  // Stage-2 questions are only known once routing has run on stage-1 answers.
  const stage2Questions = useMemo(
    () => (routing ? getStage2Questions(routing) : []),
    [routing],
  );

  const isStage1 = phase === 'stage1';
  const questions = isStage1 ? stage1Questions : stage2Questions;
  const answers = isStage1 ? stage1Answers : stage2Answers;
  const setAnswers = isStage1 ? setStage1Answers : setStage2Answers;

  const currentQuestion = questions[currentIndex];
  const currentSection = isStage1
    ? getStage1SectionById(currentQuestion.sectionId)
    : getSectionById(currentQuestion.sectionId);
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);
  const currentValue = answers[currentQuestion.id];
  const canContinue = isQuestionAnswered(currentQuestion, currentValue);
  const isLastInPhase = currentIndex === questions.length - 1;

  // The current step may be guarded by an input-verification agent.
  const verifier = getInputVerifier(currentQuestion.id);
  const isBlocked = Boolean(verifier) && verdict?.status === 'blocked';

  const stageLabel = isStage1
    ? copy.onboarding.stageRouting[locale]
    : copy.onboarding.stageProfile[locale];

  const updateAnswer = (value: ProfileAnswerValue) => {
    setAnswers(currentAnswers => ({
      ...currentAnswers,
      [currentQuestion.id]: value,
    }));

    // Clear correctable feedback as the member edits; a blocked step stays
    // blocked until expert review.
    if (verdict?.status === 'needs_changes') {
      setVerdict(null);
    }
  };

  const goNext = () => {
    // Run the input-verification agent before advancing past a guarded step.
    if (verifier) {
      const value = typeof currentValue === 'string' ? currentValue : '';
      const result = verifier(value, {
        minLength: currentQuestion.validation?.minLength,
        maxLength: currentQuestion.validation?.maxLength,
      });

      if (result.status !== 'approved') {
        const attempts = verifyAttempts + 1;
        setVerifyAttempts(attempts);
        setVerdict(
          attempts >= MAX_VERIFICATION_ATTEMPTS
            ? { ...result, status: 'blocked' }
            : result,
        );
        return;
      }

      setVerdict(null);
    }

    if (!isLastInPhase) {
      setCurrentIndex(index => index + 1);
      return;
    }

    if (isStage1) {
      // End of stage 1: route the member and pre-fill the stage-2 answers that
      // stage-1 already covered (those questions are skipped but still saved),
      // then celebrate the milestone before loading stage-2 questions.
      const nextRouting = evaluateRouting(stage1Answers);
      setRouting(nextRouting);
      setStage2Answers(current => ({
        ...deriveStage2Answers(stage1Answers),
        ...current,
      }));
      setMilestone('routed');
      return;
    }

    // End of stage 2: celebrate before handing off to the finished profile.
    setMilestone('done');
  };

  const continueFromMilestone = () => {
    if (milestone === 'routed') {
      setMilestone(null);
      setPhase('stage2');
      setCurrentIndex(0);
      return;
    }

    if (routing) {
      completeProfile({ routing, stage1Answers, stage2Answers });
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(index => index - 1);
      return;
    }

    if (!isStage1) {
      // Step back into the last stage-1 question.
      setPhase('stage1');
      setCurrentIndex(stage1Questions.length - 1);
    }
  };

  // The intro header only appears on the very first onboarding question, so the
  // section/title block doesn't persist on every step (keeps the screen minimal).
  const showHeader = isStage1 && currentIndex === 0;

  if (milestone) {
    return (
      <MilestoneScreen
        variant={milestone}
        profileLabel={
          routing ? getRoutingProfileLabel(routing.profileId, locale) : null
        }
        onContinue={continueFromMilestone}
      />
    );
  }

  return (
    <AppScreen scroll={false} contentContainerStyle={styles.content}>
      <View style={styles.flow}>
        {showHeader ? (
          <View style={[styles.headerRow, isRTL && styles.rowRtl]}>
            <View style={styles.headerCopy}>
              <Text style={[styles.title, isRTL && styles.textRtl]}>
                {copy.onboarding.title[locale]}
              </Text>
              <Text style={[styles.description, isRTL && styles.textRtl]}>
                {copy.onboarding.description[locale]}
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.questionCard}>
          <View style={[styles.progressLabels, isRTL && styles.rowRtl]}>
            <Text style={[styles.progressEyebrow, isRTL && styles.textRtl]}>
              {stageLabel}
            </Text>
            <Text style={styles.progressValue}>
              {currentIndex + 1}/{questions.length}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.impactRow}>
            <QuestionImpact weight={currentQuestion.matchingWeight} />
          </View>
          <Text style={[styles.questionText, isRTL && styles.textRtl]}>
            {getLocalizedText(currentQuestion.prompt, locale)}
          </Text>
          <Text style={[styles.metaText, isRTL && styles.textRtl]}>
            {currentQuestion.required
              ? copy.onboarding.requiredQuestion[locale]
              : copy.onboarding.optionalQuestion[locale]}
          </Text>
          {currentQuestion.helpText ? (
            <Text style={[styles.helpText, isRTL && styles.textRtl]}>
              {getLocalizedText(currentQuestion.helpText, locale)}
            </Text>
          ) : null}
          <QuestionInput
            isRTL={isRTL}
            locale={locale}
            localePlaceholder={copy.onboarding.placeholderLongText[locale]}
            onChange={updateAnswer}
            question={currentQuestion}
            value={currentValue}
          />
          {verifier && verdict ? (
            <VerificationFeedback
              attempts={verifyAttempts}
              maxAttempts={MAX_VERIFICATION_ATTEMPTS}
              verdict={verdict}
            />
          ) : null}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={[styles.actionsRow, isRTL && styles.rowRtl]}>
          <Button
            disabled={isStage1 && currentIndex === 0}
            label={copy.common.back[locale]}
            onPress={goBack}
            style={styles.secondaryAction}
            variant="secondary"
          />
          <Button
            disabled={!canContinue || isBlocked}
            label={
              !isStage1 && isLastInPhase
                ? copy.common.done[locale]
                : copy.common.next[locale]
            }
            onPress={goNext}
            style={styles.primaryAction}
          />
        </View>

        {!currentQuestion.required ? (
          <Button
            label={copy.common.skip[locale]}
            onPress={goNext}
            variant="ghost"
          />
        ) : null}
      </View>
    </AppScreen>
  );
}

function QuestionInput({
  isRTL,
  locale,
  localePlaceholder,
  onChange,
  question,
  value,
}: {
  isRTL: boolean;
  locale: 'en' | 'he';
  localePlaceholder: string;
  onChange: (value: ProfileAnswerValue) => void;
  question: ProfileQuestion;
  value: ProfileAnswerValue | undefined;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  if (question.type === 'long_text') {
    return (
      <LongTextInput
        isRTL={isRTL}
        locale={locale}
        localePlaceholder={localePlaceholder}
        onChange={onChange}
        question={question}
        value={value}
      />
    );
  }

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <View style={styles.optionsWrap}>
      {question.answers?.map(answer => (
        <ChoiceChip
          isRTL={isRTL}
          key={answer.id}
          label={getLocalizedText(answer.label, locale)}
          onPress={() => {
            if (question.type === 'single_select') {
              onChange(answer.id);
              return;
            }

            onChange(
              updateMultiValue(value, answer.id, question.maxSelections),
            );
          }}
          selected={selectedValues.includes(answer.id)}
        />
      ))}
    </View>
  );
}

function LongTextInput({
  isRTL,
  locale,
  localePlaceholder,
  onChange,
  question,
  value,
}: {
  isRTL: boolean;
  locale: 'en' | 'he';
  localePlaceholder: string;
  onChange: (value: ProfileAnswerValue) => void;
  question: ProfileQuestion;
  value: ProfileAnswerValue | undefined;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const examples = question.examples ?? [];
  const [exampleIndex, setExampleIndex] = useState(0);
  const text = typeof value === 'string' ? value : '';

  // Show example answers as the placeholder so members see the expected depth
  // without it polluting their own answer; cycling keeps the screen scroll-free.
  const activeExampleIndex = examples.length
    ? exampleIndex % examples.length
    : 0;
  const activeExample = examples.length
    ? getLocalizedText(examples[activeExampleIndex], locale)
    : null;

  return (
    <View style={styles.longTextWrap}>
      {examples.length ? (
        <View style={[styles.exampleBar, isRTL && styles.rowRtl]}>
          <Text style={styles.exampleEyebrow}>
            {copy.onboarding.exampleHint[locale]} {activeExampleIndex + 1}/
            {examples.length}
          </Text>
          <Text
            onPress={() => setExampleIndex(index => index + 1)}
            style={styles.exampleNext}
            suppressHighlighting
          >
            {copy.onboarding.nextExample[locale]}
          </Text>
        </View>
      ) : null}

      <TextInput
        multiline
        onChangeText={onChange}
        placeholder={activeExample ?? localePlaceholder}
        placeholderTextColor={colors.textMuted}
        style={[styles.textArea, isRTL && styles.textRtl]}
        textAlignVertical="top"
        value={text}
      />
    </View>
  );
}

const getStyles = (colors: Palette) =>
  StyleSheet.create({
    actionsRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    content: {
      paddingTop: spacing.xl,
    },
    // Scrollable region of the flow grows to fill, pushing the footer down.
    flow: {
      flex: 1,
      gap: spacing.lg,
    },
    // Always-visible action bar pinned to the bottom of the screen.
    footer: {
      gap: spacing.sm,
      paddingTop: spacing.md,
    },
    impactRow: {
      marginBottom: spacing.md,
    },
    longTextWrap: {
      gap: spacing.sm,
    },
    exampleBar: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    exampleEyebrow: {
      color: colors.mint,
      fontSize: typeScale.caption,
      fontWeight: '800',
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
    exampleNext: {
      color: colors.accent,
      fontSize: typeScale.caption,
      fontWeight: '800',
    },
    description: {
      color: colors.textMuted,
      fontSize: typeScale.body,
      lineHeight: 23,
    },
    headerCopy: {
      flex: 1,
    },
    headerRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: spacing.md,
      justifyContent: 'space-between',
    },
    helpText: {
      color: colors.textMuted,
      fontSize: typeScale.body,
      lineHeight: 22,
      marginBottom: spacing.lg,
    },
    metaText: {
      color: colors.gold,
      fontSize: typeScale.caption,
      fontWeight: '700',
      marginBottom: spacing.sm,
    },
    optionsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    primaryAction: {
      flex: 1.4,
    },
    progressCard: {
      ...shadows,
      backgroundColor: colors.overlay,
      borderColor: colors.border,
      borderRadius: radii.lg,
      borderWidth: 1,
      padding: spacing.lg,
    },
    progressEyebrow: {
      color: colors.mint,
      fontSize: typeScale.caption,
      fontWeight: '800',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    progressFill: {
      backgroundColor: colors.accent,
      borderRadius: radii.pill,
      height: 12,
    },
    progressLabels: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    progressTrack: {
      backgroundColor: colors.surfaceStrong,
      borderRadius: radii.pill,
      height: 12,
      marginBottom: spacing.md,
      overflow: 'hidden',
    },
    progressValue: {
      color: colors.textSoft,
      fontSize: typeScale.caption,
      fontWeight: '800',
    },
    questionCard: {
      ...shadows,
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radii.lg,
      borderWidth: 1,
      padding: spacing.xl,
    },
    questionText: {
      color: colors.text,
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: -0.7,
      lineHeight: 34,
      marginBottom: spacing.sm,
    },
    rowRtl: {
      flexDirection: 'row-reverse',
    },
    sectionPill: {
      alignSelf: 'flex-start',
      backgroundColor: colors.accentMuted,
      borderRadius: radii.pill,
      marginBottom: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: 8,
    },
    sectionPillText: {
      color: colors.accent,
      fontSize: typeScale.caption,
      fontWeight: '800',
    },
    secondaryAction: {
      flex: 1,
    },
    summaryText: {
      color: colors.textMuted,
      fontSize: typeScale.body,
      lineHeight: 22,
    },
    textArea: {
      backgroundColor: colors.input,
      borderColor: colors.border,
      borderRadius: radii.md,
      borderWidth: 1,
      color: colors.text,
      fontSize: typeScale.body,
      minHeight: 180,
      padding: spacing.md,
    },
    textRtl: {
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    title: {
      color: colors.text,
      fontSize: typeScale.hero,
      fontWeight: '800',
      letterSpacing: -1.1,
      marginBottom: spacing.sm,
    },
  });
