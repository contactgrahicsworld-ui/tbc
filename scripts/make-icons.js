/**
 * Generate TBC PWA app icons from public/tbc-logo.png
 *  - icon-192.png / icon-512.png   (any)     — white background, logo 84%
 *  - maskable-512.png              (maskable) — brand red full-bleed, logo within safe zone
 *  - apple-touch-icon.png (180)    — brand red, logo 80%
 */
const sharp = require('sharp')
const path = require('path')
const root = path.join(__dirname, '..')
const logo = path.join(root, 'public', 'tbc-logo.png')
const BRAND_RED = '#C41E3A'

async function anyIcon(size) {
  const pad = Math.round(size * 0.08)
  const inner = size - pad * 2
  const logoBuf = await sharp(logo).resize(inner, inner).png().toBuffer()
  await sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } })
    .composite([{ input: logoBuf, top: pad, left: pad }])
    .png()
    .toFile(path.join(root, 'public', 'icons', `icon-${size}.png`))
  console.log(`icon-${size}.png ok`)
}

async function maskableIcon(size) {
  const inner = Math.round(size * 0.74) // inside 80% safe zone circle
  const pad = Math.round((size - inner) / 2)
  const logoBuf = await sharp(logo).resize(inner, inner).png().toBuffer()
  await sharp({ create: { width: size, height: size, channels: 4, background: BRAND_RED } })
    .composite([{ input: logoBuf, top: pad, left: pad }])
    .png()
    .toFile(path.join(root, 'public', 'icons', 'maskable-512.png'))
  console.log('maskable-512.png ok')
}

async function appleIcon(size) {
  const inner = Math.round(size * 0.8)
  const pad = Math.round((size - inner) / 2)
  const logoBuf = await sharp(logo).resize(inner, inner).png().toBuffer()
  await sharp({ create: { width: size, height: size, channels: 4, background: BRAND_RED } })
    .composite([{ input: logoBuf, top: pad, left: pad }])
    .png()
    .toFile(path.join(root, 'public', 'apple-touch-icon.png'))
  console.log('apple-touch-icon.png ok')
}

;(async () => {
  await anyIcon(192)
  await anyIcon(512)
  await maskableIcon(512)
  await appleIcon(180)
  console.log('ICONS_OK')
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
