import { db } from "@/db";

export async function GET(request: Request) {
  let result: any;

  const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

  result = await db.query.newsArticle.findMany({
    where: (newsArticle, { lt }) => lt(newsArticle.createdAt, today),
    columns: {
      id: true,
      imgSrc: true,
      title: true,
    },
    orderBy: (newsArticle, { desc }) => [
      desc(newsArticle.priority),
      desc(newsArticle.createdAt),
    ],
    limit: 8,
  });

  return Response.json({
    success: true,
    message: "Successfully fetched",
    data: {
      result,
    },
  });
}
