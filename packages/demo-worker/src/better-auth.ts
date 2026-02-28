import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { organization } from 'better-auth/plugins'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from './db/schema'


export const bAuth = (db?: D1Database) => {
  if (!db) db = {} as D1Database

  return betterAuth({
    emailAndPassword: {
      enabled: true
    },
    basePath: '/api/betterauth',
    trustedOrigins: [ 'http://localhost:4321' ],
    database: drizzleAdapter(drizzle(db, {
      schema
    }), {
      provider: 'sqlite'
    }),
    plugins: [ organization() ]
  })
}
