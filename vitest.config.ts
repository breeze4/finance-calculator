import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        'src/main.ts',
        'src/router/',
        'src/components/',
        'src/views/',
        'vite.config.ts',
        'vitest.config.ts'
      ]
    }
  }
})