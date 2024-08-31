import { db } from "@/db";
import {  eq } from "drizzle-orm";
import { roles } from "@/db/schemas";

type Params = {
  roleId: number;
};


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
