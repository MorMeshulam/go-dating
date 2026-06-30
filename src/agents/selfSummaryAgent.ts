import type { InputVerifier, VerificationIssueCode } from './types';

const MIN_WORDS = 12;
const MAX_WORD_LENGTH = 24;
const MIN_LETTER_RATIO = 0.55;
const MIN_VARIETY_RATIO = 0.5;

// Latin (incl. accented) and Hebrew letters — enough to gauge "is this real text".
const LETTER_PATTERN = /[A-Za-zÀ-ɏ֐-׿]/g;
// Six or more of the same character in a row (e.g. "aaaaaa", keyboard mashing).
const REPEAT_RUN_PATTERN = /(.)\1{5,}/;

/**
 * First verification agent: judges a member's self-description. Rule-based v1 —
 * checks the story is long enough, has real substance, and isn't junk/gibberish.
 * Swap with a Claude-backed server call later without changing the contract.
 */
export const verifySelfSummary: InputVerifier = (text, context) => {
  const minLength = context.minLength ?? 80;
  const maxLength = context.maxLength ?? 320;

  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const letterCount = (trimmed.match(LETTER_PATTERN) ?? []).length;
  const letterRatio = trimmed.length ? letterCount / trimmed.length : 0;
  const longestWord = words.reduce(
    (max, word) => Math.max(max, word.length),
    0,
  );
  const uniqueWords = new Set(words.map(word => word.toLowerCase()));
  const varietyRatio = words.length ? uniqueWords.size / words.length : 0;

  const issues: VerificationIssueCode[] = [];

  const looksLikeGibberish =
    letterRatio < MIN_LETTER_RATIO ||
    longestWord > MAX_WORD_LENGTH ||
    REPEAT_RUN_PATTERN.test(trimmed);

  if (looksLikeGibberish) {
    issues.push('gibberish');
  }

  if (trimmed.length < minLength) {
    issues.push('too_short');
  }

  if (trimmed.length > maxLength) {
    issues.push('too_long');
  }

  if (words.length < MIN_WORDS) {
    issues.push('too_few_words');
  }

  if (words.length >= 6 && varietyRatio < MIN_VARIETY_RATIO) {
    issues.push('low_variety');
  }

  return {
    status: issues.length === 0 ? 'approved' : 'needs_changes',
    issues,
  };
};
