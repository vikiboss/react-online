import react from '@vitejs/plugin-react-swc'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [UnoCSS(), react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
