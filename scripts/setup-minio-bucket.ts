/**
 * Setup script to configure MinIO bucket for public read access
 * Run with: bun run scripts/setup-minio-bucket.ts
 */

import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  S3Client,
} from '@aws-sdk/client-s3'

const S3_ENDPOINT = process.env.S3_ENDPOINT || 'http://127.0.0.1:9000'
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || 'minio'
const S3_SECRET_KEY = process.env.S3_SECRET_KEY || 'minio12345'
const S3_BUCKET = process.env.S3_BUCKET || 'assets'

const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
})

async function setupBucket() {
  console.log(`Setting up MinIO bucket: ${S3_BUCKET}`)

  // Check if bucket exists
  try {
    await s3.send(new HeadBucketCommand({ Bucket: S3_BUCKET }))
    console.log(`✓ Bucket "${S3_BUCKET}" already exists`)
  } catch {
    // Create bucket if it doesn't exist
    try {
      await s3.send(new CreateBucketCommand({ Bucket: S3_BUCKET }))
      console.log(`✓ Bucket "${S3_BUCKET}" created`)
    } catch (error) {
      console.error('✗ Failed to create bucket:', error)
      process.exit(1)
    }
  }

  // Set bucket policy to allow public read access for sponsors folder
  const bucketPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: ['*'] },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${S3_BUCKET}/sponsors/*`],
      },
    ],
  }

  try {
    await s3.send(
      new PutBucketPolicyCommand({
        Bucket: S3_BUCKET,
        Policy: JSON.stringify(bucketPolicy),
      }),
    )
    console.log(`✓ Bucket policy applied - sponsors folder is now public`)
    console.log(
      `\nYou can now access sponsor logos at:\n${S3_ENDPOINT}/${S3_BUCKET}/sponsors/{filename}.svg`,
    )
  } catch (error) {
    console.error('✗ Failed to set bucket policy:', error)
    process.exit(1)
  }
}

setupBucket()
  .then(() => {
    console.log('\n✓ MinIO setup complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n✗ Setup failed:', error)
    process.exit(1)
  })
