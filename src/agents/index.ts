import { verifySelfSummary } from './selfSummaryAgent';
import type { InputVerifier } from './types';

/** Failed attempts allowed before a step is blocked and sent for expert review. */
export const MAX_VERIFICATION_ATTEMPTS = 5;

/** Question id -> verification agent. Extend this as more steps get verified. */
const verifiersByQuestionId: Record<string, InputVerifier> = {
  self_summary: verifySelfSummary,
};

export function getInputVerifier(
  questionId: string,
): InputVerifier | undefined {
  return verifiersByQuestionId[questionId];
}

export type {
  VerificationVerdict,
  VerificationIssueCode,
  VerificationStatus,
} from './types';
