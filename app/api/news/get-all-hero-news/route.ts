import { db } from "@/db";
import { category, newsArticle } from "@/db/schemas/news";
import { and, desc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  let categoryName = searchParams.get("category") ?? "Home";
  let result: any;

  if (categoryName == "Home") {
    result = await db.query.newsArticle.findMany({
      with: {
        category: true,
      },
      orderBy: desc(newsArticle.createdAt),
      limit: 7,
    });
  } else {

    result = await db.query.newsArticle.findMany({
      where: (newsArticle, { eq, lt }) => and(
        eq(newsArticle.category, 
          db.select({ id: category.id })
            .from(category)
            .where(eq(category.name, categoryName))
        ),
      ),
      with: {
        category: true,
      },
      orderBy: desc(newsArticle.createdAt),
      limit: 7,
    });
  }

  return Response.json({
    success: true,
    message: "Successfully fetched",
    data: {
      result,
    },
  });
}
