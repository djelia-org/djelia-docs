---
sidebar_position: 3
title: Authentication
---

# Authentication

Send your key as a bearer token, which is what the OpenAI SDKs do without any
configuration:

```
Authorization: Bearer YOUR_DJELIA_API_KEY
```

The `x-api-key` header used by the [legacy API](/legacy/native-api) is also accepted on
the compatibility surface, so a partially migrated integration keeps working.

Keys are created and revoked in the [Djelia Console](https://console.djelia.cloud).
A key belongs to an organisation, and usage is billed against that organisation's
wallet.

## Keeping keys out of your code

Every example in these docs reads the key from the environment:

```bash
export DJELIA_API_KEY="your-api-key"
```

The OpenAI SDKs look for `OPENAI_API_KEY` by default, so you pass the key explicitly:

```python
client = OpenAI(
    api_key=os.environ["DJELIA_API_KEY"],
    base_url="https://djelia.cloud/openai/v1",
)
```

## What a bad key looks like

A missing, malformed or revoked key returns 401 with `type: "authentication_error"` and
`code: "invalid_api_key"`, which the SDKs raise as `AuthenticationError`. See
[Errors](/errors).
