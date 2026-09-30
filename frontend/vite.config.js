import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // Set VITE_BASE=/Draftcore/frontend/dist/ to preview the build from http://localhost/Draftcore/frontend/dist/
    base: env.VITE_BASE || '/',
    plugins: [react()],
    server: {
      // In dev, forward /api/* to XAMPP's Apache so the PHP enquiry handler runs.
      proxy: {
        '/api': {
          target: env.DEV_PHP_ORIGIN || 'http://localhost',
          changeOrigin: true,
          rewrite: (path) => `${env.DEV_PHP_PREFIX || '/Draftcore/frontend/public'}${path}`,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            motion: ['framer-motion', 'lenis'],
          },
        },
      },
    },
  }
})
