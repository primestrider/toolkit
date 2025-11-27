// nuxt.config.ts
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: true,

  modules: ["@nuxt/eslint", "@nuxt/ui", "@vueuse/nuxt"],

  css: ["~/assets/css/main.css"],

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },

  app: {
    head: {
      title: "Toolkit — Utilities & Generators",
      meta: [
        {
          name: "description",
          content: "Collection of frontend tools: UUID, Hex color, etc.",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },

  routeRules: {
    "/": { prerender: true },
    "/tools/**": { prerender: true },
    "/_nuxt/**": {
      headers: { "cache-control": "public, max-age=31536000, immutable" },
    },
  },

  nitro: {
    prerender: {
      // gunakan properti yang benar: crawlLinks (bukan 'crawl')
      crawlLinks: true,
      // jika punya daftar route statis, masukkan di sini
      // contoh: routes: ['/tools/uuid', '/tools/color']
      routes: [],
    },
    compressPublicAssets: true,
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) return "vendor";
          },
        },
      },
    },
  },

  runtimeConfig: {
    public: {},
  },

  experimental: {
    payloadExtraction: true,
  },
});
