import { db } from "@/db";
import { category, newsArticle } from "@/db/schemas/news";
import { desc, sql, eq } from "drizzle-orm";

export async function GET(request: Request) {

const latestArticlesByCategory = await db
  .select({
    id: newsArticle.id,
    title: newsArticle.title,
    description: newsArticle.description,
    imgSrc: newsArticle.imgSrc,
    category: newsArticle.category,
    author: newsArticle.author,
    createdAt: newsArticle.createdAt,
    categoryName: category.name,
  })
  .from(newsArticle)
  .leftJoin(category, eq(newsArticle.category, category.id))
  .where(
    sql`${newsArticle.id} IN (
      SELECT id FROM (
        SELECT id, category,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY created_at DESC) AS rn
        FROM news_article
      ) subquery
      WHERE rn <= 3
    )`
  )
  .orderBy(desc(newsArticle.createdAt));

  return Response.json({
    success: true,
    message: "Successfully fetched",
    data: {
      latestArticlesByCategory
    },
  });
}
