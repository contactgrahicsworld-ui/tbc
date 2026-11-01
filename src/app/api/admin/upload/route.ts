import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { randomBytes } from 'crypto'
import { put } from '@vercel/blob'

export const runtime = 'nodejs'

// POST /api/admin/upload — multipart/form-data with a `file` field (image)
//
// Storage:
//   1. Vercel Blob  — when BLOB_READ_WRITE_TOKEN is set (Vercel deployment).
//                     Images persist on Vercel's CDN, URL returned directly.
//   2. Local disk   — fallback (sandbox/local dev): public/uploads/<name>.
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const ext = ALLOWED_TYPES[file.type]
    if (!ext) {
      return NextResponse.json(
        { error: 'Only JPG, PNG, WebP, GIF or AVIF images are allowed' },
        { status: 400 }
      )
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Image must be under 5 MB' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const name = `${Date.now()}-${randomBytes(6).toString('hex')}${ext}`

    // 1) Vercel Blob (production)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`tbc-uploads/${name}`, file, {
        access: 'public',
        addRandomSuffix: false,
        contentType: file.type,
      })
      return NextResponse.json({ url: blob.url })
    }

    // 2) Local disk fallback (sandbox / local dev)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })
    await writeFile(path.join(uploadsDir, name), buffer)

    return NextResponse.json({ url: `/uploads/${name}` })
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
