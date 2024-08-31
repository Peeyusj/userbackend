import { db } from "@/db";
import { newsArticle } from "@/db/schemas/news";
import { desc, and, isNotNull, sql } from "drizzle-orm";

export async function GET(request: Request) {
  let result = await db
    .select({ tags: newsArticle.tags, id: newsArticle.id })
    .from(newsArticle)
    .where(
      and(
        isNotNull(newsArticle.tags),
        sql`json_array_length(${newsArticle.tags}) > 0`,
      ),
    )
    .orderBy(desc(newsArticle.createdAt), desc(newsArticle.priority))
    .limit(15);

  //   @ts-ignore
  result = result?.map((item) => ({ tag: item?.tags[0], id: item?.id }));

  return Response.json({
    success: true,
    message: "Successfully fetched",
    data: result?.length > 5 ? result : [],
  });
}
