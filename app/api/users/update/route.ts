import { db } from "@/db";
import { users } from "@/db/schemas";
import { inArray, sql } from "drizzle-orm";

interface UpdateUsersStatusRequest {
  userIds: number[];
  newStatus: string;
}

export async function PATCH(req: Request) {
  try {
    const { userIds, newStatus } =
      (await req.json()) as UpdateUsersStatusRequest;

    const result = await db
      .update(users)
      .set({ status: newStatus })
      .where(inArray(users.id, userIds))
      .returning({ updatedId: users.id });

    return Response.json({
      success: true,
      message: "Users Status Updated Successfully",
      updatedUsers: result.map((r) => r.updatedId),
    });
  } catch (e) {
    console.error(e);
    return Response.error();
  }
}
