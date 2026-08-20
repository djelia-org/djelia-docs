---
sidebar_position: 6
title: Field support
description: Every OpenAI parameter Djelia accepts, honours, or ignores.
---

# Field support

Parameters Djelia cannot honour are **accepted and ignored** rather than rejected, so an
existing OpenAI integration keeps working when it is repointed here. Every ignored field
is listed below, so nothing is silently surprising.

## `POST /audio/speech`

| Field | Status |
| --- | --- |
| `model` | Use a Djelia speech model |
| `input` | Fully supported. Maximum 1000 characters |
| `voice` | Supported on `djelia-tts-v2`. Djelia voices, with OpenAI names as aliases. Ignored by `djelia-tts-v1`, which uses `djelia.speaker` |
| `response_format` | Supported: `mp3` (default), `opus`, `aac`, `flac`, `wav`, `pcm`, plus `wav_8k` and `ulaw_8k` |
| `stream_format` | Supported on `djelia-tts-v2`: `audio` (default), `sse`. Ignored by `djelia-tts-v1`, which returns a complete file |
| `speed` | **Ignored** |
| `instructions` | **Ignored.** Use [`djelia.description`](/extensions) instead |

`pcm` is headerless 16-bit signed little-endian mono at 24 kHz, matching OpenAI.

## `POST /audio/transcriptions`

| Field | Status |
| --- | --- |
| `file` | Fully supported |
| `model` | Use a Djelia transcription model |
| `response_format` | Supported: `json` (default), `text`, `verbose_json`, `srt`, `vtt` |
| `stream` | Supported with `response_format` `json` or `text` |
| `language` | **Ignored.** Djelia's ASR is Bambara-only |
| `prompt` | **Ignored** |
| `temperature` | **Ignored** |
| `timestamp_granularities` | **Ignored.** Segment timings are always returned in `verbose_json` |

Djelia's ASR returns per-segment timings, so `verbose_json`, `srt` and `vtt` all carry
real timestamps. Within `verbose_json` segments, `tokens`, `avg_logprob`,
`compression_ratio` and `no_speech_prob` are always zero: the fields exist so the SDK
response models parse, but Djelia does not produce those statistics.

## `POST /audio/translations`

| Field | Status |
| --- | --- |
| `file` | Fully supported |
| `model` | Use a Djelia transcription model |
| `response_format` | Supported: `json` (default), `text` |
| `language` | **Djelia extension.** `eng_Latn` (default) or `fra_Latn`. OpenAI's endpoint is English-only |
| `prompt` | **Ignored** |
| `temperature` | **Ignored** |

`srt`, `vtt` and `verbose_json` return 400 here: translation does not preserve
per-segment timings, so subtitle output would carry timings that no longer line up with
the translated words.

:::info Billing
This endpoint runs two models, so it is charged for two: the transcription per second of
audio, and the translation per character of the transcript, each at its own rate. They
appear as two usage records against the same request. A translation that fails is not
charged.
:::

## `POST /chat/completions`

Text translation has no dedicated endpoint in the OpenAI shape, so Djelia's translation
model is addressed as a chat model. The text to translate is the last user message, and
the language pair rides in [`djelia`](/extensions).

| Field | Status |
| --- | --- |
| `model` | Use `djelia-translate-v1` |
| `messages` | Supported. String content and `type: "text"` content parts both work |
| `stream` | Supported |
| `temperature`, `top_p`, `n`, `max_tokens`, `max_completion_tokens`, `stop` | **Ignored** |
| `presence_penalty`, `frequency_penalty`, `logit_bias`, `seed` | **Ignored** |
| `logprobs`, `top_logprobs` | **Ignored** |
| `response_format`, `tools`, `tool_choice` | **Ignored.** Djelia's translation model has no tool use |
| `user`, `store`, `metadata`, `service_tier`, `stream_options` | **Ignored** |
| `messages[].name` | **Ignored** |
| Image, audio and file content parts | **Ignored** |

:::info Usage counts are characters, not tokens
Djelia meters translation per character, and `usage` reports what you are actually
billed for.
:::

Because translation is not incremental, `stream=True` emits the whole translation as a
single content delta followed by the terminating chunk, rather than token-by-token
output.
