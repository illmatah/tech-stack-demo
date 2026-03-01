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
 * Optional: Check for specific permissions or roles
 * Returns 403 if user doesn't have required permission
 */
export async function requirePermission(
  ctx: Context,
  _permission: string
): Promise<void> {
  const { user, session } = await requireAuth(ctx)

  // Example: Check if user has specific role or permission
  // You can customize this based on your needs
  if (!user || !session) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Insufficient permissions'
    })
  }

  // Add your permission checking logic here
  // For example:
  // if (!user.permissions?.includes(permission)) {
  //   throw new TRPCError({
  //     code: 'FORBIDDEN',
  //     message: `Missing required permission: ${permission}`
  //   })
  // }
}
