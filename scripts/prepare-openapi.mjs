import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export async function prepareOpenApi({
  source = process.env.DJELIA_OPENAPI ?? "openapi/djelia.json",
  output = "openapi/.generated.json",
  fetcher = fetch,
} = {}) {
  let spec;
  if (/^https?:\/\//.test(source)) {
    const response = await fetcher(source, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`OpenAPI fetch failed: HTTP ${response.status}`);
    spec = await response.json();
  } else {
    spec = JSON.parse(await readFile(source, "utf8"));
  }
  if (!spec.openapi || !spec.paths || typeof spec.paths !== "object") {
    throw new Error("Expected an OpenAPI document with paths");
  }
  // Paths already include /openai/v1. Without a server the example generator
  // defaults to the documentation site's origin instead of the API host.
  const prepared = {
    ...spec,
    servers: spec.servers?.length ? spec.servers : [{ url: "https://api.djelia.cloud" }],
  };
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(prepared, null, 2)}\n`);
  return prepared;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await prepareOpenApi();
}
