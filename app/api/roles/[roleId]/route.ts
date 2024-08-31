import { db } from "@/db";
// import { newsArticle } from "@/db/schemas/news";
import { and, eq, ne } from "drizzle-orm";
import { category, newsArticle } from "@/db/schemas/news";
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server";
import { roles } from "@/db/schemas";

type Params = {
  roleId: number;
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

    const id = context.params.roleId; //

    const result = await db.query.roles.findFirst({
      where: (roles) => eq(roles.id, id),
      with: {
        category: true,
      },
    });


    return Response.json({
      success: true,
      message: "Article Created Successfully",
      data: result,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return Response.error();
  }
}

export async function PUT(req: Request, context: { params: Params }) {
  try {


    const id = context.params.roleId; // '

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
        // tags
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

export async function PATCH(req: Request, context: { params: Params }) {
  try {
    const id = context.params.roleId; // '

    const {
      newStatus
    } = (await req.json()) ;
console.log("newStatus",newStatus)
console.log("id",id)

    await db
      .update(roles)
      .set({
        status:newStatus
      })
      .where(eq(roles.id, id));

    return Response.json({
      success: true,
      message: "Role Updated Successfully",
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return Response.error();
  }
}

export async function DELETE(req: Request, context: { params: Params }) {
  try {

    const id = context.params.roleId;

    await db.delete(roles).where(eq(roles.id, id));

    return Response.json({
      success: true,
      message: "Role Deleted Successfully",
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return Response.error();
  }
}
