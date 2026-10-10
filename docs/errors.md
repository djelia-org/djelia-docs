---
sidebar_position: 8
title: Errors
---

# Errors

Errors use the OpenAI envelope, so the SDKs raise their normal exception classes and
your existing error handling keeps working.

```json
{
  "error": {
    "message": "The model `gpt-9` does not exist.",
    "type": "invalid_request_error",
    "param": "model",
    "code": "model_not_found"
  }
}
```

| Status | `type` | SDK exception |
| --- | --- | --- |
| 400 | `invalid_request_error` | `BadRequestError` |
| 401 | `authentication_error` | `AuthenticationError` |
| 402 | `insufficient_quota` | `APIStatusError` |
| 403 | `permission_error` | `PermissionDeniedError` |
| 404 | `invalid_request_error` | `NotFoundError` |
| 405 | `invalid_request_error` | `APIStatusError` |
| 410 | `invalid_request_error` | `APIStatusError` |
| 413 | `api_error` | `APIStatusError` |
| 422 | `invalid_request_error` | `UnprocessableEntityError` |
| 429 | `rate_limit_error` | `RateLimitError` |
| 5xx | `api_error` | `InternalServerError` |

If you request an unknown endpoint, you'll receive a 404 error with `code: "unknown_endpoint"`. In this case, methods like `client.embeddings.create()` will raise a `NotFoundError` instead of a general `APIStatusError`. If you use the wrong HTTP method on a valid endpoint, the API responds with a 405 status and `code: "method_not_allowed"`.

An unknown model id returns a 404 error with `code: "model_not_found"`.

A retired model id returns a 410 error with `code: "model_retired"`. The message names the model to use instead:

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

A retired native endpoint (`/v1/models/*`, `/v2/models/*`, and the same paths under `/api`) returns a 410 error with `code: "endpoint_retired"` for every method:

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

If you send audio that exceeds the supported size for transcription, the server returns a 413 error and `code: "audio_too_large"`.

An unsupported `response_format` on `jifili-1` returns a 400 error with `param: "response_format"`. The list of supported formats can be found in the [Field support](/field-support) documentation.

Sending a text longer than the model accepts triggers a 422 error with `code: "input_too_long"`. The limit is 5000 characters for `jifili-1`; the message names the limit and the model.

## Running out of credit

A 402 means the organisation's wallet lacks the balance for the request. Add credits at
[console.djelia.cloud](https://console.djelia.cloud).

## Errors during a stream

`/audio/speech` and the streaming responses send their status and headers before the
model produces output, so a failure part-way through a stream cannot become a 500. The
caller sees a truncated body on a 200 instead.

Nothing is charged for a stream that does not complete.

## Validation and Limits

If your request includes invalid fields or values, the server responds with a 400 status before starting inference. For an overview of request limits, see the [Field support](/field-support#request-limits) documentation. When troubleshooting errors, make sure to log the response status, error `code`, and request ID—but never log your API keys.
