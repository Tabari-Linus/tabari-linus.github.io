import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages user-site: deploys to https://<user>.github.io — no base path.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
});
