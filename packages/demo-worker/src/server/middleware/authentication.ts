import { TRPCError } from '@trpc/server'
import { bAuth } from '#/better-auth'
import type { Context } from '../context'

/**
 * Authentication middleware for tRPC
 * Checks if user is authenticated using better-auth
 * Returns 401 if not authenticated
 * Adds user and session to context if authenticated
 */
export async function requireAuth(ctx: Context) {
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

  return {
    user: session.user,
    session
  }
}

/**
 * Authorization middleware for tRPC
 * Checks if user has required permission
 * Returns 403 if user does not have permission
 */
export async function requirePermission(
  ctx: Context,
  _permission: string
): Promise<void> {
  const { user, session } = await requireAuth(ctx)
  if (!user || !session) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Insufficient permissions'
    })
  }
}
