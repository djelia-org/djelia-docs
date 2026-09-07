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
    base_url="https://api.djelia.cloud/openai/v1",
)
```

Use `AsyncOpenAI` for the asynchronous client.

## Djelia extensions

`extra_body` carries settings that have no OpenAI field. Text translation uses it for
the language pair:

```python
client.chat.completions.create(
    model="banjugu-1",
    messages=[{"role": "user", "content": "Bonjour"}],
    extra_body={
        "djelia": {
            "source_language": "fra_Latn",
            "target_language": "bam_Latn",
        }
    },
)
```

## Streaming speech

```python
with client.audio.speech.with_streaming_response.create(
    model="jifili-1",
    input="Aw ni ce, i ka kene wa?",
    voice="moussa",
) as response:
    response.stream_to_file("hello.mp3")
```

## Subtitles

```python
srt = client.audio.transcriptions.create(
    file=open("interview.mp3", "rb"),
    model="sunjata-1",
    response_format="srt",
)
open("interview.srt", "w").write(srt)
```

## The `djelia` package

The [`djelia` package on PyPI](https://github.com/djelia-org/djelia-python-sdk) was originally designed for the native `/api/v1` and `/api/v2` endpoints, which will be retired on September 20, 2026. The next version of the package will support the OpenAI-compatible API. In the meantime, we recommend using the `openai` package for new integrations—it is more thoroughly tested, better documented, and is the focus of the examples throughout these docs.
