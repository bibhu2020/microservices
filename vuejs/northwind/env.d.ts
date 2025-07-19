/// <reference types="vite/client" />

// This allows importing `.vue` files without TypeScript errors
declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// Extend the Vite environment variables (optional but recommended)
interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_APP_PORT: string;
    // Add more VITE_ prefixed env variables here as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}


