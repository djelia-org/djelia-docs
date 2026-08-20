---
sidebar_position: 8
title: Other languages
---

# Other languages

OpenAI publishes SDKs for Python, JavaScript, Go, Java, .NET and Ruby, and all of them
work against Djelia by changing the base URL. For anything else there are two routes.

## Generate a client from the OpenAPI spec

Djelia publishes its spec at
[`https://djelia.cloud/api/v1/openapi.json`](https://djelia.cloud/api/v1/openapi.json),
covering both the compatibility surface and the [legacy API](/legacy/native-api).

```bash
npx @openapitools/openapi-generator-cli generate \
  -i https://djelia.cloud/api/v1/openapi.json \
  -g rust \
  -o djelia-rust
```

Swap `-g` for your target: `rust`, `php`, `swift5`, `kotlin`, `elixir`, `dart`, `csharp`,
`java`, and around fifty others.

:::note Set the base URL yourself
The spec describes the paths but does not yet name the host they hang off, so a
generated client comes out with an empty base URL. Set it to `https://djelia.cloud`
in whatever the generated client calls its configuration object.
:::

## Call it over plain HTTP

The API is JSON over HTTPS with bearer auth, so any HTTP client will do. See
[curl](/integrations/curl) for the exact shape of each request, and the
[API reference](/api) for every field.

Two things to know:

- `/audio/transcriptions` and `/audio/translations` are `multipart/form-data`. Everything else is JSON.
- [Djelia extensions](/extensions) are a `djelia` object at the top level of the JSON body.
