import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This app is deployed as a sub-site of huebyte.github.io. `base` must match the
// folder it is copied into inside the main site's dist (see huebyte/scripts/build-site.mjs)
// and the prefix listed in huebyte/public/404.html.
export default defineConfig({
  base: "/legacy/v_mirage/",
  plugins: [react()],
  build: {
    // Keep every asset as a file, as the original CRA build did. Vite would inline the small
    // SVG layers as data URIs, and the untouched source writes them into `url(...)` without
    // quotes, which a data URI cannot survive.
    assetsInlineLimit: 0,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // The original stylesheets use lighten()/darken(); keep them untouched.
        silenceDeprecations: ["color-functions"],
      },
    },
  },
  server: {
    port: 3001,
    open: false,
  },
});
