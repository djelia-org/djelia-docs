import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import type * as OpenApiPlugin from "docusaurus-plugin-openapi-docs";
import { themes as prismThemes } from "prism-react-renderer";

/**
 * The reference section is generated from the API's own OpenAPI spec.
 *
 * Point DJELIA_OPENAPI at the deployed spec to build against what is actually
 * running, which is the arrangement that keeps the reference from drifting:
 *
 *   DJELIA_OPENAPI=https://djelia.cloud/openapi.json npm run gen-api-docs djelia
 *
 * The checked-in copy is the fallback so a clone builds without network access.
 */
const OPENAPI_SPEC = process.env.DJELIA_OPENAPI ?? "openapi/djelia.json";

/**
 * Deployed to GitHub Pages at djelia-org.github.io/djelia-docs by default.
 *
 * To serve it from docs.djelia.cloud instead, set both variables in the deploy
 * workflow and add the CNAME in Route 53:
 *
 *   DOCS_URL=https://docs.djelia.cloud
 *   DOCS_BASE_URL=/
 */
const url = process.env.DOCS_URL ?? "https://djelia-org.github.io";
const baseUrl = process.env.DOCS_BASE_URL ?? "/djelia-docs/";

const config: Config = {
  title: "Djelia",
  tagline: "African language AI. Translation, transcription and speech for Bambara.",
  favicon: "img/logo.svg",

  url,
  baseUrl,

  organizationName: "djelia-org",
  projectName: "djelia-docs",

  onBrokenLinks: "throw",
  onBrokenAnchors: "throw",

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  future: {
    v4: true,
    faster: true,
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/djelia-org/djelia-docs/tree/main/",
          docItemComponent: "@theme/ApiItem",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "api",
        docsPluginId: "classic",
        config: {
          djelia: {
            specPath: OPENAPI_SPEC,
            outputDir: "docs/api",
            downloadUrl: "https://djelia.cloud/openapi.json",
            sidebarOptions: {
              groupPathsBy: "tag",
              categoryLinkSource: "tag",
            },
          } satisfies OpenApiPlugin.Options,
        },
      },
    ],
  ],

  themes: ["docusaurus-theme-openapi-docs"],

  themeConfig: {
    image: "img/djelia-social-card.png",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Djelia",
      logo: {
        alt: "Djelia",
        src: "img/logo.svg",
      },
      items: [
        { to: "/quickstart", label: "Quickstart", position: "left" },
        { to: "/api", label: "API reference", position: "left" },
        {
          type: "dropdown",
          label: "Integrations",
          position: "left",
          items: [
            { to: "/integrations/python", label: "Python" },
            { to: "/integrations/javascript", label: "JavaScript" },
            { to: "/integrations/go", label: "Go" },
            { to: "/integrations/curl", label: "curl" },
            { to: "/integrations/litellm", label: "LiteLLM" },
            { to: "/integrations/langchain", label: "LangChain" },
            { to: "/integrations/vercel-ai-sdk", label: "Vercel AI SDK" },
            { to: "/integrations/no-code", label: "No-code tools" },
            { to: "/integrations/other-languages", label: "Other languages" },
          ],
        },
        {
          href: "https://console.djelia.cloud",
          label: "Console",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            { label: "Quickstart", to: "/quickstart" },
            { label: "API reference", to: "/api" },
            { label: "Errors", to: "/errors" },
          ],
        },
        {
          title: "Build",
          items: [
            { label: "Console", href: "https://console.djelia.cloud" },
            { label: "OpenAPI spec", href: "https://djelia.cloud/openapi.json" },
            { label: "Python SDK", href: "https://github.com/djelia-org/djelia-python-sdk" },
          ],
        },
        {
          title: "More",
          items: [
            { label: "Djelia", href: "https://www.djelia.cloud" },
            { label: "GitHub", href: "https://github.com/djelia-org" },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Djelia.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json", "python", "go", "yaml", "typescript", "diff"],
    },
    languageTabs: [
      { highlight: "python", language: "python", logoClass: "python" },
      { highlight: "javascript", language: "nodejs", logoClass: "nodejs" },
      { highlight: "go", language: "go", logoClass: "go" },
      { highlight: "bash", language: "curl", logoClass: "curl" },
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;
