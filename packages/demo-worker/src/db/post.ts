import { sql } from 'drizzle-orm'
import {
  sqliteTable,
  text,
  integer,
  index
} from 'drizzle-orm/sqlite-core'
import { user } from './auth-schema'


export const post = sqliteTable(
  'post',
  {
    id: text('id').primaryKey()
      .$default(() => crypto.randomUUID()),
    title: text('title').notNull(),
    content: text('content').notNull(),
    authorId: text('author_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  table => [ index('post_authorId_idx').on(table.authorId) ]
)
