import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createContext } from './context'
import { appRouter } from './router'
import { bAuth } from '#/better-auth'


export default {
  async fetch(request: Request): Promise<Response> {

    const url = new URL(request.url)
    // Handle auth routes
    if (url.pathname.startsWith('/api/auth')) {
      return bAuth().handler(request)
    }

    return fetchRequestHandler({
      endpoint: '/trpc',
      req: request,
      router: appRouter,
      createContext
    })
  }
}
