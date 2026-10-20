import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  DeleteObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Cloudflare R2 Credentials & Endpoint Configuration
export const R2_CONFIG = {
  bucketName: process.env.R2_BUCKET_NAME || 'prosify',
  folderPath: 'Photos/',
  endpoint:
    process.env.R2_ENDPOINT ||
    'https://477b7cf9388de6074251205b112c1164.r2.cloudflarestorage.com',
  accessKeyId:
    process.env.R2_ACCESS_KEY_ID || '27cb36f2fe141a4a0110c4caebc7ed',
  secretAccessKey:
    process.env.R2_SECRET_ACCESS_KEY ||
    '6cefe3e5b2bc20aca414aac68542e750e18ea576b370ebc06bb5ec89b9566b05',
  region: 'auto',
  publicDomain: process.env.R2_PUBLIC_DOMAIN || '', // optional public CDN domain if configured in Cloudflare
};

let cachedR2Client: S3Client | null = null;

export function getR2Client(): S3Client {
  if (!cachedR2Client) {
    cachedR2Client = new S3Client({
      region: R2_CONFIG.region,
      endpoint: R2_CONFIG.endpoint,
      credentials: {
        accessKeyId: R2_CONFIG.accessKeyId,
        secretAccessKey: R2_CONFIG.secretAccessKey,
      },
    });
  }
  return cachedR2Client;
}

/**
 * Sanitizes and formats an R2 object key within the designated Photos/ directory
 */
export function buildR2Key(originalFilename: string, prefix = 'img'): string {
  const sanitized = originalFilename
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '_')
    .slice(0, 50);
  const ext = sanitized.includes('.') ? sanitized.split('.').pop() : 'png';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${R2_CONFIG.folderPath}${prefix}_${timestamp}_${random}.${ext}`;
}

/**
 * Direct Server-Side Upload to Cloudflare R2
 */
export async function uploadBufferToR2({
  buffer,
  key,
  contentType,
  metadata = {},
}: {
  buffer: Buffer | Uint8Array;
  key: string;
  contentType: string;
  metadata?: Record<string, string>;
}): Promise<{ key: string; bucket: string; etag?: string }> {
  const client = getR2Client();

  const command = new PutObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    Metadata: metadata,
  });

  const response = await client.send(command);

  return {
    key,
    bucket: R2_CONFIG.bucketName,
    etag: response.ETag,
  };
}

/**
 * Generates an S3-compatible presigned PUT URL for direct client-to-R2 upload
 */
export async function generateR2PresignedUploadUrl({
  key,
  contentType,
  expiresInSeconds = 300, // 5 minutes
}: {
  key: string;
  contentType: string;
  expiresInSeconds?: number;
}): Promise<{ presignedUrl: string; key: string; bucket: string }> {
  const client = getR2Client();

  const command = new PutObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: key,
    ContentType: contentType,
  });

  const presignedUrl = await getSignedUrl(client, command, {
    expiresIn: expiresInSeconds,
  });

  return {
    presignedUrl,
    key,
    bucket: R2_CONFIG.bucketName,
  };
}

/**
 * Generates an S3-compatible presigned GET URL to view or download a private R2 object
 */
export async function generateR2PresignedDownloadUrl({
  key,
  expiresInSeconds = 3600, // 1 hour
}: {
  key: string;
  expiresInSeconds?: number;
}): Promise<string> {
  const client = getR2Client();

  const command = new GetObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: key,
  });

  return await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

/**
 * Retrieves an object stream from Cloudflare R2
 */
export async function getR2Object({ key }: { key: string }) {
  const client = getR2Client();

  const command = new GetObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: key,
  });

  return await client.send(command);
}

/**
 * Deletes an object from Cloudflare R2
 */
export async function deleteR2Object({ key }: { key: string }) {
  const client = getR2Client();

  const command = new DeleteObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: key,
  });

  return await client.send(command);
}
