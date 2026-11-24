import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages serves a project site from /<repo>/; override with WEBSITE_BASE for a custom domain ('/').
export default defineConfig({
  base: process.env.WEBSITE_BASE ?? '/forgestack/',
  plugins: [react(), tailwindcss()],
});
