import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This app is deployed as a sub-site of huebyte.github.io. `base` must match the
// folder it is copied into inside the main site's dist (see huebyte/scripts/build-site.mjs)
// and the prefix listed in huebyte/public/404.html.
export default defineConfig({
  base: "/legacy/v_mirage/",
  plugins: [react()],
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
