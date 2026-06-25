import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppScreen } from '../../components/layout/AppScreen';
import { Button } from '../../components/ui/Button';
import { ChoiceChip } from '../../components/ui/ChoiceChip';
import { copy } from '../../content/copy';
import { useAuth } from '../../state/auth/AuthContext';
import { useAppPreferences } from '../../state/preferences/AppPreferencesContext';
import { colors, radii, shadows, spacing, typeScale } from '../../theme';
import {
  getLocalizedText,
  getProfileFlowQuestions,
  getSectionById,
  isQuestionAnswered,
} from './questionBank';
import type { ProfileAnswerMap, ProfileAnswerValue, ProfileQuestion } from './types';

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
    return currentValues.filter((value) => value !== nextValue);
  }

  if (maxSelections && currentValues.length >= maxSelections) {
    return currentValues;
  }

  return [...currentValues, nextValue];
}

export function ProfileFlowScreen() {
  const { completeProfile, profileAnswers } = useAuth();
  const { isRTL, locale } = useAppPreferences();

  const flowQuestions = useMemo(() => getProfileFlowQuestions(), []);
  const [answers, setAnswers] = useState<ProfileAnswerMap>(profileAnswers);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = flowQuestions[currentIndex];
  const currentSection = getSectionById(currentQuestion.sectionId);
  const progress = Math.round(((currentIndex + 1) / flowQuestions.length) * 100);
  const currentValue = answers[currentQuestion.id];
  const canContinue = isQuestionAnswered(currentQuestion, currentValue);

  const updateAnswer = (value: ProfileAnswerValue) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestion.id]: value,
    }));
  };

  const goNext = () => {
    if (currentIndex === flowQuestions.length - 1) {
      completeProfile(answers);
      return;
    }

    setCurrentIndex((index) => index + 1);
  };

  const goBack = () => {
    if (currentIndex === 0) {
      return;
    }

    setCurrentIndex((index) => index - 1);
  };

  return (
    <AppScreen contentContainerStyle={styles.content}>
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

      <View style={styles.progressCard}>
        <View style={[styles.progressLabels, isRTL && styles.rowRtl]}>
          <Text style={[styles.progressEyebrow, isRTL && styles.textRtl]}>
            {copy.onboarding.progressLabel[locale]}
          </Text>
          <Text style={styles.progressValue}>
            {currentIndex + 1}/{flowQuestions.length}
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={[styles.summaryText, isRTL && styles.textRtl]}>
          {copy.onboarding.answersSummary[locale]}
        </Text>
      </View>

      <View style={styles.questionCard}>
        {currentSection ? (
          <View style={styles.sectionPill}>
            <Text style={styles.sectionPillText}>
              {copy.onboarding.sectionLabel[locale]} •{' '}
              {getLocalizedText(currentSection.title, locale)}
            </Text>
          </View>
        ) : null}

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
      </View>

      <View style={[styles.actionsRow, isRTL && styles.rowRtl]}>
        <Button
          disabled={currentIndex === 0}
          label={copy.common.back[locale]}
          onPress={goBack}
          style={styles.secondaryAction}
          variant="secondary"
        />
        <Button
          disabled={!canContinue}
          label={
            currentIndex === flowQuestions.length - 1
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
  if (question.type === 'long_text') {
    return (
      <TextInput
        multiline
        onChangeText={(text) => onChange(text)}
        placeholder={localePlaceholder}
        placeholderTextColor={colors.textMuted}
        style={[styles.textArea, isRTL && styles.textRtl]}
        textAlignVertical="top"
        value={typeof value === 'string' ? value : ''}
      />
    );
  }

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <View style={styles.optionsWrap}>
      {question.answers?.map((answer) => (
        <ChoiceChip
          isRTL={isRTL}
          key={answer.id}
          label={getLocalizedText(answer.label, locale)}
          onPress={() => {
            if (question.type === 'single_select') {
              onChange(answer.id);
              return;
            }

            onChange(updateMultiValue(value, answer.id, question.maxSelections));
          }}
          selected={selectedValues.includes(answer.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  content: {
    gap: spacing.lg,
    paddingTop: spacing.xl,
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
