---
sidebar_position: 4
title: curl
---

# curl

Useful for checking a key, debugging a payload, or calling Djelia from a language with
no OpenAI SDK.

## Speech

```bash
curl https://djelia.cloud/openai/v1/audio/speech \
  -H "Authorization: Bearer $DJELIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "djelia-tts-v2",
    "input": "Aw ni ce, i ka kene wa?",
    "voice": "moussa"
  }' \
  --output hello.mp3
```

## Transcription

```bash
curl https://djelia.cloud/openai/v1/audio/transcriptions \
  -H "Authorization: Bearer $DJELIA_API_KEY" \
  -F file=@hello.mp3 \
  -F model=djelia-asr-v2
```

## Translating speech to French

```bash
curl https://djelia.cloud/openai/v1/audio/translations \
  -H "Authorization: Bearer $DJELIA_API_KEY" \
  -F file=@hello.mp3 \
  -F model=djelia-asr-v2 \
  -F language=fra_Latn
```

## Translating text

The `djelia` extension object is a plain top-level key in the JSON body.

```bash
curl https://djelia.cloud/openai/v1/chat/completions \
  -H "Authorization: Bearer $DJELIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "djelia-translate-v1",
    "messages": [{"role": "user", "content": "Bonjour, comment allez-vous ?"}],
    "djelia": {"source_language": "fra_Latn", "target_language": "bam_Latn"}
  }'
```

## Listing models

```bash
curl https://djelia.cloud/openai/v1/models \
  -H "Authorization: Bearer $DJELIA_API_KEY"
```
