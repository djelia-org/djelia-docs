---
sidebar_position: 1
title: Legacy API
---

# Legacy API

Before the OpenAI-compatible surface, Djelia had its own endpoints under `/api/v1` and
`/api/v2`. They still work and existing integrations keep running, but they are in
maintenance: new capabilities land on
[`/openai/v1`](/quickstart) only.

If you are starting today, start there instead.

## Differences

| | Legacy | OpenAI-compatible |
| --- | --- | --- |
| Base | `https://djelia.cloud/api/v1`, `/api/v2` | `https://djelia.cloud/openai/v1` |
| Auth header | `x-api-key` | `Authorization: Bearer` (and `x-api-key`) |
| Errors | `{"detail": "..."}` | [OpenAI envelope](/errors) |
| Client | hand-written HTTP or the `djelia` package | any OpenAI SDK |
| Subtitles | not available | `srt`, `vtt` |
| Audio formats | mp3, wav | mp3, opus, aac, flac, wav, pcm, wav_8k, ulaw_8k |

The compatibility surface is a superset. Everything the legacy routes do has an
equivalent, and several things only exist on the new one.

## Endpoint mapping

| Legacy | Replacement |
| --- | --- |
| `POST /api/v1/models/translate` | `POST /openai/v1/chat/completions` with `djelia.source_language` and `djelia.target_language` |
| `GET /api/v1/models/translate/supported-languages` | See [Languages](/models#languages) |
| `POST /api/v1/models/transcribe` | `POST /openai/v1/audio/transcriptions` with `model=djelia-asr-v1` |
| `POST /api/v2/models/transcribe` | `POST /openai/v1/audio/transcriptions` with `model=djelia-asr-v2` |
| `POST /api/v{1,2}/models/transcribe?translate_to_french=true` | `POST /openai/v1/audio/translations` with `language=fra_Latn` |
| `POST /api/v{1,2}/models/transcribe/stream` | `POST /openai/v1/audio/transcriptions` with `stream=true` |
| `POST /api/v1/models/tts` | `POST /openai/v1/audio/speech` with `model=djelia-tts-v1` and `djelia.speaker` |
| `POST /api/v2/models/tts` | `POST /openai/v1/audio/speech` with `model=djelia-tts-v2` |
| `POST /api/v2/models/tts/stream` | `POST /openai/v1/audio/speech` with `stream_format=sse` |

## Migrating

Transcription is the easiest place to start, because it needs no extensions at all.

```diff
- curl https://djelia.cloud/api/v2/models/transcribe \
-   -H "x-api-key: $DJELIA_API_KEY" \
-   -F file=@audio.mp3
+ curl https://djelia.cloud/openai/v1/audio/transcriptions \
+   -H "Authorization: Bearer $DJELIA_API_KEY" \
+   -F file=@audio.mp3 \
+   -F model=djelia-asr-v2
```

Both surfaces accept the same keys and bill against the same wallet, so you can move one
endpoint at a time.

The full legacy reference is in the [API reference](/api) alongside the compatibility
surface.
