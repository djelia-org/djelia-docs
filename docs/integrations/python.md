---
sidebar_position: 1
title: Python
---

# Python

```bash
pip install openai
```

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["DJELIA_API_KEY"],
    base_url="https://djelia.cloud/openai/v1",
)
```

Everything else is the OpenAI SDK you already know. Async works the same way with
`AsyncOpenAI`.

## Djelia extensions

`extra_body` is a first-class parameter:

```python
client.audio.speech.create(
    model="djelia-tts-v2",
    input="Aw ni ce, i ka kene wa?",
    voice="moussa",
    extra_body={"djelia": {"description": "speaks slowly, warm and reassuring"}},
)
```

## Streaming speech

```python
with client.audio.speech.with_streaming_response.create(
    model="djelia-tts-v2",
    input="Aw ni ce, i ka kene wa?",
    voice="moussa",
) as response:
    response.stream_to_file("hello.mp3")
```

## Subtitles

```python
srt = client.audio.transcriptions.create(
    file=open("interview.mp3", "rb"),
    model="djelia-asr-v2",
    response_format="srt",
)
open("interview.srt", "w").write(srt)
```

## The `djelia` package

The [`djelia` package on PyPI](https://github.com/djelia-org/djelia-python-sdk) predates
the compatibility surface and talks to the [legacy API](/legacy/native-api). It still
works, and it is still maintained, but new integrations should use `openai` directly:
it is better tested, better documented, and it is what the rest of these docs describe.
