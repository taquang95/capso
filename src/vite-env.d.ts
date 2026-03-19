/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAUTIC_URL: string;
  readonly VITE_MAUTIC_FORM_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
