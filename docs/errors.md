---
sidebar_position: 7
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
| 404 | `not_found_error` | `NotFoundError` |
| 429 | `rate_limit_error` | `RateLimitError` |
| 5xx | `api_error` | `InternalServerError` |

An endpoint Djelia does not implement returns 404 in the same envelope, so
`client.embeddings.create()` raises `NotFoundError` rather than a bare
`APIStatusError`. A wrong method on a real path returns 405.

## Running out of credit

A 402 means the organisation's wallet lacks the balance for the request. Add credits at
[console.djelia.cloud](https://console.djelia.cloud).

## Errors during a stream

`/audio/speech` and the streaming responses send their status and headers before the
model produces output, so a failure part-way through a stream cannot become a 500. The
caller sees a truncated body on a 200 instead.

Nothing is charged for a stream that does not complete.

## The legacy surface

The `/api/v1` and `/api/v2` routes are unaffected and keep FastAPI's `{"detail": ...}`
error shape. See [Legacy API](/legacy/native-api).
