// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://davetashner.com',
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      // Use github-dark-dimmed - works well in both light and dark modes
      theme: 'github-dark-dimmed',
      // Enable word wrap to prevent horizontal overflow
      wrap: true,
    },
  },
});
