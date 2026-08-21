# Djelia docs

The documentation site for [djelia.cloud](https://djelia.cloud), built with
[Docusaurus](https://docusaurus.io).

## Local development

```bash
npm install
npm run start        # dev server on :3000, hot reload
npm run build        # production build into build/
npm run serve        # serve the production build
```

## Where the API reference comes from

The pages under `/api` are generated from Djelia's own OpenAPI spec, so they cannot
drift from what the API actually serves. They are **not** checked in: `npm run build`
regenerates them every time.

By default the build reads the committed snapshot at `openapi/djelia.json`, which keeps
a clone building without network access. Point `DJELIA_OPENAPI` at the live spec to
build against what is actually running:

```bash
DJELIA_OPENAPI=https://djelia.cloud/api/v1/openapi.json npm run build
```

Set that variable in CI. Refresh the snapshot occasionally so the offline fallback does
not fall too far behind:

```bash
curl -s https://djelia.cloud/api/v1/openapi.json -o openapi/djelia.json
```
