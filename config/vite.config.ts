import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// Deployed origin for absolute link-preview URLs in index.html (og:image).
// Set it in the hosting environment (e.g. Render); default to '' so local
// builds emit a relative URL instead of the literal %VITE_SITE_URL% placeholder.
process.env.VITE_SITE_URL ??= ''

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  server: {
    watch: {
      // WSL2: inotify doesn't fire on /mnt/c (Windows FS) → fall back to polling
      usePolling: true,
      interval: 300,
    },
  },
})
