import { db } from "@/db";
import { roles, users } from "@/db/schemas";
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
        sql`LOWER(${users.userName}) LIKE LOWER(${sql.raw(
          `'%${search}%'`,
        )})`
      ),
    );
  }

  const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

  const usersData = await db.query.users.findMany({
    where: whereCondition,
    orderBy: desc(newsArticle.id),
    //   @ts-ignore
    limit: limit,
    //   @ts-ignore
    offset: (page - 1) * limit, // Correct offset calculation
  });

  const totalCount: number = await db
    .select({ count: sql`count(*)`.mapWith(Number) })
    .from(users)
    .where(whereCondition)
    .then((res) => res[0].count);

  return Response.json({
    success: true,
    message: "Successfully fetched",
    data: {
      usersData,
      //   @ts-ignore
      totalPages: Math.ceil(totalCount / limit), // Calculate total pages based on count
      totalCount: totalCount,
    },
  });
}
