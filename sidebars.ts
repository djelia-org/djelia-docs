import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    "index",
    "quickstart",
    "authentication",
    {
      type: "category",
      label: "Guides",
      collapsed: false,
      items: ["models", "extensions", "field-support", "errors"],
    },
    {
      type: "category",
      label: "Integrations",
      collapsed: false,
      items: [
        "integrations/python",
        "integrations/javascript",
        "integrations/go",
        "integrations/curl",
        "integrations/litellm",
        "integrations/langchain",
        "integrations/vercel-ai-sdk",
        "integrations/no-code",
        "integrations/other-languages",
      ],
    },
    {
      type: "category",
      label: "API reference",
      link: { type: "generated-index", title: "API reference", slug: "/api" },
      items: require("./docs/api/sidebar.ts").default,
    },
    {
      type: "category",
      label: "Legacy",
      items: ["legacy/native-api"],
    },
  ],
};

export default sidebars;
