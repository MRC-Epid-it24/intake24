import { defineConfig } from '@vite-pwa/assets-generator/config';

export default defineConfig({
  preset: {
    transparent: {
      sizes: [64, 192, 512],
      favicons: [[64, 'icon.ico']],
    },
    maskable: {
      sizes: [512],
    },
    apple: {
      sizes: [180],
    },
  },
  images: ['public/icons/icon.svg'],
});
