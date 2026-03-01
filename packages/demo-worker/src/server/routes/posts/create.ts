import { protectedProcedure } from '../../trpc'
import * as z from 'zod'
import { post } from '../../../db/post'
import { TRPCError } from '@trpc/server'


export const createPost = protectedProcedure
  .input(z.object({
    title: z.string(),
    content: z.string()
  }))
  .mutation(async opts => {
    const { title, content } = opts.input

    const [ createdPost ] = await opts.ctx.db
      .insert(post)
      .values({
        title,
        content,
        authorId: opts.ctx.user.id
      })
      .returning()

    if (createdPost === undefined) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create post'
      })
    }

    return createdPost
  })
