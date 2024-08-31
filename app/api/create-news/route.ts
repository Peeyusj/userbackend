import { db } from "@/db";
import { newsArticle } from "@/db/schemas/news";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

interface NewsArticleSchema {
  content: string;
  markdownContent: string;
  title: string;
  description: string;
  imgSrc?: string;
  category_id: string;
  priority: number;
  author: string;
  tags:string[]
}

export async function POST(req: Request) {
  try {
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

   await db.insert(newsArticle).values({
        content,
        markdownContent,
        title,
        description,
        imgSrc,
        category:Number(category_id),
        priority,
        author,
        tags
    });

    return Response.json({
      success:true,
      message:"Article Created Successfully"
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return Response.error();
  }
}
