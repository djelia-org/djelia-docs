---
sidebar_position: 5
title: Models
---

# Models

| Model | Capability | Notes |
| --- | --- | --- |
| `djelia-asr-v2` | transcription | Default. Best on short audio containing French words |
| `djelia-asr-v1` | transcription | First generation |
| `djelia-tts-v2` | speech | Default. Prompt-steerable voices |
| `djelia-tts-v1` | speech | Fixed speaker ids; no voice steering |
| `djelia-translate-v1` | translation | Bambara ↔ French ↔ English |

List them at runtime with `GET /openai/v1/models`, or `client.models.list()`.

## OpenAI aliases

OpenAI model names are accepted as aliases, so an existing integration works after only
a base URL swap. Responses always report the canonical Djelia id, so nothing is
misrepresented as an OpenAI model.

| Alias | Resolves to |
| --- | --- |
| `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe` | `djelia-asr-v2` |
| `tts-1`, `tts-1-hd`, `gpt-4o-mini-tts` | `djelia-tts-v2` |

## Voices

`djelia-tts-v2` has three named voices. For anything outside these three, describe the
voice you want with [`djelia.description`](/extensions#prompt-steerable-voices-with-djeliadescription).

| Voice | Character |
| --- | --- |
| `moussa` | Very clear, warm and friendly |
| `sekou` | Calm and measured, neutral tone |
| `seydou` | Bright and energetic, expressive |

OpenAI's voice names map onto these, so an existing integration keeps working:

| OpenAI voice | Djelia voice |
| --- | --- |
| `alloy`, `nova`, `coral` | `moussa` |
| `echo`, `onyx`, `ash`, `sage` | `sekou` |
| `fable`, `shimmer`, `ballad`, `verse` | `seydou` |

A name outside both sets returns 400.

## Languages

Language codes follow the FLORES-200 convention.

| Code | Language |
| --- | --- |
| `bam_Latn` | Bambara (Bamanankan) |
| `fra_Latn` | French |
| `eng_Latn` | English |

Transcription is Bambara-only, so `/audio/transcriptions` ignores `language`.
