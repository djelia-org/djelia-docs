---
sidebar_position: 6
title: API migration guide
description: Move from the Djelia SDKs and the native API, retired on September 20, 2026, to the OpenAI-compatible API on api.djelia.cloud.
---

# API migration guide

On September 20, 2026, the native Djelia API and the `djelia-*-v*` model names were retired. The only public API is now the OpenAI-compatible API at `https://api.djelia.cloud/openai/v1`, with the models `sunjata-1`, `jifili-1` and `banjugu-1`. You can call it with the official OpenAI SDKs.

## What changed

- The native endpoints `/v1/models/*` and `/v2/models/*`, and their `/api/v1` and `/api/v2` twins, were retired on September 20, 2026.
- The model ids `djelia-asr-v1`, `djelia-asr-v2`, `djelia-asr-v3`, `djelia-tts-v1`, `djelia-tts-v2`, `djelia-tts-v3` and `djelia-translate-v1` were retired on the same date. See [Model names](#model-names).
- `jifili-1` ignores `djelia.speaker`, `djelia.description` and `djelia.chunk_size`, and returns 400 for the formats `wav_8k`, `ulaw_8k`, `aac` and `flac`.
- API requests go to `https://api.djelia.cloud`. The old host `https://djelia.cloud` still answers for now, with `Deprecation` and successor `Link` headers.

| If you use | Do this |
| --- | --- |
| Djelia Python SDK | Move to the official OpenAI Python SDK |
| Djelia JavaScript SDK | Move to the official OpenAI JavaScript SDK |
| A native curl request | Move it to `https://api.djelia.cloud/openai/v1` |
| A `djelia-*-v*` model | Replace it using [Model names](#model-names) |
| `https://djelia.cloud` | Change API requests to `https://api.djelia.cloud` |

## What an old call gets now

A request that names a retired model returns HTTP 410 with `code: "model_retired"`:

```json
{
  "error": {
    "message": "The model `djelia-asr-v2` was retired on 2026-09-20. Use `sunjata-1` instead. Migration guide: https://docs.djelia.cloud/migration/",
    "type": "invalid_request_error",
    "param": "model",
    "code": "model_retired"
  }
}
```

A request to a native endpoint returns HTTP 410 with `code: "endpoint_retired"`, whatever the method:

```json
{
  "error": {
    "message": "The native endpoint `POST /v1/models/translate` was retired on 2026-09-20. Use the OpenAI-compatible API at https://api.djelia.cloud/openai/v1 with the model `banjugu-1`. Migration guide: https://docs.djelia.cloud/migration/",
    "type": "invalid_request_error",
    "param": null,
    "code": "endpoint_retired"
  }
}
```

## Python

### Set up the client

Before, with the Djelia SDK:
```python
from djelia import Djelia
from djelia.models import Language, Versions
djelia = Djelia()
```
After, with the OpenAI SDK:
```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["DJELIA_API_KEY"],
    base_url="https://api.djelia.cloud/openai/v1",
)
```

Install the `openai` package with `pip install openai`. The [Djelia Python SDK](https://github.com/djelia-org/djelia-python-sdk) calls the retired native endpoints, so it no longer works.

### Speech to text

#### Streaming

Before, with the Djelia SDK:
```python
for segment in djelia.audio.transcriptions.create(
    file="audio.mp3",
    model=Versions.v2,
    stream=True,
):
    print(segment.start, segment.end, segment.text)
```
After, with the OpenAI SDK:
```python
stream = client.audio.transcriptions.create(
    file=open("audio.mp3", "rb"),
    model="sunjata-1",
    stream=True,
)
for event in stream:
    if event.type == "transcript.text.delta":
        print(event.delta)
```

- When using the new API, be sure to specify `model="sunjata-1"` and make requests to the `/audio/transcriptions` endpoint.
- Previously, native streams provided objects of the form `{text, start, end}`. In contrast, the OpenAI-compatible API streams responses via SSE events, specifically `transcript.text.segment`, `transcript.text.delta`, and `transcript.text.done`, followed by a `[DONE]` sentinel to indicate completion.
- For speech translation, use `/audio/translations` and `language=fra_Latn` instead of `translate_to_french=true`.

#### Without streaming

Before, with the Djelia SDK:
```python
print(
    " ".join(
        segment.text
        for segment in djelia.audio.transcriptions.create(
            file="audio.mp3",
            model=Versions.v2,
        )
    )
)
```
After, with the OpenAI SDK:
```python
print(
    client.audio.transcriptions.create(
        file=open("audio.mp3", "rb"),
        model="sunjata-1",
    ).text
)
```

- By default, non-streaming responses return an array of segments. To access timestamps, set `response_format=verbose_json` and use the `.segments` field; if you only need text, the default `json` format lets you read from `.text`.
- `temperature` takes effect on `sunjata-1`.

### Text to speech

#### Streaming

Before, with the Djelia SDK:
```python
chunks = djelia.audio.speech.create(
    input="Aw ni ce",
    description="Moussa speaks clearly",
    model=Versions.v2,
    stream=True,
    output_file="speech.mp3",
)
for chunk in chunks:
    print(len(chunk))
```
After, with the OpenAI SDK:
```python
with client.audio.speech.with_streaming_response.create(
    model="jifili-1",
    input="Aw ni ce",
    voice="moussa",
    response_format="mp3",
    stream_format="audio",
) as response:
    with open("speech.mp3", "wb") as audio:
        for chunk in response.iter_bytes():
            audio.write(chunk)
```

- Update your code by renaming the `text` parameter to `input`, replacing the numeric `speaker` or `description` fields with `voice`, and changing `format` to `response_format`.
- To receive raw audio chunks, simply add the argument `stream_format="audio"`.

#### Without streaming

Before, with the Djelia SDK:
```python
djelia.audio.speech.create(
    input="Aw ni ce",
    description="Moussa speaks clearly",
    model=Versions.v2,
    output_file="speech.mp3",
)
```
After, with the OpenAI SDK:
```python
client.audio.speech.create(
    model="jifili-1",
    input="Aw ni ce",
    voice="moussa",
    response_format="mp3",
).write_to_file("speech.mp3")
```

- Update your usage by renaming the `text` parameter to `input`, using `voice` instead of a numeric `speaker` or `description`, and changing `format` to `response_format`.
- The `jifili-1` model supports the following `response_format` options: `mp3`, `wav`, `pcm`, `opus`, `ulaw`, `alaw`, `l16_8000`, `l16_16000`, and `fmp4`. Any other value returns a 400 error with `param: "response_format"`.

### Translation

Before, with the Djelia SDK:
```python
print(
    djelia.translations.create(
        text="Bonjour",
        source=Language.FRENCH,
        target=Language.BAMBARA,
        model=Versions.v1,
    ).text
)
```
After, with the OpenAI SDK:
```python
print(
    client.chat.completions.create(
        model="banjugu-1",
        messages=[{"role": "user", "content": "Bonjour"}],
        extra_body={
            "djelia": {
                "source_language": "fra_Latn",
                "target_language": "bam_Latn",
            }
        },
    ).choices[0].message.content
)
```

- Set the `source_language` and `target_language` fields under `djelia` in the `extra_body` parameter. Use codes such as `bam_Latn`, `fra_Latn`, and `eng_Latn`, making sure that the source and target languages are different.
- Retrieve the translated text from `choices[0].message.content` in the response instead of using the top-level `text` field.

## JavaScript

### Set up the client

Before, with the Djelia SDK:
```javascript
const fs = require("node:fs");
const {
  Djelia,
  Language,
  TranslationRequest,
  TTSRequestV2,
  Versions,
} = require("djelia");
const djelia = new Djelia(process.env.DJELIA_API_KEY);
```
After, with the OpenAI SDK:
```javascript
import fs from "node:fs";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DJELIA_API_KEY,
  baseURL: "https://api.djelia.cloud/openai/v1",
});
```

Install the OpenAI SDK with `npm install openai` (Node 18 or later). The [Djelia JavaScript SDK](https://github.com/djelia-org/djelia-js-sdk) is no longer maintained and calls the retired native endpoints.

### Speech to text

#### Streaming

Before, with the Djelia SDK:
```javascript
const stream = await djelia.transcription.transcribe(
  "audio.mp3",
  false,
  true,
  Versions.v2,
);
for await (const segment of stream) {
  console.log(segment.start, segment.end, segment.text);
}
```
After, with the OpenAI SDK:
```javascript
const stream = await client.audio.transcriptions.create({
  file: fs.createReadStream("audio.mp3"),
  model: "sunjata-1",
  stream: true,
});
for await (const event of stream) {
  if (event.type === "transcript.text.delta") console.log(event.delta);
}
```

- When using the OpenAI SDK, specify `model: "sunjata-1"` and call the `/audio/transcriptions` endpoint for transcriptions.
- In the original Djelia SDK, streaming responses yield objects with `{text, start, end}`. With the OpenAI SDK, streaming returns a sequence of Server-Sent Events (SSE): `transcript.text.segment`, `transcript.text.delta`, and `transcript.text.done`, concluding with a `[DONE]` message.
- To perform speech translation, use the `/audio/translations` endpoint and set `language: "fra_Latn"` (for French), replacing the previous `translateToFrench` method.

#### Without streaming

Before, with the Djelia SDK:
```javascript
const segments = await djelia.transcription.transcribe(
  "audio.mp3",
  false,
  false,
  Versions.v2,
);
console.log(segments.map(segment => segment.text).join(" "));
```
After, with the OpenAI SDK:
```javascript
const transcript = await client.audio.transcriptions.create({
  file: fs.createReadStream("audio.mp3"),
  model: "sunjata-1",
});
console.log(transcript.text);
```

- By default, non-streaming responses return an array of segments. If you need detailed segment timestamps, set `response_format: "verbose_json"` and access the `.segments` field. For simple transcripts, you can use the default `json` format and read `.text`.
- `temperature` takes effect on `sunjata-1`.

### Text to speech

#### Streaming

Before, with the Djelia SDK:
```javascript
const stream = await djelia.tts.textToSpeech(
  new TTSRequestV2("Aw ni ce", "Moussa speaks clearly"),
  "speech.mp3",
  true,
  Versions.v2,
);
for await (const chunk of stream) {
  console.log(chunk.length);
}
```
After, with the OpenAI SDK:
```javascript
const speech = await client.audio.speech.create({
  model: "jifili-1",
  input: "Aw ni ce",
  voice: "moussa",
  response_format: "mp3",
  stream_format: "audio",
});
const output = fs.createWriteStream("speech.mp3");
for await (const chunk of speech.body) {
  output.write(chunk);
}
output.end();
```

- Change the `text` field to `input`, use `voice` instead of a numeric `speaker` or a `description`, and update `format` to `response_format`.
- Include `stream_format: "audio"` to receive raw audio data as a stream rather than as the default response.

#### Without streaming

Before, with the Djelia SDK:
```javascript
await djelia.tts.textToSpeech(
  new TTSRequestV2("Aw ni ce", "Moussa speaks clearly"),
  "speech.mp3",
  false,
  Versions.v2,
);
```
After, with the OpenAI SDK:
```javascript
const speech = await client.audio.speech.create({
  model: "jifili-1",
  input: "Aw ni ce",
  voice: "moussa",
  response_format: "mp3",
});
fs.writeFileSync("speech.mp3", Buffer.from(await speech.arrayBuffer()));
```

- Update your code to use `input` instead of `text`, specify `voice` in place of a numeric `speaker` or `description`, and use `response_format` rather than `format`.
- The `jifili-1` model supports the following `response_format` values: `mp3`, `wav`, `pcm`, `opus`, `ulaw`, `alaw`, `l16_8000`, `l16_16000`, and `fmp4`. Any other value returns a 400 error with `param: "response_format"`.

### Translation

Before, with the Djelia SDK:
```javascript
const translation = await djelia.translation.translate(
  new TranslationRequest("Bonjour", Language.FRENCH, Language.BAMBARA),
  Versions.v1,
);
console.log(translation.text);
```
After, with the OpenAI SDK:
```javascript
const translation = await client.chat.completions.create({
  model: "banjugu-1",
  messages: [{ role: "user", content: "Bonjour" }],
  djelia: {
    source_language: "fra_Latn",
    target_language: "bam_Latn",
  },
});
console.log(translation.choices[0].message.content);
```

- Specify the `source_language` and `target_language` inside a top-level `djelia` object in your request payload.
- Use language codes such as `bam_Latn`, `fra_Latn`, and `eng_Latn`, ensuring that `source_language` and `target_language` are always different.
- To access the translated text, read from `choices[0].message.content` instead of the response's top-level `text` field.

## curl

### Set up the client

Before:
```bash
DJELIA_V1_URL=https://djelia.cloud/api/v1
DJELIA_V2_URL=https://djelia.cloud/api/v2
```
After:
```bash
OPENAI_BASE_URL=https://api.djelia.cloud/openai/v1
```

The examples send the key as `Authorization: Bearer $DJELIA_API_KEY`. The `x-api-key` header is also accepted on `/openai/v1`.

### Speech to text

#### Streaming

Before:
```bash
curl -N "$DJELIA_V2_URL/models/transcribe/stream?translate_to_french=false" \
  -H "x-api-key: $DJELIA_API_KEY" \
  -F file=@audio.mp3
```
After:
```bash
curl -N "$OPENAI_BASE_URL/audio/transcriptions" \
  -H "Authorization: Bearer $DJELIA_API_KEY" \
  -F file=@audio.mp3 \
  -F model=sunjata-1 \
  -F stream=true
```

- To transcribe audio, use the `/audio/transcriptions` endpoint and include `-F model=sunjata-1` in your request.
- Native streaming responses provide objects containing `{text, start, end}` fields. When using OpenAI-compatible streaming, you’ll receive Server-Sent Events (SSE) with `transcript.text.segment`, `transcript.text.delta`, and `transcript.text.done` events, followed by a `[DONE]` message.
- For speech translation, switch to the `/audio/translations` endpoint and use `-F language=fra_Latn` instead of the previous `translate_to_french=true` option.

#### Without streaming

Before:
```bash
curl "$DJELIA_V2_URL/models/transcribe?translate_to_french=false" \
  -H "x-api-key: $DJELIA_API_KEY" \
  -F file=@audio.mp3
```
After:
```bash
curl "$OPENAI_BASE_URL/audio/transcriptions" \
  -H "Authorization: Bearer $DJELIA_API_KEY" \
  -F file=@audio.mp3 \
  -F model=sunjata-1 \
  | jq -r .text
```

- By default, non-streaming responses are returned as arrays of segments. To access timestamps, add `-F response_format=verbose_json` and inspect the `.segments` field; for a simple transcript, stick with the default `json` format and read `.text`.
- `temperature` takes effect on `sunjata-1`.

### Text to speech

#### Streaming

Before:
```bash
curl -N "$DJELIA_V2_URL/models/tts/stream" \
  -H "x-api-key: $DJELIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"Aw ni ce","description":"Moussa speaks clearly","format":"mp3"}' \
  --output speech.mp3
```
After:
```bash
curl -N "$OPENAI_BASE_URL/audio/speech" \
  -H "Authorization: Bearer $DJELIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "jifili-1",
    "input": "Aw ni ce",
    "voice": "moussa",
    "response_format": "mp3",
    "stream_format": "audio"
  }' \
  --output speech.mp3
```

- Update your payload by renaming `text` to `input`, and use `voice` in place of a numeric `speaker` or `description`. Change `format` to `response_format` for clarity.
- To receive raw audio chunks, include `"stream_format": "audio"` in your request.

#### Without streaming

Before:
```bash
curl "$DJELIA_V2_URL/models/tts" \
  -H "x-api-key: $DJELIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"Aw ni ce","description":"Moussa speaks clearly","format":"mp3"}' \
  --output speech.mp3
```
After:
```bash
curl "$OPENAI_BASE_URL/audio/speech" \
  -H "Authorization: Bearer $DJELIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"jifili-1","input":"Aw ni ce","voice":"moussa","response_format":"mp3"}' \
  --output speech.mp3
```

- Update your request body by changing `text` to `input`, and use `voice` instead of a numeric `speaker` or `description`. Also, rename `format` to `response_format` for clarity.
- The `jifili-1` model supports the following response formats: `mp3`, `wav`, `pcm`, `opus`, `ulaw`, `alaw`, `l16_8000`, `l16_16000`, and `fmp4`. Any other value returns a 400 error with `param: "response_format"`.

### Translation

Before:
```bash
curl "$DJELIA_V1_URL/models/translate" \
  -H "x-api-key: $DJELIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"Bonjour","source":"fra_Latn","target":"bam_Latn"}'
```
After:
```bash
curl "$OPENAI_BASE_URL/chat/completions" \
  -H "Authorization: Bearer $DJELIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "banjugu-1",
    "messages": [{"role": "user", "content": "Bonjour"}],
    "djelia": {
      "source_language": "fra_Latn",
      "target_language": "bam_Latn"
    }
  }' \
  | jq -r .choices[0].message.content
```

- Put `source` and `target` in a `djelia` object with `source_language` and `target_language`, in the JSON body.
- Read `choices[0].message.content` instead of the top-level `text`.

## Model names

| Old ID | Use instead | Status |
| --- | --- | --- |
| `djelia-asr-v1` | `sunjata-1` | Retired on September 20, 2026; returns 410. `sunjata-1` behaves differently |
| `djelia-asr-v2` | `sunjata-1` | Retired on September 20, 2026; returns 410. `sunjata-1` behaves differently and supports `temperature` |
| `djelia-asr-v3` | `sunjata-1` | Retired on September 20, 2026; returns 410. Same model, new name |
| `djelia-tts-v1` | `jifili-1` | Retired on September 20, 2026; returns 410. Numeric speakers became the voice `moussa` |
| `djelia-tts-v2` | `jifili-1` | Retired on September 20, 2026; returns 410. Descriptions became the voice `moussa` |
| `djelia-tts-v3` | `jifili-1` | Retired on September 20, 2026; returns 410. Same model, new name |
| `djelia-translate-v1` | `banjugu-1` | Retired on September 20, 2026; returns 410. Same model, new name |

A retired id returns 410 with `code: "model_retired"`, and the message names its replacement. OpenAI model names such as `whisper-1` and `tts-1` are still accepted as aliases; see [OpenAI model aliases](/models#openai-model-aliases).

## Errors

The OpenAI-compatible API provides error responses using the standard OpenAI error envelope. Official SDKs handle these by raising their usual exceptions based on the status and type. For detailed information on error codes and how streaming failures are managed, refer to the [Errors](/errors) documentation.

## Checklist

- Search for `djelia.cloud`; change API hosts, but keep `console.djelia.cloud` links.
- Search for `/api/v1`, `/api/v2`, `/v1/models`, or `/v2/models`; a native call remains.
- Search for `/models/transcribe`; move it to `/audio/transcriptions` or `/audio/translations`.
- Search for `/models/tts`; move it to `/audio/speech`.
- Search for `/models/translate`; move it to `/chat/completions`.
- Search for `translate_to_french`; replace it with `/audio/translations` and `language=fra_Latn`.
- Search for `djelia-asr-`, `djelia-tts-`, or `djelia-translate-`; replace each model using the table above.
