---
sidebar_position: 8
title: Other languages
---

# Other languages

OpenAI publishes SDKs for Python, JavaScript, Go, Java, .NET and Ruby, and all of them
work against Djelia by changing the base URL. For anything else there are two routes.

## Generate a client from the OpenAPI spec

Djelia publishes its spec at
[`https://djelia.cloud/openapi.json`](https://djelia.cloud/openapi.json). It names its
own host, so a generated client knows where to send requests without further
configuration.

```bash
npx @openapitools/openapi-generator-cli generate \
  -i https://djelia.cloud/openapi.json \
  -g rust \
  -o djelia-rust
```

Swap `-g` for your target: `rust`, `php`, `swift5`, `kotlin`, `elixir`, `dart`, `csharp`,
`java`, and around fifty others. The spec covers both the compatibility surface and the
[legacy API](/legacy/native-api).

:::note
Not every generator reads the `servers` block. `openapi-python-client`, for example,
still requires you to pass a base URL to its client constructor. The OpenAPITools
generator above picks it up automatically.
:::

## Call it over plain HTTP

The API is JSON over HTTPS with bearer auth, so any HTTP client will do. See
[curl](/integrations/curl) for the exact shape of each request, and the
[API reference](/api) for every field.

Two things to know:

- `/audio/transcriptions` and `/audio/translations` are `multipart/form-data`. Everything else is JSON.
- [Djelia extensions](/extensions) are a `djelia` object at the top level of the JSON body.
