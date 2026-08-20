---
sidebar_position: 7
title: Vercel AI SDK
---

# Vercel AI SDK

Use the OpenAI-compatible provider.

```bash
npm install ai @ai-sdk/openai-compatible
```

```typescript
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";

const djelia = createOpenAICompatible({
  name: "djelia",
  baseURL: "https://djelia.cloud/openai/v1",
  apiKey: process.env.DJELIA_API_KEY,
});
```

## Speech and transcription

`@ai-sdk/openai-compatible` covers text generation. For `/audio/speech`,
`/audio/transcriptions` and `/audio/translations`, use the
[OpenAI SDK](/integrations/javascript) alongside it.

## Translation, and the doubled `djelia` key

```typescript
const { text } = await generateText({
  model: djelia("djelia-translate-v1"),
  prompt: "Bonjour, comment allez-vous ?",
  providerOptions: {
    djelia: { djelia: { source_language: "fra_Latn", target_language: "bam_Latn" } },
  },
});
```

```text
Nbá, í ni sɔ̀gɔmà ?
```

The repetition is not a typo, and it is worth understanding before someone tidies it
away.

The outer `djelia` is the **provider name** you passed to `createOpenAICompatible`. That
is how the AI SDK decides which provider a block of options belongs to. It then
**flattens** the contents of that block into the root of the request body rather than
sending it as a nested object. So the inner `djelia` is what survives that flattening
and becomes the [extension object](/extensions) Djelia reads.

Writing it once sends the fields bare at the top level, and the request fails:

```json
// providerOptions: { djelia: { source_language: ..., target_language: ... } }
{"model":"djelia-translate-v1","source_language":"fra_Latn","target_language":"bam_Latn","messages":[…]}
// → 400  djelia: Field required
```

Writing it twice sends what Djelia expects:

```json
// providerOptions: { djelia: { djelia: { source_language: ..., target_language: ... } } }
{"model":"djelia-translate-v1","djelia":{"source_language":"fra_Latn","target_language":"bam_Latn"},"messages":[…]}
// → 200
```

If you rename the provider, rename **the outer key only**. The inner one is Djelia's
wire format and never changes.

:::caution
Djelia's translation model has no tool use, no system-prompt steering and no
conversational memory. It translates the last user message. `streamText` works, but
because translation is not incremental it emits the whole result as a single chunk.
:::
