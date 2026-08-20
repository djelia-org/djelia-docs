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

## Deploying

Any static host works. The site is fully static, with no server runtime.

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `build` |
| Node version | 20 or newer |
| Environment | `DJELIA_OPENAPI=https://djelia.cloud/api/v1/openapi.json` |

### Cloudflare Pages

Connect the repository, use the settings above, then add `docs.djelia.cloud` under
**Custom domains**. Cloudflare gives you the CNAME target to add in Route 53, and
provisions the certificate itself.

### GitHub Pages

`.github/workflows/deploy.yml` builds and publishes on every push to `main`. Enable it
under **Settings → Pages → Source → GitHub Actions**. For a custom domain, add
`docs.djelia.cloud` there and put the same name in `static/CNAME`.

## Writing

- Pages live in `docs/`, one Markdown or MDX file each, ordered by `sidebar_position`.
- The sidebar is assembled in `sidebars.ts`.
- Code samples in more than one language use `<Tabs groupId="language" queryString>`, so
  a reader's choice follows them across pages and is shareable as a link.
- Builds run with `onBrokenLinks` and `onBrokenAnchors` set to `throw`, so a bad internal
  link fails CI rather than shipping.

Every code sample in these docs has been run against the production API. Please keep it
that way: if you cannot run it, say so in the page rather than guessing.
