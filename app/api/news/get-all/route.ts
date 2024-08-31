import { db } from "@/db";
import { newsArticle } from "@/db/schemas/news";
import { and, desc, or, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let limit = searchParams.get("limit");
  let page = searchParams.get("page");
  let search = searchParams.get("search");

  //   @ts-ignore
  limit = parseInt(limit);
  //   @ts-ignore
  page = parseInt(page);

  let conditions = [];

  // Apply search filters
  if (search) {
    conditions.push(
      or(
        sql`LOWER(${newsArticle.title}) LIKE LOWER(${sql.raw(
          `'%${search}%'`,
        )})`,
        sql`LOWER(${newsArticle.author}) LIKE LOWER(${sql.raw(
          `'%${search}%'`,
        )})`,
      ),
    );
  }

  const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

  const newsData = await db.query.newsArticle.findMany({
    where: whereCondition,
    with: {
      category: true,
    },
    orderBy: desc(newsArticle.id),
    //   @ts-ignore
    limit: limit,
    //   @ts-ignore
    offset: (page - 1) * limit, // Correct offset calculation
  });


  const totalCount: number = await db
    .select({ count: sql`count(*)`.mapWith(Number) })
    .from(newsArticle)
    .where(whereCondition)
    .then((res) => res[0].count);

  return Response.json({
    success: true,
    message: "Successfully fetched",
    data: {
      newsData,
      //   @ts-ignore
      totalPages: Math.ceil(totalCount / limit), // Calculate total pages based on count
      totalCount: totalCount,
    },
  });
}
