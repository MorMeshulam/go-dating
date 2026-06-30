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
import { colors, radii, shadows, spacing, typeScale } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 14;
const CARD_WIDTH = SCREEN_WIDTH - 72;
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2 - CARD_GAP / 2;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;
const CARD_HEIGHT = 292;

type Locale = 'en' | 'he';
type T = { en: string; he: string };

type PricingTier = {
  id: string;
  icon: string;
  label: T;
  price: string;
  period: T;
  description: T;
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
    description: {
      en: 'Acquisition funnel and habit formation.',
      he: 'כניסה לפלטפורמה וחיבור ראשוני.',
    },
    accent: '#A9C2D0',
  },
  {
    id: 'premium',
    icon: '✨',
    label: { en: 'Premium', he: 'פרמיום' },
    price: '₪49–79',
    period: { en: 'per month', he: 'לחודש' },
    description: {
      en: 'First paid tier for quality filters and better access.',
      he: 'שכבת תשלום ראשונה לסינון איכות וגישה משופרת.',
    },
    accent: '#FF5CA8',
    badge: { en: 'Most Popular', he: 'הפופולרי ביותר' },
  },
  {
    id: 'matchmaker',
    icon: '🎯',
    label: { en: 'Matchmaker', he: 'שדכן' },
    price: '₪149–249',
    period: { en: 'per month', he: 'לחודש' },
    description: {
      en: 'Hybrid expert-assisted experience.',
      he: 'חוויה היברידית בסיוע מומחים אנושיים.',
    },
    accent: '#B388FF',
  },
  {
    id: 'vip',
    icon: '👑',
    label: { en: 'VIP', he: 'VIP' },
    price: '₪499–999',
    period: { en: 'per month', he: 'לחודש' },
    description: {
      en: 'High-touch premium service with strongest margins.',
      he: 'שירות פרמיום אינטנסיבי עם מרווחים הגבוהים ביותר.',
    },
    accent: '#FFD27D',
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
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              {locale === 'he' ? 'בחרו תוכנית' : 'Choose a plan'}
            </Text>
          </View>
          <Text style={[styles.heroTitle, isRTL && styles.rtl]}>
            {locale === 'he'
              ? 'מונטיזציה מרובת שכבות\nעם פוטנציאל פרמיום'
              : 'Multi-tier monetization\nwith premium upside'}
          </Text>
          <Text style={[styles.heroSub, isRTL && styles.rtl]}>
            {locale === 'he'
              ? 'גלשו ימינה לצפייה בכל תוכניות המנוי'
              : 'Swipe to explore all subscription tiers'}
          </Text>
        </View>

        {/* ── Carousel ── */}
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

        {/* ── Dots ── */}
        <View style={styles.dots}>
          {TIERS.map((tier, i) => (
            <View
              key={tier.id}
              style={[
                styles.dot,
                i === activeIndex && {
                  backgroundColor: active.accent,
                  width: 22,
                },
              ]}
            />
          ))}
        </View>

        {/* ── Alt model row ── */}
        <View style={styles.altCard}>
          <Text style={[styles.altEyebrow, isRTL && styles.rtl]}>
            {locale === 'he' ? 'מודל חלופי' : 'Alternative model'}
          </Text>
          <View style={[styles.altRow, isRTL && styles.rowRtl]}>
            <View style={styles.altItem}>
              <Text style={[styles.altLabel, isRTL && styles.rtl]}>
                {locale === 'he' ? 'תשלום להתאמה' : 'Pay-per-match'}
              </Text>
              <Text style={[styles.altPrice, { color: colors.accent }]}>₪19–39</Text>
            </View>
            <View style={styles.altDivider} />
            <View style={styles.altItem}>
              <Text style={[styles.altLabel, isRTL && styles.rtl]}>
                {locale === 'he' ? 'פתיחת שיחה' : 'Conversation unlock'}
              </Text>
              <Text style={[styles.altPrice, { color: colors.accentStrong }]}>₪9–19</Text>
            </View>
          </View>
        </View>

        {/* ── CTAs ── */}
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
    <View
      style={[
        styles.card,
        {
          borderColor: isActive ? tier.accent + '90' : colors.border,
          borderWidth: isActive ? 1.5 : 1,
          transform: [{ scale: isActive ? 1 : 0.93 }],
          opacity: isActive ? 1 : 0.58,
        },
      ]}
    >
      {/* Colored top strip */}
      <View
        style={[
          styles.topStrip,
          { backgroundColor: tier.accent },
          isActive && { height: 5 },
        ]}
      />

      {/* Badge */}
      {tier.badge ? (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: tier.accent + '1A',
              borderColor: tier.accent + '55',
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: tier.accent }]}>
            {loc(tier.badge)}
          </Text>
        </View>
      ) : (
        <View style={styles.badgeSpacer} />
      )}

      <Text style={styles.tierIcon}>{tier.icon}</Text>

      <Text
        style={[styles.tierLabel, { color: tier.accent }, isRTL && styles.rtl]}
      >
        {loc(tier.label)}
      </Text>

      <View
        style={[
          styles.priceRow,
          isRTL && styles.rowRtl,
        ]}
      >
        <Text style={styles.tierPrice}>{tier.price}</Text>
        <Text style={styles.tierPeriod}> / {loc(tier.period)}</Text>
      </View>

      <Text style={[styles.tierDescription, isRTL && styles.rtl]}>
        {loc(tier.description)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1,
  },

  // ── Orbs ──
  orb: {
    borderRadius: 999,
    position: 'absolute',
  },
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

  // ── Layout ──
  safe: {
    flex: 1,
  },

  // ── Header ──
  header: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  pill: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    marginBottom: spacing.md,
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
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.7,
    lineHeight: 34,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  heroSub: {
    color: colors.textMuted,
    fontSize: typeScale.body,
    textAlign: 'center',
  },

  // ── Card ──
  card: {
    ...Platform.select({
      ios: {
        shadowColor: '#2D1810',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
      },
      android: { elevation: 4 },
    }),
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    height: CARD_HEIGHT,
    overflow: 'hidden',
    padding: spacing.xl,
    width: CARD_WIDTH,
  },
  topStrip: {
    height: 4,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  badgeSpacer: {
    height: 22,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  tierIcon: {
    fontSize: 34,
    marginBottom: 6,
    marginTop: spacing.xs,
  },
  tierLabel: {
    fontSize: typeScale.caption,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  priceRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  tierPrice: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1.2,
    lineHeight: 44,
  },
  tierPeriod: {
    color: colors.textMuted,
    fontSize: typeScale.body,
    fontWeight: '500',
  },
  tierDescription: {
    color: colors.textMuted,
    fontSize: typeScale.body,
    lineHeight: 22,
  },

  // ── Dots ──
  dots: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  dot: {
    backgroundColor: colors.dotInactive,
    borderRadius: radii.pill,
    height: 8,
    width: 8,
  },

  // ── Alt model ──
  altCard: {
    ...Platform.select({
      ios: {
        shadowColor: '#2D1810',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
    backgroundColor: colors.overlay,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.md,
    marginHorizontal: spacing.xl,
    padding: spacing.md,
  },
  altEyebrow: {
    color: colors.textMuted,
    fontSize: typeScale.caption,
    fontWeight: '700',
    letterSpacing: 0.9,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  altRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  altItem: {
    alignItems: 'center',
    flex: 1,
  },
  altLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 3,
    textAlign: 'center',
  },
  altPrice: {
    fontSize: typeScale.title,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  altDivider: {
    backgroundColor: colors.border,
    height: 44,
    width: 1,
  },

  // ── CTAs ──
  cta: {
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
  },

  // ── RTL ──
  rtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
