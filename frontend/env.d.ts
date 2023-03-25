/// <reference types="vite/client" />

declare const __VITE_MODE__: string;
declare const __GIT_COMMIT__: string;

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_COLOR_PRIMARY: string;
  readonly VITE_COLOR_SECONDARY: string;
  readonly VITE_COLOR_BACKGROUND: string;
  readonly VITE_DEFAULT_LOCALE: string;
  readonly VITE_FALLBACK_LOCALE: string;
  readonly VITE_FIREBASE_CONFIG: string;
  readonly VITE_PUBLIC_DIR: string;
  readonly VITE_NPM_NAME: string;
  readonly VITE_NPM_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
