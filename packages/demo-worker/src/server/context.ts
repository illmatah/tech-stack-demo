import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { drizzle } from 'drizzle-orm/d1'


type Env = {
  DB: D1Database
}

export function createContext({
  req,
  resHeaders,
  env
}: FetchCreateContextFnOptions & { env: Env }) {
  const db = drizzle(env.DB)

  return { req, resHeaders, db, env }
}

export type Context = Awaited<ReturnType<typeof createContext>>
