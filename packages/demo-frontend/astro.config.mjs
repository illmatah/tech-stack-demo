// @ts-check
import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

import cloudflare from '@astrojs/cloudflare'

import vue from '@astrojs/vue'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [ tailwindcss() ],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8787',
          changeOrigin: true
        }
      }
    }
  },

  adapter: cloudflare(),
  integrations: [ vue(), react() ]
})
