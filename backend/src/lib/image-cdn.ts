/**
 * image-cdn.ts
 *
 * Cloudflare R2 upload client for permanent image hosting.
 * Used by the migration script and future write paths that need to
 * store images on our CDN rather than referencing external URLs.
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../env";

/** Returns true when a URL already lives on our R2 CDN. */
export function isCdnUrl(url: string): boolean {
  if (!env.R2_PUBLIC_URL) return false;
  return url.startsWith(env.R2_PUBLIC_URL);
}

/** Lazily-created S3 client; throws a clear error if R2 is not configured. */
function getS3Client(): S3Client {
  if (!env.R2_ACCOUNT_ID || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) {
    throw new Error(
      "R2 not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and " +
        "R2_SECRET_ACCESS_KEY via the ENV tab before running the migration."
    );
  }
  return new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });
}

/**
 * Downloads an image from `sourceUrl` and uploads it to R2 at `cdnPath`.
 *
 * @param sourceUrl  - The external URL to fetch (Wikimedia, etc.)
 * @param cdnPath    - Key inside the R2 bucket, e.g. "waterways/{id}/hero.jpg"
 * @returns          - The permanent public CDN URL for the uploaded image
 * @throws           - On download failure (non-2xx) or R2 upload failure
 */
export async function uploadImageFromUrl(
  sourceUrl: string,
  cdnPath: string
): Promise<string> {
  if (!env.R2_BUCKET_NAME || !env.R2_PUBLIC_URL) {
    throw new Error(
      "R2_BUCKET_NAME and R2_PUBLIC_URL must be set via the ENV tab."
    );
  }

  // Download the image, following redirects (Wikimedia Special:FilePath uses 302)
  const response = await fetch(sourceUrl, {
    headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (image-migration)" },
    signal: AbortSignal.timeout(30_000),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} downloading ${sourceUrl}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") ?? "image/jpeg";

  // Upload to R2
  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: cdnPath,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `${env.R2_PUBLIC_URL}/${cdnPath}`;
}
