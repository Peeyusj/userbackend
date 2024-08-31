import { db } from "@/db";
import { category } from "@/db/schemas/news";
import { and } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  let categoryName = searchParams.get("category") ?? "Home";
  let result: any;

    // TODO: later get last_id from hero api and give a condition here that data which is fetched here must have id smaller than the last_id

 const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format

 result = await db.query.newsArticle.findMany({
  where: (newsArticle, { eq, lt }) => and(
    eq(newsArticle.category, 
      db.select({ id: category.id })
        .from(category)
        .where(eq(category.name, categoryName))
    ),
    lt(newsArticle.createdAt, today)
  ),
  with: {
    category: true,
  },
  orderBy: (newsArticle, { desc }) => [
    desc(newsArticle.priority),
    desc(newsArticle.createdAt)
  ],
  limit: 7,
});

  return Response.json({
    success: true,
    message: "Successfully fetched",
    data: {
      result,
    },
  });
}
