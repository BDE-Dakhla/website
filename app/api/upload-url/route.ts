import type { NextRequest } from 'next/server'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/auth'
import { SPONSOR_LOGO_CONSTRAINTS } from '@/lib/file-validation'
import { getUploadUrl, isS3Configured } from '@/lib/storage'

export async function POST(req: NextRequest) {
  const t = await getTranslations({ locale: req.nextUrl.locale })

  try {
    if (!isS3Configured()) {
      return Response.json({ error: t('api.s3NotConfigured') }, { status: 503 })
    }

    const { key, contentType, uploadType, fileSize } = await req.json()

    if (!key || !contentType) {
      return Response.json(
        { error: t('api.missingRequiredFields') },
        { status: 400 },
      )
    }

    if (uploadType === 'sponsor-logo') {
      const session = await auth()
      if (!session?.user) {
        return Response.json({ error: t('api.unauthorized') }, { status: 401 })
      }

      if (!SPONSOR_LOGO_CONSTRAINTS.allowedTypes.includes(contentType)) {
        return Response.json(
          { error: t('api.invalidFileType') },
          { status: 400 },
        )
      }

      if (fileSize && fileSize > SPONSOR_LOGO_CONSTRAINTS.maxSize) {
        return Response.json(
          {
            error: t('api.fileSizeTooLarge', {
              maxSize: Math.round(
                SPONSOR_LOGO_CONSTRAINTS.maxSize / 1024 / 1024,
              ),
            }),
          },
          { status: 400 },
        )
      }

      if (!key.startsWith('sponsors/')) {
        return Response.json({ error: t('api.invalidKey') }, { status: 400 })
      }
    } else {
      if (!/^image\//.test(contentType)) {
        return Response.json(
          { error: t('api.unsupportedType') },
          { status: 400 },
        )
      }
    }

    const uploadUrl = await getUploadUrl(key, contentType)
    return Response.json({ url: uploadUrl })
  } catch (error) {
    console.error('Upload URL generation error:', error)
    return Response.json(
      { error: t('api.internalServerError') },
      { status: 500 },
    )
  }
}
