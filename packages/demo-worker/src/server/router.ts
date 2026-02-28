import * as z from 'zod'
import { router, publicProcedure } from './trpc'


type User = {
  id: string
  name: string
  bio?: string
}

const users: Record<string, User> = {}

export const appRouter = router({
  getUserById: publicProcedure.input(z.string()).query(opts => {
    return users[opts.input] // input type is string
  }),
  createUser: publicProcedure
    // validate input with Zod
    .input(z.object({
      name: z.string().min(3),
      bio: z.string().max(142).optional()
    }))
    .mutation(opts => {
      const id = Date.now().toString()
      const user: User = { id, ...opts.input }
      users[user.id] = user

      return user
    })
})
// export type definition of API
export type AppRouter = typeof appRouter
