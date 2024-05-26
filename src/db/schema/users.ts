import { password } from "bun";
import { mysqlTable, serial, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 80 }).notNull(),
    username: varchar('username', { length: 20 }).notNull(),
    password: varchar('password', { length: 80 }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (users) => ({
    emailIndex: uniqueIndex('email_idx').on(users.email),
    usernameIndex: uniqueIndex('username_idx').on(users.username),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert