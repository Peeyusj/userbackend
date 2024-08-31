// ** Import Third Party Packages **
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// Define root and subfolder names
const rootFolder = "article";
const subFolder = "images";

// Assuming you've set these environment variables in your .env.local or equivalent
const s3Client = new S3Client({
  region: process.env.AWS_REGION ?? "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

/**
 * Uploads a file to AWS S3.
 *
 * @param file - The file to be uploaded as a Buffer.
 * @param fileName - The name to save the file as in S3.
 * @returns The file name of the uploaded file.
 */

export async function uploadFileToS3(
  file: Buffer,
  fileName: string,
  contentType: string,
): Promise<string> {
  const filePath = `${rootFolder}/${subFolder}/${fileName}`;
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME ?? "",
    Key: filePath,
    Body: file,
    ACL: "public-read",
    ContentType: contentType,
  });

  await s3Client.send(command);
  return `https://${process.env.AWS_BUCKET_NAME ?? ""}.s3.amazonaws.com/${filePath}`;
}

/**
 * Extracts the S3 object key from the given URL.
 *
 * @param url - The URL of the S3 object.
 * @returns The object key.
 */

export function extractKeyFromUrl(url: string): string {
  const bucketUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/`;
  return url.replace(bucketUrl, "");
}

/**
 * Deletes a file from AWS S3.
 *
 * @param key - The key of the file to be deleted.
 */

export async function deleteFileFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}
