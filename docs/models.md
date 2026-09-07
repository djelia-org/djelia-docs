---
sidebar_position: 5
title: Models
---

# Models

Djelia model names clearly identify each public capability family. The number following the dash indicates the generation of that family.

| Model | Capability | Endpoint | Status |
| --- | --- | --- | --- |
| `sunjata-1` | Bambara speech-to-text | `/audio/transcriptions`, `/audio/translations` | Current |
| `jifili-1` | Bambara text-to-speech | `/audio/speech` | Current |
| `banjugu-1` | Bambara, French, and English text translation | `/chat/completions` | Current |
| `djelia-asr-v1` | Bambara speech recognition, first generation | `/audio/transcriptions`, `/audio/translations` | Available until September 19, 2026 |
| `djelia-asr-v2` | Bambara speech recognition, optimized for short audio with French content | `/audio/transcriptions`, `/audio/translations` | Available until September 19, 2026 |
| `djelia-tts-v1` | Bambara speech synthesis with fixed speaker IDs | `/audio/speech` | Available until September 19, 2026 |
| `djelia-tts-v2` | Bambara speech synthesis with prompt-steerable voices | `/audio/speech` | Available until September 19, 2026 |

The aliases `djelia-asr-v3`, `djelia-tts-v3`, and `djelia-translate-v1` resolve to `sunjata-1`, `jifili-1`, and `banjugu-1` respectively.

To view the models accessible with your key, use `GET /openai/v1/models` or `client.models.list()`.

## OpenAI Model Aliases

Djelia accepts OpenAI model names as aliases, enabling most integrations to work seamlessly—just swap out the base URL.

| Alias | Resolves to |
| --- | --- |
| `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe` | `sunjata-1` |
| `tts-1`, `tts-1-hd`, `gpt-4o-mini-tts` | `jifili-1` |

All responses return the canonical Djelia model ID for complete transparency—there’s no risk of misidentifying a model as OpenAI’s.

## `sunjata-1`

`sunjata-1` excels at transcribing Bambara audio. Calling `/audio/transcriptions` provides results in Bambara, while `/audio/translations` returns English by default or French if you set `language=fra_Latn`.

Supported transcription response formats include: `json`, `text`, `verbose_json`, `srt`, and `vtt`. You can stream with `json` and `text`. The `temperature` field is supported for sampling.

## `jifili-1`

Use `jifili-1` to generate Bambara speech. The current default voice is `moussa`.

Output formats supported: `mp3`, `wav`, `pcm`, `opus`, `ulaw`, `alaw`, `l16_8000`, `l16_16000`, and `fmp4`. For streamed audio, set `stream_format="sse"` to receive `speech.audio.delta` events; otherwise, you receive audio bytes.

Sampling parameters can be tuned via `djelia.temperature`, `djelia.top_p`, and `djelia.repetition_penalty`. More details are available under [Djelia extensions](/extensions).

## Legacy Voices

Until September 19, 2026, `djelia-tts-v2` includes three voices:  
- `moussa`
- `sekou` (calm and measured)
- `seydou` (bright and energetic)

OpenAI voice names map to Djelia voices as follows:

| OpenAI voice | Djelia voice |
| --- | --- |
| `alloy`, `nova`, `coral` | `moussa` |
| `echo`, `onyx`, `ash`, `sage` | `sekou` |
| `fable`, `shimmer`, `ballad`, `verse` | `seydou` |

`jifili-1` provides the `moussa` voice.

## `banjugu-1`

`banjugu-1` enables seamless translation via `/chat/completions`. Provide the text to translate in the last user message and specify the language pair using `djelia.source_language` and `djelia.target_language`.

## Languages

Djelia adheres to the FLORES-200 language codes.

| Code | Language |
| --- | --- |
| `bam_Latn` | Bambara (Bamanankan) |
| `fra_Latn` | French |
| `eng_Latn` | English |

Translation usage is counted in characters. Streamed translations are delivered as a single content delta, since the model generates the entire translation before responding.

## Previous Model Names

The legacy models `djelia-asr-v1`, `djelia-asr-v2`, `djelia-tts-v1`, and `djelia-tts-v2` are being phased out. They will be supported until September 19, 2026, after which they will return 404 errors.

Aliases like `djelia-asr-v3`, `djelia-tts-v3`, `djelia-translate-v1`, and the OpenAI model names now point to `sunjata-1`, `jifili-1`, and `banjugu-1`, inheriting the current behavior. For complete details on model mapping and changes, refer to the [model migration guide](/migration).
