import * as z from 'zod'
import { publicProcedure } from '../../trpc'
import { post } from '../../../db/post'
import { and, like } from 'drizzle-orm'

/**
 * List posts with pagination and optional search query
 */
export const listPosts = publicProcedure
  .input(z.object({
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
    search: z.string().optional()
  }))
  .query(async opts => {
    const { page, pageSize, search } = opts.input
    const offset = (page - 1) * pageSize

    const where = []
    if (search) {
      where.push(like(post.title, `%${search}%`))
    }

    const posts = await opts.ctx.db
      .select()
      .from(post)
      .where(and(...where))
      .limit(pageSize)
      .offset(offset)

    return posts
  })
