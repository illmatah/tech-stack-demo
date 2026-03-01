import { eq } from 'drizzle-orm'
import { protectedProcedure } from '../../trpc'
import * as z from 'zod'
import { post } from '../../../db/post'
import { TRPCError } from '@trpc/server'


export const updatePost = protectedProcedure
  .input(z.object({
    id: z.string(),
    title: z.string().optional(),
    content: z.string().optional()
  }))
  .mutation(async opts => {
    const { id, title, content } = opts.input
    const updateData: Partial<{ title: string; content: string }> = {}
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content

    // Check if user is the post author
    const [ postToUpdate ] = await opts.ctx.db
      .select()
      .from(post)
      .where(eq(post.id, id))
      .limit(1)

    if (postToUpdate === undefined) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Post not found'
      })
    }

    if (postToUpdate.authorId !== opts.ctx.user.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You can only update your own posts'
      })
    }

    const [ updatedPost ] = await opts.ctx.db
      .update(post)
      .set(updateData)
      .where(eq(post.id, id))
      .returning()

    if (updatedPost === undefined) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update post'
      })
    }

    return updatedPost
  })
