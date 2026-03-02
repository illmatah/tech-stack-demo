import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createContext } from './context'
import { appRouter } from './router'
import { bAuth } from '#/better-auth'

/**
 * Cloudflare Worker entry point
 * To move to another platform, call betterauth and fetchRequestHandler with appropriate context in the platform's request handler
 * Additional modification would be needed to use a different database (drizzle adapter change should be drop-in)
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {

      const url = new URL(request.url)
      // Handle auth routes
      if (url.pathname.startsWith('/api/auth')) {
        try {
          return bAuth(env.DB).handler(request)
        } catch (error) {
          return new Response(`Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 })
        }
      }

      return fetchRequestHandler({
        endpoint: '/api',
        req: request,
        router: appRouter,
        createContext: opts => createContext({ ...opts, env })
      })
    } catch (error) {
      return new Response(`Server error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 })
    }
  }
}
