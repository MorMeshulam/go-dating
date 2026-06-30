import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/ui/Button';
import { useAuth } from '../../state/auth/AuthContext';
import { useAppPreferences } from '../../state/preferences/AppPreferencesContext';
import { colors, radii, spacing, typeScale } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 14;
const CARD_WIDTH = SCREEN_WIDTH - 72;
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2 - CARD_GAP / 2;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;
const CARD_HEIGHT = 360;

type Locale = 'en' | 'he';
type T = { en: string; he: string };

type PricingTier = {
  id: string;
  icon: string;
  label: T;
  price: string;
  period: T;
  features: T[];
  accent: string;
  badge?: T;
};

const TIERS: PricingTier[] = [
  {
    id: 'free',
    icon: '💫',
    label: { en: 'Free', he: 'חינם' },
    price: '₪0',
    period: { en: 'forever', he: 'לתמיד' },
    features: [
      { en: 'Browse profiles & photos', he: 'עיון בפרופילים ותמונות' },
      { en: 'Basic compatibility matching', he: 'התאמה בסיסית' },
      { en: '5 mutual likes per day', he: '5 לייקים ביום' },
    ],
    accent: '#3D85A8',
  },
  {
    id: 'premium',
    icon: '✨',
    label: { en: 'Premium', he: 'פרמיום' },
    price: '₪49–79',
    period: { en: '/ month', he: '/ חודש' },
    features: [
      { en: 'Unlimited daily likes', he: 'לייקים ללא הגבלה' },
      { en: 'See who liked your profile', he: 'ראו מי אהב אתכם' },
      { en: 'Priority in search results', he: 'עדיפות בתוצאות חיפוש' },
    ],
    accent: '#D42860',
    badge: { en: 'Most Popular', he: 'הפופולרי ביותר' },
  },
  {
    id: 'matchmaker',
    icon: '🎯',
    label: { en: 'Matchmaker', he: 'שדכן' },
    price: '₪149–249',
    period: { en: '/ month', he: '/ חודש' },
    features: [
      { en: 'Curated matches every week', he: 'התאמות שבועיות מאצות' },
      { en: 'Human expert guidance', he: 'ליווי מומחה אנושי' },
      { en: 'Personal profile coaching', he: 'אימון פרופיל אישי' },
    ],
    accent: '#7C4FD4',
  },
  {
    id: 'vip',
    icon: '👑',
    label: { en: 'VIP', he: 'VIP' },
    price: '₪499–999',
    period: { en: '/ month', he: '/ חודש' },
    features: [
      { en: 'Dedicated personal matchmaker', he: 'שדכן אישי ייעודי' },
      { en: 'Background-verified profiles', he: 'פרופילים עם בדיקת רקע' },
      { en: 'Exclusive member-only events', he: 'אירועי VIP בלעדיים' },
    ],
    accent: '#A07010',
  },
];

export function PricingCarouselScreen() {
  const { dismissPricing } = useAuth();
  const { isRTL, locale } = useAppPreferences();
  const [activeIndex, setActiveIndex] = useState(1);
  const listRef = useRef<FlatList<PricingTier>>(null);

  const active = TIERS[activeIndex];

  const onScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const raw = e.nativeEvent.contentOffset.x / SNAP_INTERVAL;
      const clamped = Math.max(0, Math.min(Math.round(raw), TIERS.length - 1));
      setActiveIndex(clamped);
    },
    [],
  );

  const loc = (t: T) => t[locale];

  return (
    <View style={styles.root}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[styles.orb, styles.orbPink]} />
        <View style={[styles.orb, styles.orbPurple]} />
        <View style={[styles.orb, styles.orbGold]} />
      </View>

      <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              {locale === 'he' ? 'בחרו תוכנית' : 'Choose a plan'}
            </Text>
          </View>
          <Text style={[styles.heroTitle, isRTL && styles.rtl]}>
            {locale === 'he'
              ? 'הצטרפו לחוויה\nשמשנה זוגיות'
              : 'Upgrade your dating\nexperience'}
          </Text>
          <Text style={[styles.heroSub, isRTL && styles.rtl]}>
            {locale === 'he'
              ? 'גלשו לגלות את כל תוכניות המנוי'
              : 'Swipe to explore all subscription tiers'}
          </Text>
        </View>

        {/* Carousel */}
        <FlatList
          ref={listRef}
          data={TIERS}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SNAP_INTERVAL}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
          ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
          initialScrollIndex={1}
          getItemLayout={(_, index) => ({
            length: CARD_WIDTH,
            offset: SNAP_INTERVAL * index,
            index,
          })}
          onMomentumScrollEnd={onScrollEnd}
          renderItem={({ item, index }) => (
            <PricingCard
              tier={item}
              isActive={index === activeIndex}
              locale={locale}
              isRTL={isRTL}
            />
          )}
        />

        {/* Dots */}
        <View style={styles.dots}>
          {TIERS.map((tier, i) => (
            <View
              key={tier.id}
              style={[
                styles.dot,
                i === activeIndex && {
                  backgroundColor: active.accent,
                  width: 24,
                },
              ]}
            />
          ))}
        </View>

        {/* CTAs */}
        <View style={styles.cta}>
          <Button
            label={
              locale === 'he'
                ? `המשך עם ${loc(active.label)}`
                : `Continue with ${loc(active.label)}`
            }
            onPress={dismissPricing}
          />
          <Button
            label={locale === 'he' ? 'דלג/י לעת עתה' : 'Skip for now'}
            onPress={dismissPricing}
            variant="ghost"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function PricingCard({
  tier,
  isActive,
  locale,
  isRTL,
}: {
  tier: PricingTier;
  isActive: boolean;
  locale: Locale;
  isRTL: boolean;
}) {
  const loc = (t: T) => t[locale];

  return (
    // Outer shell: provides shadow + border + scale/opacity
    <View
      style={[
        styles.cardShell,
        {
          borderColor: isActive ? tier.accent + 'B0' : 'rgba(160,55,90,0.10)',
          borderWidth: isActive ? 1.5 : 1,
          transform: [{ scale: isActive ? 1 : 0.93 }],
          opacity: isActive ? 1 : 0.52,
        },
        isActive && accentShadow(tier.accent),
      ]}
    >
      {/* Inner: overflow:hidden clips header to card border-radius */}
      <View style={styles.cardInner}>
        {/* Accent header band */}
        <View style={[styles.cardHeader, { backgroundColor: tier.accent }]}>
          {/* Decorative background layer */}
          <View style={styles.headerOrbLarge} />
          <View style={styles.headerOrbSmall} />
          <Text style={styles.headerGhost} pointerEvents="none">{tier.icon}</Text>

          {/* Badge row – always rendered so cards stay aligned */}
          <View style={[styles.badgeRow, isRTL && styles.badgeRowRtl]}>
            {tier.badge ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{loc(tier.badge)}</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.tierIcon}>{tier.icon}</Text>
          <Text style={[styles.tierLabel, isRTL && styles.rtl]}>
            {loc(tier.label)}
          </Text>
        </View>

        {/* White body */}
        <View style={styles.cardBody}>
          <View style={[styles.priceRow, isRTL && styles.rowRtl]}>
            <Text style={styles.tierPrice}>{tier.price}</Text>
            <Text style={styles.tierPeriod}>{loc(tier.period)}</Text>
          </View>

          <View style={styles.featureList}>
            {tier.features.map((feature, i) => (
              <View key={i} style={[styles.featureRow, isRTL && styles.rowRtl]}>
                <Text style={[styles.checkmark, { color: tier.accent }]}>✓</Text>
                <Text style={[styles.featureText, isRTL && styles.rtl]}>
                  {loc(feature)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

function accentShadow(accent: string) {
  const hex = accent.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return Platform.select({
    ios: {
      shadowColor: `rgb(${r},${g},${b})`,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.28,
      shadowRadius: 22,
    },
    android: { elevation: 10 },
  });
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1,
  },

  orb: { borderRadius: 999, position: 'absolute' },
  orbPink: {
    backgroundColor: 'rgba(224, 84, 124, 0.13)',
    height: 340,
    right: -90,
    top: -80,
    width: 340,
  },
  orbPurple: {
    backgroundColor: 'rgba(179, 136, 255, 0.09)',
    bottom: 200,
    height: 300,
    left: -90,
    width: 300,
  },
  orbGold: {
    backgroundColor: 'rgba(255, 185, 120, 0.10)',
    bottom: -40,
    height: 220,
    right: 50,
    width: 220,
  },

  safe: { flex: 1 },

  header: {
    alignItems: 'center',
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  pill: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  pillText: {
    color: colors.accent,
    fontSize: typeScale.caption,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
    lineHeight: 33,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  heroSub: {
    color: colors.textMuted,
    fontSize: typeScale.body,
    textAlign: 'center',
  },

  // Card shell: carries shadow + border (no overflow:hidden)
  cardShell: {
    borderRadius: radii.lg,
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    ...Platform.select({
      ios: {
        shadowColor: '#2D1810',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.10,
        shadowRadius: 18,
      },
      android: { elevation: 4 },
    }),
  },
  // Card inner: clips header to rounded corners
  cardInner: {
    borderRadius: radii.lg,
    flex: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    overflow: 'hidden',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  headerOrbLarge: {
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 999,
    height: 130,
    position: 'absolute',
    right: -28,
    top: -28,
    width: 130,
  },
  headerOrbSmall: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    height: 72,
    position: 'absolute',
    bottom: -20,
    left: 24,
    width: 72,
  },
  headerGhost: {
    fontSize: 96,
    lineHeight: 100,
    opacity: 0.11,
    position: 'absolute',
    right: 10,
    bottom: 4,
  },
  badgeRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: 26,
    justifyContent: 'flex-end',
    marginBottom: spacing.xs,
  },
  badgeRowRtl: {
    justifyContent: 'flex-start',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderColor: 'rgba(255,255,255,0.40)',
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  tierIcon: {
    fontSize: 38,
    lineHeight: 46,
    marginBottom: 4,
  },
  tierLabel: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: typeScale.caption,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },

  cardBody: {
    backgroundColor: colors.surface,
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  priceRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  rowRtl: { flexDirection: 'row-reverse' },
  tierPrice: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 38,
  },
  tierPeriod: {
    color: colors.textMuted,
    fontSize: typeScale.body,
    fontWeight: '500',
  },
  featureList: {
    gap: spacing.xs,
  },
  featureRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
  },
  checkmark: {
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 20,
    marginTop: 1,
  },
  featureText: {
    color: colors.textSoft,
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },

  dots: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  dot: {
    backgroundColor: colors.dotInactive,
    borderRadius: radii.pill,
    height: 8,
    width: 8,
  },

  cta: {
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
  },

  rtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
