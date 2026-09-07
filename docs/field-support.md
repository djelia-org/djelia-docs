---
sidebar_position: 7
title: Field support
description: Every OpenAI parameter Djelia accepts, honours, or ignores.
---

# Field Support

The tables below clarify which fields Djelia fully supports, which it accepts for compatibility, and which are simply ignored. Fields Djelia cannot honor are silently accepted and disregarded—they are never rejected—ensuring that your existing OpenAI integrations continue working seamlessly when you switch endpoints. Every field that Djelia ignores is explicitly listed here for your reference.

## `POST /audio/speech`

| Field            | Status                                                                                                                               |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| `model`          | Use `jifili-1`                                                                                                                      |
| `input`          | Supported. Maximum 1000 characters.                                                                                                  |
| `voice`          | `moussa`, `alloy`, `nova`, `coral`. The last three are OpenAI aliases that map to `moussa`. Any other value returns 400 `unsupported_voice`. |
| `response_format`| `mp3` (default), `wav`, `pcm`, `opus`, `ulaw`, `alaw`, `l16_8000`, `l16_16000`, `fmp4`                                              |
| `stream_format`  | `audio` (default) or `sse`                                                                                                          |
| `speed`          | **Ignored**                                                                                                                          |
| `instructions`   | **Ignored**                                                                                                                          |

The `pcm` format is headerless 16-bit signed little-endian mono at 24 kHz, just like OpenAI. For `l16_8000` and `l16_16000`, the same structure is used, but at 8 kHz and 16 kHz sample rates, respectively.

For more control over speech sampling, use the [Djelia extensions](/extensions#speech-sampling). Note that the legacy `djelia.description` and `djelia.speaker` fields are not recognized by the `jifili-1` model. While `djelia.chunk_size` is checked for validity, it is not applied—Djelia automatically determines the optimal streamed chunk size for your output.

## `POST /audio/transcriptions`

| Field | Status |
| --- | --- |
| `file` | Fully supported |
| `model` | Use `sunjata-1` |
| `response_format` | `json` (default), `text`, `verbose_json`, `srt`, `vtt` |
| `stream` | Supported with `response_format` `json` or `text` |
| `language` | **Ignored.** Djelia's ASR is Bambara-only |
| `prompt` | **Ignored** |
| `temperature` | Supported |
| `timestamp_granularities` | **Ignored.** Segment timings are always returned in `verbose_json` |

Djelia's ASR returns per-segment timings, so `verbose_json`, `srt` and `vtt` all carry
real timestamps. Within `verbose_json` segments, `tokens` is always an empty list, and
`seek`, `temperature`, `avg_logprob`, `compression_ratio` and `no_speech_prob` are
always 0: the fields exist so the SDK response models parse, but Djelia does not
produce those statistics.

## `POST /audio/translations`

| Field | Status |
| --- | --- |
| `file` | Fully supported |
| `model` | Use `sunjata-1` |
| `response_format` | Supported: `json` (default), `text` |
| `language` | **Djelia extension.** `eng_Latn` (default) or `fra_Latn`. OpenAI's endpoint is English-only |
| `prompt` | **Ignored** |
| `temperature` | Supported by the transcription step |

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
| `model` | Use `banjugu-1` |
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

## Request Limits

- Speech input accepts up to 1,000 characters.
- The `djelia.chunk_size` parameter must be set between 0.1 and 2.0 seconds.
- Translation requires that the source and target languages are different, and both must be valid supported codes.
- Speech translation responses are available only in `json` or `text` formats.

If any request parameter is invalid, you’ll receive an error formatted according to [OpenAI’s style](/errors).
