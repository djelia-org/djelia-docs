---
sidebar_position: 6
title: LangChain
---

# LangChain

Use `ChatOpenAI` with Djelia's base URL. The language pair goes in `extra_body`, the
same as with the OpenAI SDK.

```python
import os
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="djelia-translate-v1",
    api_key=os.environ["DJELIA_API_KEY"],
    base_url="https://djelia.cloud/openai/v1",
    extra_body={"djelia": {"source_language": "fra_Latn", "target_language": "bam_Latn"}},
)

print(llm.invoke("Bonjour, comment allez-vous ?").content)
```

## In a chain

Because the language pair is set on the model rather than per call, a Djelia translator
composes like any other runnable:

```python
from langchain_core.prompts import ChatPromptTemplate

to_bambara = ChatOpenAI(
    model="djelia-translate-v1",
    api_key=os.environ["DJELIA_API_KEY"],
    base_url="https://djelia.cloud/openai/v1",
    extra_body={"djelia": {"source_language": "eng_Latn", "target_language": "bam_Latn"}},
)

chain = ChatPromptTemplate.from_template("{text}") | to_bambara
chain.invoke({"text": "Welcome to the clinic."})
```

:::caution
Djelia's translation model has no tool use, no system-prompt steering and no
conversational memory. It translates the last user message. Agent abstractions that
expect tool calling will not work against it.
:::
