import { initTRPC, TRPCError } from '@trpc/server'
import type { Context } from './context'
import { bAuth } from '../better-auth'

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create()

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router
export const publicProcedure = t.procedure

/**
 * Middleware to check if user is authenticated
 */
const isAuthed = t.middleware(async ({ ctx, next }) => {
  const auth = bAuth(ctx.env.DB)

  // Get session from request
  const session = await auth.api.getSession({
    headers: ctx.req.headers
  })

  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    })
  }

  return next({
    ctx: {
      ...ctx,
      user: session.user,
      session
    }
  })
})

/**
 * Protected procedure that requires authentication
 */
export const protectedProcedure = t.procedure.use(isAuthed)
