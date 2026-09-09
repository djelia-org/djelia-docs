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
| 413 | `api_error` | `APIStatusError` |
| 422 | `invalid_request_error` | `UnprocessableEntityError` |
| 429 | `rate_limit_error` | `RateLimitError` |
| 5xx | `api_error` | `InternalServerError` |

If you request an unknown endpoint, you'll receive a 404 error with `code: "unknown_endpoint"`. In this case, methods like `client.embeddings.create()` will raise a `NotFoundError` instead of a general `APIStatusError`. If you use the wrong HTTP method on a valid endpoint, the API responds with a 405 status and `code: "method_not_allowed"`.

Supplying an unknown or retired model identifier also results in a 404 error, with `code: "model_not_found"`. Please note that the models `djelia-asr-v1`, `djelia-asr-v2`, `djelia-tts-v1`, and `djelia-tts-v2` will be retired on September 20, 2026. Refer to the [model migration guide](/migration) for details on updating your usage.

If you send audio that exceeds the supported size for transcription, the server returns a 413 error and `code: "audio_too_large"`.

Attempting to use an unsupported `response_format` with `jifili-1` triggers a 422 error with `code: "invalid_request"`. The list of supported formats can be found in the [Field support](/field-support) documentation.

Sending a text longer than the model accepts triggers a 422 error with `code: "input_too_long"`. The limit is 5000 characters for `jifili-1` and 1000 characters for the legacy speech models; the message names the limit and the model.

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

## Legacy API Endpoints

The `/api/v1` and `/api/v2` endpoints continue to use FastAPI’s legacy error format (`{"detail": ...}`) until their retirement on September 20, 2026. For more information, visit the [Legacy API](/legacy/native-api) documentation.
