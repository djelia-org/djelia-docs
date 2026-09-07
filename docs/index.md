---
sidebar_position: 1
slug: /
title: Introduction
---

# Djelia

Djelia is an API for African languages. Today that means **Bambara** (Bamanankan),
spoken by roughly 15 million people in Mali and across West Africa: speech to text, text to speech, and translation between Bambara, French and English.

## Djelia speaks OpenAI

Djelia implements the OpenAI API format, making integration simple. Most OpenAI clients work out of the box—just update your API key, base URL, and model name.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["DJELIA_API_KEY"],
    base_url="https://api.djelia.cloud/openai/v1",
)

response = client.audio.speech.create(
    model="jifili-1",
    input="Aw ni ce, i ka kene wa?",
    voice="moussa",
)
response.write_to_file("hello.mp3")
```

This means you can use the official OpenAI SDKs exactly as they are, in every language they support. All tools and frameworks built on top of these SDKs—such as LiteLLM, LangChain, the Vercel AI SDK, n8n, Dify, and Open WebUI—work seamlessly with Djelia. There’s no need for a Djelia-specific library or any new learning curve beyond the model names.

[Get started with the quickstart ->](/quickstart)

New organizations begin with a prepaid wallet. Usage is billed by character for text or by audio duration, giving you transparent, flexible pricing.

## Available Models

| Capability         | Endpoint                      | Model        |
|--------------------|------------------------------|--------------|
| Speech to text     | `POST /audio/transcriptions` | `sunjata-1`  |
| Speech translation | `POST /audio/translations`   | `sunjata-1`  |
| Text to speech     | `POST /audio/speech`         | `jifili-1`   |
| Text translation   | `POST /chat/completions`     | `banjugu-1`  |

See the [Models page](/models) for the latest supported languages, voices, and output formats. If you currently use a `djelia-*-v*` model, please consult our [migration guide](/migration).

Please note: the older `/api/v1` and `/api/v2` endpoints are deprecated and will be retired on September 20, 2026. Refer to the [model migration guide](/migration) and [Legacy API documentation](/legacy/native-api) for details. All new integrations should use `/openai/v1`.
