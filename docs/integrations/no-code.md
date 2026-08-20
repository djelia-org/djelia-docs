---
sidebar_position: 9
title: No-code tools
---

# No-code tools

Anything that can talk to an OpenAI-compatible endpoint can talk to Djelia. The settings
are always the same three:

| Setting | Value |
| --- | --- |
| Base URL / API base | `https://djelia.cloud/openai/v1` |
| API key | your Djelia key |
| Model | `djelia-translate-v1`, `djelia-asr-v2` or `djelia-tts-v2` |

## Open WebUI

Settings → Connections → OpenAI API. Set the base URL and key above. Djelia's models
appear in the model picker, since `/models` is implemented.

Translation is a chat model, so it works in the chat interface, but it needs a language
pair. Open WebUI has no field for arbitrary body parameters, so put Djelia behind a
[LiteLLM proxy](/integrations/litellm) with the pair configured there, and point Open
WebUI at the proxy.

## n8n

Use the **OpenAI** node with a custom credential: set the base URL to
`https://djelia.cloud/openai/v1` and paste your key. For the language pair, the HTTP
Request node is usually simpler than fighting the OpenAI node's fixed fields.

## Dify

Model Provider → OpenAI-API-compatible. Add the base URL and key, then declare each
Djelia model you want with its capability (LLM for translation, Speech2Text for ASR,
TTS for speech).

## Anything else

If a tool asks for an "OpenAI-compatible base URL", it will work. The one thing to check
is whether it lets you send extra body parameters, which is what the language pair for
translation needs. If it does not, a [LiteLLM proxy](/integrations/litellm) in front of
Djelia solves it, because the pair can live in `config.yaml` instead.

Transcription and speech need no extensions, so they work anywhere without a proxy.
