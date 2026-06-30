# Agents

Three AI agent definitions for the GoDating platform.

## Files

| File                 | Type          | Purpose                                                                 |
| -------------------- | ------------- | ----------------------------------------------------------------------- |
| `product-manager.md` | System prompt | PM agent with full product, business, and industry context              |
| `personalization.md` | System prompt | Reads a user's profile answers and personalizes their experience        |
| `matching-engine.ts` | TypeScript    | Pure scoring logic — returns a 0–100 compatibility score with breakdown |

## Using the system prompts (Claude API)

```ts
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';

const client = new Anthropic();

const systemPrompt = readFileSync('./agents/product-manager.md', 'utf8');

const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  system: systemPrompt,
  messages: [
    {
      role: 'user',
      content: 'What should we prioritize after the pricing carousel?',
    },
  ],
});
```

Swap in `personalization.md` and pass the user's `ProfileAnswerMap` as JSON in the user message.

## Using the matching engine

```ts
import { scoreCompatibility } from './agents/matching-engine';

const result = scoreCompatibility(userProfile, candidateProfile);

if (!result.isViable) {
  // hard gender filter failed — skip candidate
}

console.log(result.total); // 0–100
console.log(result.breakdown); // per-dimension scores
console.log(result.explanation.he); // bilingual explanation
```

To integrate with the existing discovery layer, replace the ad-hoc score formula in `src/features/discovery/matchmaking.ts` with a call to `scoreCompatibility`.
