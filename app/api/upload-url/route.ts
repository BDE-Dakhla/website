import { auth } from '@/auth'
import { SPONSOR_LOGO_CONSTRAINTS } from '@/lib/file-validation'
import { getUploadUrl, isS3Configured } from '@/lib/storage'

export async function POST(req: Request) {
  try {
    // Check if S3 is configured before proceeding
    if (!isS3Configured()) {
      return Response.json(
        {
          error: 'File upload is not available. S3 storage is not configured.',
        },
        { status: 503 },
      )
    }

    const { key, contentType, uploadType, fileSize } = await req.json()

    // Basic validation
    if (!key || !contentType) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Handle different upload types
    if (uploadType === 'sponsor-logo') {
      // Check authentication and permissions for sponsor logos
      const session = await auth()
      if (!session?.user) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }

      // Validate sponsor logo constraints
      if (!SPONSOR_LOGO_CONSTRAINTS.allowedTypes.includes(contentType)) {
        return Response.json(
          {
            error:
              'Invalid file type. Only SVG files are allowed for sponsor logos.',
          },
          { status: 400 },
        )
      }

      if (fileSize && fileSize > SPONSOR_LOGO_CONSTRAINTS.maxSize) {
        return Response.json(
          {
            error: `File size too large. Maximum size is ${Math.round(SPONSOR_LOGO_CONSTRAINTS.maxSize / 1024 / 1024)}MB.`,
          },
          { status: 400 },
        )
      }

      // Ensure the key is in the sponsors directory
      if (!key.startsWith('sponsors/')) {
        return Response.json(
          { error: 'Invalid key for sponsor logo' },
          { status: 400 },
        )
      }
    } else {
      // Default validation for other upload types
      if (!/^image\//.test(contentType)) {
        return Response.json({ error: 'Unsupported type' }, { status: 400 })
      }
    }

    const uploadUrl = await getUploadUrl(key, contentType)
    return Response.json({ url: uploadUrl })
  } catch (error) {
    console.error('Upload URL generation error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
