---
sidebar_position: 1
slug: /
title: Introduction
---

# Djelia

Djelia is an API for African languages. Today that means **Bambara** (Bamanankan),
spoken by roughly 15 million people in Mali and across West Africa: speech to text,
text to speech, and translation between Bambara, French and English.

## Djelia speaks OpenAI

The API follows the OpenAI convention. Any OpenAI-compatible client reaches Djelia by
changing three things, and nothing else:

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_DJELIA_API_KEY",          # 1. your key
    base_url="https://djelia.cloud/openai/v1",  # 2. the base URL
)

client.audio.speech.create(
    model="djelia-tts-v2",                   # 3. a Djelia model
    input="Aw ni ce, i ka kene wa?",
    voice="moussa",
)
```

That means the official OpenAI SDKs work as they are, in every language they ship in,
along with everything built on top of them: LiteLLM, LangChain, the Vercel AI SDK, n8n,
Dify, Open WebUI. You do not need a Djelia-specific library, and there is nothing to
learn beyond the model names.

[Start here →](/quickstart)

## What you can do

| Capability | Endpoint | Models |
| --- | --- | --- |
| Bambara speech → text | `/audio/transcriptions` | `djelia-asr-v2`, `djelia-asr-v1` |
| Bambara speech → English or French text | `/audio/translations` | `djelia-asr-v2`, `djelia-asr-v1` |
| Text → Bambara speech | `/audio/speech` | `djelia-tts-v2`, `djelia-tts-v1` |
| Text translation | `/chat/completions` | `djelia-translate-v1` |

## Where things live

- **[Quickstart](/quickstart)** gets you a working call in your language in about a minute
- **[API reference](/api)** is generated from the API's own OpenAPI spec
- **[Djelia extensions](/extensions)** covers the capabilities OpenAI's shape has no slot for
- **[Integrations](/integrations/python)** has per-language and per-framework guides
- **[Legacy API](/legacy/native-api)** documents the older `/api/v1` and `/api/v2` routes

## Getting a key

Keys are created in the [Djelia Console](https://console.djelia.cloud). New
organisations start with a wallet you top up; requests are metered per character of
text and per second of audio. See [Errors](/errors) for what a depleted wallet
looks like.
