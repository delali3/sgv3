/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_AUTH_SERVICE_URL: string
    readonly VITE_DOCTOR_SERVICE_URL: string
    readonly VITE_PATIENT_SERVICE_URL: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }