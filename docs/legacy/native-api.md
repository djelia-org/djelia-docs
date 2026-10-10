---
sidebar_position: 9
title: Native API (retired September 20, 2026)
description: The native /v1 and /v2 endpoints were retired on September 20, 2026. Use the migration guide.
---

# Native API

The native API was retired on September 20, 2026. Requests to `/v1/models/*`,
`/v2/models/*`, `/api/v1/models/*` and `/api/v2/models/*` return HTTP 410 with
`code: "endpoint_retired"`.

Use the [API migration guide](/migration) to move to the OpenAI-compatible API.
