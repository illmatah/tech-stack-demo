import { router } from './trpc'
import { createPost, deletePost, getPost, listPosts, updatePost } from './routes/posts'


export const appRouter = router({
  createPost,
  deletePost,
  getPost,
  listPosts,
  updatePost
})
// export type definition of API
export type AppRouter = typeof appRouter
