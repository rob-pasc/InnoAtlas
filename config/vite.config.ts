import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

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
