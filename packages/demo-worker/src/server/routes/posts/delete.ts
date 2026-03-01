import * as z from 'zod'
import { protectedProcedure } from '../../trpc'
import { post } from '../../../db/post'
import { eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'


export const deletePost = protectedProcedure
  .input(z.string())
  .mutation(async opts => {
    // Check if user is the post author
    const [ postToDelete ] = await opts.ctx.db
      .select()
      .from(post)
      .where(eq(post.id, opts.input))
      .limit(1)

    if (postToDelete === undefined) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Post not found'
      })
    }

    if (postToDelete.authorId !== opts.ctx.user.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You can only delete your own posts'
      })
    }
  })
