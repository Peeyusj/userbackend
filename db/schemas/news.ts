import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { relations } from 'drizzle-orm';

// Define the category table
export const category = sqliteTable('category', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

// Define the newsArticle table with a foreign key reference to category
export const newsArticle = sqliteTable('news_article', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  markdownContent: text('markdownContent'),
  title: text('title').notNull(),
  accounts: text('accounts', { mode: 'json' })
    .$type<string[]>()
    .default(sql`(json_array())`),
  description: text('description').notNull(),
  imgSrc: text('img_src'),
  category: integer('category').references(() => category.id),
  priority: integer('priority').notNull(),
  author: text('author').notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});


export const newsArticleRelations = relations(newsArticle, ({ one }) => ({
  category: one(category, {
    fields: [newsArticle.category],
    references: [category.id],
  }),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  newsArticles: many(newsArticle),
}));