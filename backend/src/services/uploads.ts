import { randomUUID } from 'crypto'
import { existsSync, mkdirSync } from 'fs'
import { extname, join } from 'path'
import type { Request } from 'express'
import multer from 'multer'

const uploadRoot = process.env.UPLOAD_DIR || join(process.cwd(), 'data', 'uploads')

export function ensureUploadDir() {
  if (!existsSync(uploadRoot)) mkdirSync(uploadRoot, { recursive: true })
  const thumbs = join(uploadRoot, 'thumbnails')
  const diagrams = join(uploadRoot, 'diagrams')
  if (!existsSync(thumbs)) mkdirSync(thumbs, { recursive: true })
  if (!existsSync(diagrams)) mkdirSync(diagrams, { recursive: true })
}

export function getUploadRoot() {
  return uploadRoot
}

function storage(subdir: 'thumbnails' | 'diagrams') {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      ensureUploadDir()
      cb(null, join(uploadRoot, subdir))
    },
    filename: (_req, file, cb) => {
      const ext = extname(file.originalname).toLowerCase() || '.jpg'
      const safe = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg'
      cb(null, `${randomUUID()}${safe}`)
    },
  })
}

const imageFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('Only image uploads are allowed'))
    return
  }
  cb(null, true)
}

export const uploadThumbnail = multer({
  storage: storage('thumbnails'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
}).single('file')

export const uploadDiagram = multer({
  storage: storage('diagrams'),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: imageFilter,
}).single('file')

export function publicUploadUrl(req: Request, subdir: string, filename: string) {
  const base = process.env.PUBLIC_API_URL || `${req.protocol}://${req.get('host')}`
  return `${base.replace(/\/$/, '')}/uploads/${subdir}/${filename}`
}
