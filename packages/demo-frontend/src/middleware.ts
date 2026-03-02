import { defineMiddleware } from 'astro:middleware'


const DEFAULT_API_HOST = 'ai-edu-demo-stack.illmatah.workers.dev'

function normalizeApiBase(raw: string | undefined) {
  const value = (raw && String(raw).trim()) ? String(raw).trim() : DEFAULT_API_HOST
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`

  return withScheme.replace(/\/+$/, '')
}

export const onRequest = defineMiddleware((context, next) => {
  const { request, url } = context

  if (!url.pathname.startsWith('/api')) {
    return next()
  }

  const base = normalizeApiBase()
  const target = new URL(url.pathname + url.search, base)

  const init: RequestInit = {
    method: request.method,
    headers: request.headers
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body
  }

  return fetch(target, init)
})
