import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;

const client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function main() {
  console.log(`Purging all objects from bucket: ${R2_BUCKET_NAME}`);

  let totalDeleted = 0;
  let continuationToken: string | undefined;

  do {
    const listCmd = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      MaxKeys: 1000,
      ContinuationToken: continuationToken,
    });

    const listResult = await client.send(listCmd);
    const objects = listResult.Contents ?? [];

    if (objects.length === 0) {
      console.log("No objects found.");
      break;
    }

    console.log(`Deleting batch of ${objects.length} objects...`);

    const deleteCmd = new DeleteObjectsCommand({
      Bucket: R2_BUCKET_NAME,
      Delete: {
        Objects: objects.map(o => ({ Key: o.Key! })),
        Quiet: true,
      },
    });

    const deleteResult = await client.send(deleteCmd);

    if (deleteResult.Errors && deleteResult.Errors.length > 0) {
      console.error("Errors during deletion:", deleteResult.Errors);
    }

    totalDeleted += objects.length;
    continuationToken = listResult.NextContinuationToken;
  } while (continuationToken);

  console.log(`\n========= R2 PURGE SUMMARY =========`);
  console.log(`Total objects deleted: ${totalDeleted}`);
  console.log(`Bucket: ${R2_BUCKET_NAME}`);
  console.log(`====================================`);
}

main().catch(console.error);
