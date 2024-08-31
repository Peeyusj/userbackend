import { db } from "@/db";
import { eq } from "drizzle-orm";

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
