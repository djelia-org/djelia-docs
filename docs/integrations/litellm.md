---
sidebar_position: 5
title: LiteLLM
---

# LiteLLM

Djelia works as a standard OpenAI-compatible provider. Prefix the model with `openai/`
and point `api_base` at the compatibility surface.

```python
import litellm

litellm.completion(
    model="openai/djelia-translate-v1",
    messages=[{"role": "user", "content": "Bonjour"}],
    extra_body={"djelia": {"source_language": "fra_Latn", "target_language": "bam_Latn"}},
    api_base="https://djelia.cloud/openai/v1",
    api_key="YOUR_DJELIA_API_KEY",
)

litellm.transcription(
    model="openai/djelia-asr-v2",
    file=open("audio.mp3", "rb"),
    api_base="https://djelia.cloud/openai/v1",
    api_key="YOUR_DJELIA_API_KEY",
)

litellm.speech(
    model="openai/djelia-tts-v2",
    input="Aw ni ce",
    voice="moussa",
    api_base="https://djelia.cloud/openai/v1",
    api_key="YOUR_DJELIA_API_KEY",
)
```

## Proxy

The same three entries go in `config.yaml`:

```yaml
model_list:
  - model_name: djelia-translate
    litellm_params:
      model: openai/djelia-translate-v1
      api_base: https://djelia.cloud/openai/v1
      api_key: os.environ/DJELIA_API_KEY
  - model_name: djelia-asr
    litellm_params:
      model: openai/djelia-asr-v2
      api_base: https://djelia.cloud/openai/v1
      api_key: os.environ/DJELIA_API_KEY
  - model_name: djelia-tts
    litellm_params:
      model: openai/djelia-tts-v2
      api_base: https://djelia.cloud/openai/v1
      api_key: os.environ/DJELIA_API_KEY
```

## Cost tracking

Djelia models are not in LiteLLM's built-in cost map, so `response_cost` comes back as
`None` until you register them. Because `usage` reports characters and translation is
metered per input character, a per-token price set to the per-character price yields the
exact charge:

```python
litellm.register_model({
    "openai/djelia-translate-v1": {
        "input_cost_per_token": 0.00005,   # $/character
        "output_cost_per_token": 0.0,      # output is not metered
        "litellm_provider": "openai",
        "mode": "chat",
    }
})
```

Transcription is metered per second of audio, which has no equivalent in LiteLLM's
token-based cost model. Use Djelia's own usage records for ASR spend.
