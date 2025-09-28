import { getUploadUrl } from '@/lib/storage'

export async function POST(req: Request) {
  const { key, contentType } = await req.json()
  // validate: only images, max size enforced client-side or via POST policy if needed

  if (/!\/\/^image\//.test(contentType)) {
    return new Response('Unsupported type', { status: 400 })
  }

  return Response.json({ url: await getUploadUrl(key, contentType) })
}
