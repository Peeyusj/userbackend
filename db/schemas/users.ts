import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const roles = sqliteTable("roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  access: text("access", { mode: "json" }).$type<Record<string, unknown>>(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: integer("created_by"),
  status: text("status").default("active"),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userName: text("user_name").notNull(),
  profilePic: text("profile_pic"),
  email: text("email"),
  password: text("password").notNull(),
  phoneNumber: text("phone_number"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  accounts: text('accounts', { mode: 'json' })
    .$type<string[]>()
    .default(sql`(json_array())`),
  roleId: integer("role_id").references(() => roles.id),
  status: text("status").default("active")
});