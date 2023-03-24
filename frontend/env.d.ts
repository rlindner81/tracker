/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_DIR: string;
  readonly VITE_DEFAULT_LOCALE: string;
  readonly VITE_FALLBACK_LOCALE: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_FIREBASE_CONFIG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
