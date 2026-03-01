import type { AppRouter } from 'demo-worker'
import { createTRPCClient, httpBatchLink } from '@trpc/client'

export const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: ' https://ai-edu-demo-stack.illmatah.workers.dev',
    })
  ]
})
