import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { prepareOpenApi } from "./prepare-openapi.mjs";

async function destination(t) {
  const dir = await mkdtemp(join(tmpdir(), "djelia-openapi-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  return join(dir, "prepared.json");
}

test("offline snapshot exposes only the six supported routes with the API host", async (t) => {
  const output = await destination(t);
  const source = new URL("../openapi/djelia.json", import.meta.url).pathname;
  const original = JSON.parse(await readFile(source, "utf8"));
  await prepareOpenApi({ source, output, fetcher: () => assert.fail("offline build fetched a URL") });
  const spec = JSON.parse(await readFile(output, "utf8"));
  assert.deepEqual(spec.servers, [{ url: "https://api.djelia.cloud" }]);
  assert.deepEqual(spec.paths, original.paths);
  assert.equal(Object.keys(spec.paths).length, 6);
  assert.ok(Object.keys(spec.paths).every((path) => path.startsWith("/openai/v1/")));
  assert.deepEqual(JSON.parse(await readFile(source, "utf8")), original);
});

test("live input gets the same API host without duplicating the path prefix", async (t) => {
  const output = await destination(t);
  const source = "https://api.djelia.cloud/v1/openapi.json";
  const paths = { "/openai/v1/models": { get: { responses: {} } } };
  await prepareOpenApi({ source, output, fetcher: async (url) => {
    assert.equal(url, source);
    return Response.json({ openapi: "3.1.0", paths });
  } });
  const spec = JSON.parse(await readFile(output, "utf8"));
  assert.equal(new URL(Object.keys(spec.paths)[0], spec.servers[0].url).href,
    "https://api.djelia.cloud/openai/v1/models");
});

test("preserves an explicit upstream server", async (t) => {
  const output = await destination(t);
  const spec = { openapi: "3.1.0", paths: {}, servers: [{ url: "https://api.example.test" }] };
  await prepareOpenApi({ source: "https://example.test/schema", output,
    fetcher: async () => Response.json(spec) });
  assert.deepEqual(JSON.parse(await readFile(output, "utf8")), spec);
});

test("a failed live fetch fails the build instead of silently using stale docs", async (t) => {
  const output = await destination(t);
  await writeFile(output, "previous build");
  await assert.rejects(prepareOpenApi({ source: "https://example.test/schema", output,
    fetcher: async () => new Response("unavailable", { status: 503 }) }), /HTTP 503/);
  assert.equal(await readFile(output, "utf8"), "previous build");
});
