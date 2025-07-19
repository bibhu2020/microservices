import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  console.log(`Vite is running in ${mode} mode`);

  return {

    base: '/', // or '/your-subfolder/',
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
    ],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:3004',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
          ws: false
        }
      },
      watch: {
        ignored: [
          '**/*.json',   // <-- Add this
        ]
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})
