import { defineConfig, presetUno, presetIcons, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    presetUno({
      dark: 'media',
    }),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/',
    }),
  ],
  rules: [],
  shortcuts: [
    {
      'grid-center': 'grid place-items-center',
      'flex-center': 'flex items-center justify-center',
      'flex-col-center': 'flex flex-col items-center justify-center',
      'flex-between': 'flex items-center justify-between',
    },
  ],
})
