import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Validate S3 credentials
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY
const S3_SECRET_KEY = process.env.S3_SECRET_KEY
const S3_ENDPOINT = process.env.S3_ENDPOINT
const S3_BUCKET = process.env.S3_BUCKET

if (!S3_ACCESS_KEY || !S3_SECRET_KEY) {
  throw new Error(
    'S3 credentials not configured. Please set S3_ACCESS_KEY and S3_SECRET_KEY in your .env file.',
  )
}

if (!S3_ENDPOINT || !S3_BUCKET) {
  throw new Error(
    'S3 configuration incomplete. Please set S3_ENDPOINT and S3_BUCKET in your .env file.',
  )
}

export const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: S3_ENDPOINT,
  forcePathStyle: true, // required for MinIO
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
})

let bucketInitialized = false

async function ensureBucketExists(): Promise<void> {
  if (bucketInitialized) return

  try {
    await s3.send(new HeadBucketCommand({ Bucket: S3_BUCKET }))
    bucketInitialized = true
  } catch (error) {
    try {
      await s3.send(new CreateBucketCommand({ Bucket: S3_BUCKET }))
      console.log(`Bucket "${S3_BUCKET}" created successfully`)
      bucketInitialized = true
    } catch (createError) {
      console.error('Failed to create bucket:', createError)
      throw new Error(`Failed to initialize bucket: ${S3_BUCKET}`)
    }
  }
}

export async function getUploadUrl(
  key: string,
  contentType: string,
): Promise<string> {
  await ensureBucketExists()

  const cmd = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: contentType,
  })

  return getSignedUrl(s3, cmd, { expiresIn: 60 })
}
