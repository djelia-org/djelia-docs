---
sidebar_position: 2
title: JavaScript
---

# JavaScript and TypeScript

```bash
npm install openai
```

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DJELIA_API_KEY,
  baseURL: "https://djelia.cloud/openai/v1",
});
```

Note the capitalisation: it is `baseURL` here, not `base_url`.

## Djelia extensions

`openai-node` has no `extra_body`. Unknown keys on the params object are sent as-is,
but TypeScript's excess property check rejects them on an object literal. Spreading the
extension keeps it quiet without a cast or a `@ts-expect-error`:

```typescript
const completion = await client.chat.completions.create({
  model: "djelia-translate-v1",
  messages: [{ role: "user", content: "Bonjour, comment allez-vous ?" }],
  ...{ djelia: { source_language: "fra_Latn", target_language: "bam_Latn" } },
});
```

Djelia's voice names need no such treatment: `voice` is typed permissively, so
`voice: "moussa"` type-checks as it is.

## Speech to a file

```javascript
import fs from "node:fs";

const speech = await client.audio.speech.create({
  model: "djelia-tts-v2",
  input: "Aw ni ce, i ka kene wa?",
  voice: "moussa",
});

fs.writeFileSync("hello.mp3", Buffer.from(await speech.arrayBuffer()));
```

## Transcription

```javascript
const transcript = await client.audio.transcriptions.create({
  file: fs.createReadStream("hello.mp3"),
  model: "djelia-asr-v2",
});

console.log(transcript.text);
```

## The `djelia` npm package

[`djelia-js-sdk`](https://github.com/djelia-org/djelia-js-sdk) predates the
compatibility surface and does not support it. Use `openai` directly.
