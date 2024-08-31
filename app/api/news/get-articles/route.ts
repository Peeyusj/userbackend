import { db } from "@/db";
import { newsArticle } from "@/db/schemas/news";
import { or, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  let search: string = searchParams.get("search") ?? "";
  let result: any;

  if (search) {
    result = await db
      .select({
        id: newsArticle.id,
        title: newsArticle.title,
      })
      .from(newsArticle)
      .where(
        or(
          sql`${newsArticle.title} LIKE ${sql.raw(`'%${search}%'`)}`,
          sql`json_array_length(${newsArticle.tags}) > 0 AND EXISTS (
            SELECT 1
            FROM json_each(${newsArticle.tags})
            WHERE value LIKE ${sql.raw(`'%${search}%'`)}
          )`
        ),
      );
  } else {
    result = await db.query.newsArticle.findMany({
      columns: {
        id: true,
        title: true,
      },
      orderBy: (newsArticle, { desc }) => [
        desc(newsArticle.priority),
        desc(newsArticle.createdAt),
      ],
      limit: 8,
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
