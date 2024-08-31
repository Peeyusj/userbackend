import { db } from "@/db";
import { roles } from "@/db/schemas";

interface Roles {
  roleName: string;
  createdBy: number;
  access: any;
}

export async function POST(req: Request) {
  try {
    const { roleName, createdBy, access } = (await req.json()) as Roles;
    console.log({
      name: roleName,
      createdBy: createdBy,
      status: "active",
      access: access,
    });
    await db.insert(roles).values({
      name: roleName,
      createdBy: createdBy,
      status: "active",
      access: access,
    });

    return Response.json({
      success: true,
      message: "Role Created Successfully",
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return Response.error();
  }
}

