import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY
const S3_SECRET_KEY = process.env.S3_SECRET_KEY
const S3_ENDPOINT = process.env.S3_ENDPOINT
const S3_BUCKET = process.env.S3_BUCKET

// Check if S3 configuration is complete
export function isS3Configured(): boolean {
  return Boolean(S3_ACCESS_KEY && S3_SECRET_KEY && S3_ENDPOINT && S3_BUCKET)
}

// Create S3 client only if configured
function getS3Client(): S3Client | null {
  if (!isS3Configured()) {
    return null
  }

  return new S3Client({
    region: 'us-east-1',
    endpoint: S3_ENDPOINT!,
    forcePathStyle: true,
    credentials: {
      accessKeyId: S3_ACCESS_KEY!,
      secretAccessKey: S3_SECRET_KEY!,
    },
  })
}

let bucketInitialized = false

async function ensureBucketExists(): Promise<void> {
  if (bucketInitialized) return

  const s3Client = getS3Client()
  if (!s3Client) {
    throw new Error('S3 is not configured')
  }

  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: S3_BUCKET! }))
    bucketInitialized = true
  } catch {
    try {
      await s3Client.send(new CreateBucketCommand({ Bucket: S3_BUCKET! }))
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
  const s3Client = getS3Client()
  if (!s3Client) {
    throw new Error(
      'S3 storage is not configured. Please set S3_ACCESS_KEY, S3_SECRET_KEY, S3_ENDPOINT, and S3_BUCKET environment variables.',
    )
  }

  await ensureBucketExists()

  const cmd = new PutObjectCommand({
    Bucket: S3_BUCKET!,
    Key: key,
    ContentType: contentType,
  })

  return getSignedUrl(s3Client, cmd, { expiresIn: 60 })
}
