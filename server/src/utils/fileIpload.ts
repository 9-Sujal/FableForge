import s3Client from "@/cloud/aws";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs"
import path from "path"
import { generateS3ClientPublicUrl } from "./helper";
import {File} from "formidable"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const updateAvatarToAws = async (
  file: File,
  uniqueFileName: string,
  avatarId?: string
) => {
  const bucketName = process.env.AWS_PUBLIC_BUCKET;
  if (avatarId) {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: avatarId,
    });
    await s3Client.send(deleteCommand);
  }

  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueFileName,
    Body: fs.readFileSync(file.filepath),
    ContentType: file.mimetype || "image/png", 
  });
  await s3Client.send(putCommand);

  return {
    id: uniqueFileName,
    url: generateS3ClientPublicUrl(
      process.env.AWS_PUBLIC_BUCKET!,
      uniqueFileName
    ),
  };
};

export const uploadBookToAws = async (
  filepath: string,
  uniqueFileName: string,
  contentType: string = "image/png"
) => {
    console.log("Uploading to bucket:", process.env.AWS_PUBLIC_BUCKET); // ← add
  console.log("File key:", uniqueFileName); // ← add
  console.log("Content type:", contentType); // ← add
  const putCommand = new PutObjectCommand({
    Bucket: process.env.AWS_PUBLIC_BUCKET,
    Key: uniqueFileName,
    Body: fs.readFileSync(filepath),
      ContentType: contentType,
  });
  await s3Client.send(putCommand);

  return {
    id: uniqueFileName,
    url: generateS3ClientPublicUrl(
      process.env.AWS_PUBLIC_BUCKET!,
      uniqueFileName
    ),
  };
};

interface FileInfo {
  bucket: string;
  uniqueKey: string;
  contentType: string;
}
// This function generates a pre-signed URL for uploading a file to AWS S3.
// It takes an S3 client and file information as parameters and returns the pre-signed URL.
// The file information includes the bucket name, unique key for the file, and its content type.
//it reduces bandwidth usage and cost by allowing clients to upload files directly to S3 without routing through the server.

export const generateFileUploadUrl = async (
  client: S3Client,
  fileInfo: FileInfo
) => {
  const { bucket, uniqueKey, contentType } = fileInfo;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: uniqueKey,
    ContentType: contentType,
  });

  return await getSignedUrl(client, command);
};