/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TRADEME_OAUTH_TOKEN: string
  readonly VITE_TRADEME_API_BASE_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
