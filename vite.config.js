import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages는 이 저장소를 https://<user>.github.io/skala-vue/ 하위 경로로 서빙하므로,
  // 로컬 개발(base '/')과 구분해 CI 빌드에서만 GITHUB_PAGES=true로 전달한다.
  base: process.env.GITHUB_PAGES ? '/skala-vue/' : '/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
