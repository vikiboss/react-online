import react from '@vitejs/plugin-react-swc'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    plugins: [UnoCSS(), react()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    build: {
      chunkSizeWarningLimit: 2048,
    },
  }
})
