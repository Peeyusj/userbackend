import { db } from "@/db";
// import { newsArticle } from "@/db/schemas/news";
import { and, eq, ne } from "drizzle-orm";
import { category, newsArticle } from "@/db/schemas/news";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { users } from "@/db/schemas";

type Params = {
  userId: number;
};

export async function PATCH(req: Request, context: { params: Params }) {
  try {
    const id = context.params.userId; // '

    const { newStatus } = await req.json();

    await db
      .update(users)
      .set({
        status: newStatus,
      })
      .where(eq(users.id, id));

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
    const id = context.params.userId;

    await db.delete(users).where(eq(users.id, id));

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
