// ** Import Core Packages **
import { NextResponse } from "next/server";

// ** Import Third Party Packages **
import { Blob } from "buffer";
import { v4 as uuidv4 } from "uuid";

// ** Import Helpers **
import { deleteFileFromS3, extractKeyFromUrl, uploadFileToS3 } from "./helper";

/**
 * Handles the POST request to upload a file.
 *
 * @param request - The incoming POST request.
 * @returns A NextResponse object with the operation result.
 */

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${uuidv4()}.jpg`;
    const url = await uploadFileToS3(buffer, fileName, file.type);

    return NextResponse.json({ success: true, data: { fileName, url } });
  } catch (error: any) {
    console.error(`☁️ Error uploading file: ${error.message}`);
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Handles the DELETE request to remove a file from AWS S3.
 *
 * @param request - The incoming DELETE request.
 * @returns A NextResponse object with the operation result.
 */
export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const requestJson = await request.json();
    const fileUrl = requestJson.url;

    if (!fileUrl) {
      return NextResponse.json(
        { error: "File URL is required." },
        { status: 400 },
      );
    }

    const fileKey = extractKeyFromUrl(fileUrl);
    await deleteFileFromS3(fileKey);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully.",
    });
  } catch (error: any) {
    console.error(`Error deleting file: ${error.message}`);
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 },
    );
  }
}
