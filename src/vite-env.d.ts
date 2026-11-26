/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  /** CARTO basemap API key (see src/config/basemap.ts). */
  readonly VITE_CARTO_KEY?: string
}
