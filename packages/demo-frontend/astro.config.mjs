// @ts-check
import { defineConfig, envField } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

import cloudflare from '@astrojs/cloudflare'

import vue from '@astrojs/vue'

import react from '@astrojs/react'

import { config } from 'dotenv'
import { env } from 'better-auth'


config()

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [ tailwindcss() ],
    server: {
      proxy: {
        '/api': {
          target: env.API_URL ?? 'http://localhost:8787',
          changeOrigin: true
        }
      }
    }
  },
  env: {
    schema: {
      API_URL: envField.string({ context: 'client', access: 'public', optional: true })
    }
  },
  adapter: cloudflare(),
  integrations: [ vue(), react() ]
})
