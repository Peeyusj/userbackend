import { db } from "@/db";
import { users } from "@/db/schemas";
import { sql } from "drizzle-orm";

interface DeleteUsersRequest {
  userIds: number[];
}

export async function DELETE(req: Request) {
  try {
    const { userIds } = (await req.json()) as DeleteUsersRequest;

    const result = await db.delete(users)
      .where(sql`${users.id} IN ${userIds}`)
      .returning({ deletedId: users.id });

    return Response.json({
      success: true,
      message: "Users Deleted Successfully",
      deletedUsers: result.map(r => r.deletedId)
    });
  } catch (e) {
    console.error(e);
    return Response.error();
  }
}