/** Outcome of an input-verification agent run. */
export type VerificationStatus = 'approved' | 'needs_changes' | 'blocked';

/** Machine-readable reasons an input failed, mapped to localized copy in the UI. */
export type VerificationIssueCode =
  | 'too_short'
  | 'too_long'
  | 'too_few_words'
  | 'low_variety'
  | 'gibberish';

export type VerificationVerdict = {
  status: VerificationStatus;
  issues: VerificationIssueCode[];
};

export type VerificationContext = {
  minLength?: number;
  maxLength?: number;
};

/**
 * An agent that judges a single free-text input. Synchronous today (heuristic),
 * but the call sites await nothing specific to that — a future version can be a
 * thin wrapper over a server endpoint that runs the real model.
 */
export type InputVerifier = (
  text: string,
  context: VerificationContext,
) => VerificationVerdict;
