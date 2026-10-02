import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { projects } from '../db/schema.js'
import { getSupabaseAdmin } from '../middleware/auth.js'

const MICROLINK_API = 'https://api.microlink.io'

async function fetchScreenshotUrl(websiteUrl: string): Promise<string | null> {
  const apiUrl = `${MICROLINK_API}?url=${encodeURIComponent(websiteUrl)}&screenshot=true&meta=false`
  const res = await fetch(apiUrl, { signal: AbortSignal.timeout(45000) })
  if (!res.ok) {
    console.error('Microlink API error:', res.status, await res.text().catch(() => ''))
    return null
  }

  const contentType = res.headers.get('content-type') ?? ''
  if (contentType.includes('image/')) {
    return apiUrl
  }

  const data = (await res.json()) as {
    status?: string
    data?: { screenshot?: { url?: string } }
    message?: string
  }

  if (data.status === 'fail') {
    console.error('Microlink capture failed:', data.message ?? 'unknown error')
    return null
  }

  return data.data?.screenshot?.url ?? null
}

export async function captureThumbnail(projectId: string, websiteUrl: string): Promise<string | null> {
  try {
    const imageUrl = await fetchScreenshotUrl(websiteUrl)
    if (!imageUrl) return null

    const imageRes = await fetch(imageUrl, { signal: AbortSignal.timeout(45000) })
    if (!imageRes.ok) {
      await saveThumbnailUrl(projectId, imageUrl)
      return imageUrl
    }

    const contentType = imageRes.headers.get('content-type') ?? 'image/webp'
    const buffer = Buffer.from(await imageRes.arrayBuffer())
    const ext = contentType.includes('png') ? 'png' : contentType.includes('jpeg') ? 'jpg' : 'webp'
    const supabase = getSupabaseAdmin()
    const path = `${projectId}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('thumbnails')
      .upload(path, buffer, { contentType, upsert: true })

    if (uploadError) {
      console.error('Thumbnail upload failed, using direct URL:', uploadError.message)
      await saveThumbnailUrl(projectId, imageUrl)
      return imageUrl
    }

    const { data: publicUrl } = supabase.storage.from('thumbnails').getPublicUrl(path)
    await saveThumbnailUrl(projectId, publicUrl.publicUrl)
    return publicUrl.publicUrl
  } catch (err) {
    console.error('Thumbnail capture failed:', err)
    return null
  }
}

async function saveThumbnailUrl(projectId: string, url: string) {
  await db
    .update(projects)
    .set({ thumbnailUrl: url, thumbnailUpdatedAt: new Date(), updatedAt: new Date() })
    .where(eq(projects.id, projectId))
}

export function scheduleThumbnailCapture(projectId: string, websiteUrl: string) {
  setImmediate(() => {
    captureThumbnail(projectId, websiteUrl).catch((err) =>
      console.error('Background thumbnail capture failed:', err)
    )
  })
}
