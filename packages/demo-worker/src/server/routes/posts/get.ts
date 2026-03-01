import * as z from 'zod'
import { publicProcedure } from '../../trpc'
import { post } from '../../../db/post'
import { eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'


export const getPost = publicProcedure
  .input(z.string())
  .query(async opts => {
    const [ result ] = await opts.ctx.db
      .select()
      .from(post)
      .where(eq(post.id, opts.input))
      .limit(1)

    if (result === undefined) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Post not found'
      })
    }

    return result
  })
