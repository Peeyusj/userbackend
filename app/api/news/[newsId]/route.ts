import { db } from "@/db";
// import { newsArticle } from "@/db/schemas/news";
import { and, eq, ne } from "drizzle-orm";
import { category, newsArticle } from "@/db/schemas/news";
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server";

type Params = {
  newsId: number;
};

interface NewsArticleSchema {
  content: string;
  markdownContent: string;
  title: string;
  description: string;
  imgSrc?: string;
  category_id: string;
  priority: number;
  author: string;
  tags:string []
}

export async function GET(req: Request, context: { params: Params }) {
  try {

    const id = context.params.newsId; //
    const { searchParams } = new URL(req.url);
    let getRelated = searchParams.get("getRelated");

    const result = await db.query.newsArticle.findFirst({
      where: (newsArticle) => eq(newsArticle.id, id),
      with: {
        category: true,
      },
    });

    const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

    let getRelatedNews;

    if (result && getRelated) {
      getRelatedNews = await db.query.newsArticle.findMany({
        where: (newsArticle, { eq, lt }) =>
          and(
            eq(
              newsArticle.category,
              db
                .select({ id: category.id })
                .from(category)
                // @ts-ignore
                .where(eq(category.name, result?.category?.name)),
            ),
            lt(newsArticle.createdAt, today),
            // @ts-ignore
            ne(newsArticle.id, result?.id),
          ),
        columns: {
          createdAt: true,
          id: true,
          title: true,
          imgSrc: true,
        },
        orderBy: (newsArticle, { desc }) => [
          desc(newsArticle.priority),
          desc(newsArticle.createdAt),
        ],
        limit: 3,
      });
    }

    return Response.json({
      success: true,
      message: "Article Created Successfully",
      data: result,
      getRelatedNews,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return Response.error();
  }
}

export async function PUT(req: Request, context: { params: Params }) {
  try {

    const secret = process.env.NEXTAUTH_SECRET 

    // @ts-ignore
    const token = await getToken({ req, secret })
    console.log("JSON Web Token🎄🎄🎄", token)
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized: No token provided please login" }),
        { status: 401 }
      );
    }


    const id = context.params.newsId; // '

    const {
      content,
      markdownContent,
      title,
      description,
      imgSrc,
      category_id,
      priority,
      author,
      tags
    } = (await req.json()) as NewsArticleSchema;

    await db
      .update(newsArticle)
      .set({
        content,
        markdownContent,
        title,
        description,
        imgSrc,
        category: Number(category_id),
        priority,
        author,
        tags
      })
      .where(eq(newsArticle.id, id));

    return Response.json({
      success: true,
      message: "Article Updated Successfully",
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return Response.error();
  }
}

export async function DELETE(req: Request, context: { params: Params }) {
  try {
    const secret = process.env.NEXTAUTH_SECRET 

    // @ts-ignore
    const token = await getToken({ req, secret })
    console.log("JSON Web Token🎄🎄🎄", token)
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized: No token provided please login" }),
        { status: 401 }
      );
    }
    const id = context.params.newsId;

    await db.delete(newsArticle).where(eq(newsArticle.id, id));

    return Response.json({
      success: true,
      message: "Article Deleted Successfully",
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return Response.error();
  }
}
