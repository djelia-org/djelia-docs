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

The pages under `/api` are generated from the selected OpenAPI spec. They are **not**
checked in: `npm run build` removes the old reference and regenerates it every time.
The reference is only as current as that spec; production uses the live API, while
offline builds use the committed snapshot.

By default the build reads the committed snapshot at `openapi/djelia.json`, which keeps
a clone building without network access. Point `DJELIA_OPENAPI` at the live spec to
build against what is actually running:

```bash
DJELIA_OPENAPI=https://api.djelia.cloud/v1/openapi.json npm run build
```

Build, start, and `npm run gen-api-docs -- djelia` prepare the selected JSON spec in
`openapi/.generated.json` (ignored by Git). If it has no `servers` entry, preparation
adds `https://api.djelia.cloud` so request examples target the API instead of the
docs host. Paths already contain `/openai/v1`; do not append it to the server URL.
Explicit upstream servers are preserved. A failed live fetch stops the build rather
than silently publishing the offline snapshot.

Set `DJELIA_OPENAPI` in CI. Refresh the snapshot when the API changes so the offline
reference does not advertise retired routes:

```bash
curl -fsS https://api.djelia.cloud/v1/openapi.json -o openapi/djelia.json
```

Run `npm test`, `npm run build`, and `npm run typecheck` to validate a change. The
snapshot was refreshed from the public API on October 10, 2026 and contains the six
supported OpenAI-compatible routes. Historical native calls belong in the migration
guide, not the generated API navigation.

## Branding

The navbar uses the same official Djelia artwork as the console, bundled locally
so builds and page loads do not depend on the marketing site:

- `static/img/logo.svg`: [dark artwork for light surfaces](https://www.djelia.cloud/images/djelia-logo-icon-dark.svg), also used as the favicon.
- `static/img/logo-dark.svg`: [light artwork for dark surfaces](https://www.djelia.cloud/images/djelia-logo-icon.svg).

Docusaurus switches between the two navbar assets with the selected theme.

## Deploying

Any static host works. The site is fully static, with no server runtime.

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `build` |
| Node version | 20 or newer |
| Environment | `DJELIA_OPENAPI=https://api.djelia.cloud/v1/openapi.json` |

### Cloudflare Pages

Connect the repository, use the settings above, then add `docs.djelia.cloud` under
**Custom domains**. Cloudflare gives you the CNAME target to add in Route 53, and
provisions the certificate itself.

### GitHub Pages

`.github/workflows/deploy.yml` builds and publishes on every push to `main`. Enable it
under **Settings → Pages → Source → GitHub Actions**. For a custom domain, add
`docs.djelia.cloud` there and put the same name in `static/CNAME`.

## Writing

> **The pages in `docs/` are mirrored from `djelia-backend` and edits here are
> overwritten.** They are written in that repository, under `djelia-docs/`, so that a
> change to an endpoint and the change to its documentation land in one pull request.
> A pull request against `docs/` in this repository will be undone by the next sync.

What is edited here, and only here:

- `sidebars.ts`, the structure. A new page needs an entry, which the sync cannot add.
- `docusaurus.config.ts`, `src/`, `static/`, the shell and the branding.
- `package.json`, dependencies.

Conventions for the mirrored pages, which still apply wherever they are written:

- One Markdown or MDX file each, ordered by `sidebar_position`.
- Code samples in more than one language use `<Tabs groupId="language" queryString>`, so
  a reader's choice follows them across pages and is shareable as a link.
- Builds run with `onBrokenLinks` and `onBrokenAnchors` set to `throw`, so a bad internal
  link fails CI rather than shipping.

Every code sample in these docs has been run against the production API. Please keep it
that way: if you cannot run it, say so in the page rather than guessing.
