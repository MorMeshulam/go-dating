import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../../components/layout/AppScreen';
import { Button } from '../../components/ui/Button';
import { copy } from '../../content/copy';
import { useAuth } from '../../state/auth/AuthContext';
import { useAppPreferences } from '../../state/preferences/AppPreferencesContext';
import { colors, radii, shadows, spacing, typeScale } from '../../theme';
import { formatAnswerValue, getAnsweredCount } from '../onboarding/questionBank';
import { getRankedMatches } from '../discovery/matchmaking';

const visibleSummaryQuestionIds = [
  'relationship_goal',
  'dating_pace',
  'privacy_reveal_mode',
  'first_date_style',
];

const mockProfilePhoto = require('../../../assets/mock-profile-person.png');

export function HomeScreen() {
  const { editProfile, logout, profileAnswers } = useAuth();
  const { isRTL, locale } = useAppPreferences();

  const matches = useMemo(
    () => getRankedMatches(profileAnswers, locale),
    [locale, profileAnswers],
  );

  const alias = formatAnswerValue('profile_alias', profileAnswers.profile_alias, locale);
  const answeredCount = getAnsweredCount(profileAnswers);

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <View style={[styles.headerRow, isRTL && styles.rowRtl]}>
        <View style={styles.headerCopy}>
          <Text style={[styles.eyebrow, isRTL && styles.textRtl]}>
            {copy.home.mockBadge[locale]}
          </Text>
          <Text style={[styles.title, isRTL && styles.textRtl]}>
            {copy.home.title[locale]}
          </Text>
          <Text style={[styles.description, isRTL && styles.textRtl]}>
            {copy.home.description[locale]}
          </Text>
        </View>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.photoCard}>
          <Image source={mockProfilePhoto} style={styles.profileImage} />
          <View style={styles.photoBadge}>
            <Text style={styles.photoBadgeLabel}>
              {copy.home.matchingAsset[locale]}
            </Text>
          </View>
          <View style={styles.photoCaption}>
            <Text style={[styles.photoHeadline, isRTL && styles.textRtl]}>
              {copy.home.photoHeadline[locale]}
            </Text>
            <Text style={[styles.photoDescription, isRTL && styles.textRtl]}>
              {copy.home.photoDescription[locale]}
            </Text>
          </View>
        </View>

        <Text style={[styles.heroAlias, isRTL && styles.textRtl]}>
          {alias ?? copy.appName[locale]}
        </Text>
        <Text style={[styles.heroMeta, isRTL && styles.textRtl]}>
          {copy.home.profileReady[locale]} • {answeredCount} / 11
        </Text>
        <View style={[styles.statsRow, isRTL && styles.rowRtl]}>
          <StatCard
            label={copy.home.completedAnswers[locale]}
            value={String(answeredCount)}
          />
          <StatCard
            label={copy.home.humanReviewed[locale]}
            value={locale === 'he' ? 'מוכן' : 'Ready'}
          />
          <StatCard
            label={copy.home.visibleSignals[locale]}
            value={String(visibleSummaryQuestionIds.length)}
          />
        </View>
        <View style={[styles.heroActions, isRTL && styles.rowRtl]}>
          <Button
            label={copy.common.editProfile[locale]}
            onPress={editProfile}
            style={styles.flexAction}
            variant="secondary"
          />
          <Button
            label={copy.common.logout[locale]}
            onPress={logout}
            style={styles.flexAction}
            variant="ghost"
          />
        </View>
      </View>

      <View style={styles.summaryCard}>
        {visibleSummaryQuestionIds.map((questionId) => {
          const answerValue = formatAnswerValue(
            questionId,
            profileAnswers[questionId],
            locale,
          );

          if (!answerValue) {
            return null;
          }

          return (
            <View key={questionId} style={[styles.summaryRow, isRTL && styles.rowRtl]}>
              <View style={styles.summaryDot} />
              <Text style={[styles.summaryText, isRTL && styles.textRtl]}>
                {answerValue}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, isRTL && styles.textRtl]}>
          {copy.home.curatedMatches[locale]}
        </Text>
      </View>

      <View style={styles.matchList}>
        {matches.slice(0, 3).map((match) => (
          <View key={match.id} style={styles.matchCard}>
            <View style={[styles.matchTopRow, isRTL && styles.rowRtl]}>
              <View style={styles.matchTopCopy}>
                <Text style={[styles.matchAlias, isRTL && styles.textRtl]}>
                  {match.alias}
                </Text>
                <Text style={[styles.matchArea, isRTL && styles.textRtl]}>
                  {match.area[locale]}
                </Text>
              </View>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreValue}>{match.score}</Text>
                <Text style={styles.scoreLabel}>fit</Text>
              </View>
            </View>

            <View style={[styles.reasonWrap, isRTL && styles.rowRtl]}>
              {match.reasons.map((reason) => (
                <View key={reason} style={styles.reasonPill}>
                  <Text style={[styles.reasonLabel, isRTL && styles.textRtl]}>
                    {reason}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={[styles.matchNote, isRTL && styles.textRtl]}>
              {match.note[locale]}
            </Text>

            <View style={[styles.matchActions, isRTL && styles.rowRtl]}>
              <Button
                label={copy.home.startDateFlow[locale]}
                onPress={() => {}}
                style={styles.flexAction}
              />
              <Button
                label={copy.home.refineFlow[locale]}
                onPress={editProfile}
                style={styles.flexAction}
                variant="secondary"
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.conciergeCard}>
        <Text style={[styles.conciergeTitle, isRTL && styles.textRtl]}>
          {copy.home.conciergeTitle[locale]}
        </Text>
        <Text style={[styles.conciergeBody, isRTL && styles.textRtl]}>
          {copy.home.conciergeBody[locale]}
        </Text>
      </View>
    </AppScreen>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  conciergeBody: {
    color: colors.textMuted,
    fontSize: typeScale.body,
    lineHeight: 23,
  },
  conciergeCard: {
    ...shadows,
    backgroundColor: colors.overlay,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginTop: spacing.sm,
    padding: spacing.lg,
  },
  conciergeTitle: {
    color: colors.text,
    fontSize: typeScale.subtitle,
    fontWeight: '800',
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
  eyebrow: {
    color: colors.mint,
    fontSize: typeScale.caption,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  flexAction: {
    flex: 1,
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
  heroActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  heroAlias: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginBottom: spacing.sm,
  },
  heroCard: {
    ...shadows,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.xl,
  },
  photoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    left: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    position: 'absolute',
    top: spacing.md,
    zIndex: 2,
  },
  photoBadgeLabel: {
    color: colors.accent,
    fontSize: typeScale.caption,
    fontWeight: '800',
  },
  photoCaption: {
    backgroundColor: colors.overlay,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    padding: spacing.md,
  },
  photoCard: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  photoDescription: {
    color: colors.textMuted,
    fontSize: typeScale.body,
    lineHeight: 22,
  },
  photoHeadline: {
    color: colors.text,
    fontSize: typeScale.subtitle,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  profileImage: {
    aspectRatio: 4 / 5,
    backgroundColor: colors.surfaceStrong,
    width: '100%',
  },
  heroMeta: {
    color: colors.textMuted,
    fontSize: typeScale.body,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  matchActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  matchAlias: {
    color: colors.text,
    fontSize: typeScale.title,
    fontWeight: '800',
  },
  matchArea: {
    color: colors.textMuted,
    fontSize: typeScale.caption,
    fontWeight: '700',
    marginTop: 4,
  },
  matchCard: {
    ...shadows,
    backgroundColor: colors.overlay,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  matchList: {
    gap: spacing.md,
  },
  matchNote: {
    color: colors.textSoft,
    fontSize: typeScale.body,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  matchTopCopy: {
    flex: 1,
  },
  matchTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  reasonLabel: {
    color: colors.textSoft,
    fontSize: typeScale.caption,
    fontWeight: '700',
  },
  reasonPill: {
    backgroundColor: colors.chipBackground,
    borderRadius: radii.pill,
    marginBottom: spacing.sm,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  reasonWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  scoreBadge: {
    alignItems: 'center',
    backgroundColor: colors.accentMuted,
    borderRadius: radii.md,
    minWidth: 72,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  scoreLabel: {
    color: colors.accent,
    fontSize: typeScale.caption,
    fontWeight: '800',
  },
  scoreValue: {
    color: colors.accent,
    fontSize: typeScale.title,
    fontWeight: '800',
  },
  sectionHeader: {
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typeScale.title,
    fontWeight: '800',
  },
  statCard: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: radii.md,
    flex: 1,
    minHeight: 88,
    padding: spacing.md,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: typeScale.caption,
    fontWeight: '700',
  },
  statValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.overlay,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  summaryDot: {
    backgroundColor: colors.mint,
    borderRadius: 999,
    height: 10,
    marginTop: 6,
    width: 10,
  },
  summaryRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  summaryText: {
    color: colors.textSoft,
    flex: 1,
    fontSize: typeScale.body,
    lineHeight: 22,
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
