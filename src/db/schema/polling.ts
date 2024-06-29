import { mysqlTable, serial, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const pollings = mysqlTable('pollings', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    userId: serial('user_id').notNull(), // set zero for anonymous
    finished_at: timestamp('finished_at').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (polling) => ({
    slugIndex: uniqueIndex('slug_idx').on(polling.slug).using('btree'),
}))

export type Polling = typeof pollings.$inferSelect
export type NewPolling = typeof pollings.$inferInsert