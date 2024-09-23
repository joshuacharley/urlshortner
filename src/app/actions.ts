'use server'

import { nanoid } from 'nanoid'
import { getDatabase } from '../lib/mongodb'
import { Url, IUrl } from '../models/Url'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { Types } from 'mongoose'

const baseUrlSchema = z.string().url().startsWith('http')

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return baseUrlSchema.parse(process.env.NEXT_PUBLIC_BASE_URL)
  }
  if (process.env.VERCEL_URL) {
    return baseUrlSchema.parse(`https://${process.env.VERCEL_URL}`)
  }
  return 'http://localhost:3000' // Fallback for local development
}

const shortenUrlSchema = z.object({
  originalUrl: z.string().url(),
  customAlias: z.string().min(3).max(20).optional(),
  expirationDate: z.string().datetime().optional(),
  password: z.string().min(6).optional(),
})

 async function shortenUrl(formData: FormData) {
  try {
   const validatedData = shortenUrlSchema.parse({
      originalUrl: formData.get('originalUrl'),
      customAlias: formData.get('customAlias') || undefined,
      expirationDate: formData.get('expirationDate') || undefined,
      password: formData.get('password') || undefined,
    })

    await getDatabase()

   let shortId = validatedData.customAlias || nanoid(8)
    let existingUrl = await Url.findOne({ shortId })

    // Ensure shortId is not null and is unique
    while (!shortId || existingUrl) {
      if (validatedData.customAlias) {
        return { error: 'Custom alias already exists. Please choose a different one.' }
      }
      shortId = nanoid(8)
      existingUrl = await Url.findOne({ shortId })
    }

    const hashedPassword = validatedData.password
      ? await bcrypt.hash(validatedData.password, 10)
      : undefined

    const newUrl = new Url({
      originalUrl: validatedData.originalUrl,
      shortId,
      expiresAt: validatedData.expirationDate ? new Date(validatedData.expirationDate) : undefined,
      password: hashedPassword,
    })

    await newUrl.save()

    const baseUrl = getBaseUrl()
    return { shortUrl: `${baseUrl}/${shortId}` }
  } catch (error) {
    console.error('Error shortening URL:', error)
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
      return { error: `Invalid input: ${errorMessages}` }
    }
    if (error instanceof Error) {
      return { error: `An error occurred: ${error.message}` }
    }
    return { error: 'An unexpected error occurred while shortening the URL. Please try again later.' }
  }
}

 async function getOriginalUrl(shortId: string): Promise<string | null> {
  try {
    await getDatabase()

    const result = await Url.findOneAndUpdate(
      { 
        shortId,
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: { $gt: new Date() } }
        ]
      },
      { $inc: { clicks: 1 } },
      { new: true }
    )

    if (result) {
      let originalUrl = result.originalUrl
      if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
        originalUrl = 'https://' + originalUrl
      }
      return originalUrl
    }

    return null
  } catch (error) {
    console.error('Error retrieving original URL:', error)
    return null
  }
}

 async function getUrlAnalytics(shortId: string): Promise<{ clicks: number } | null> {
  try {
    await getDatabase()

    const result = await Url.findOne({ shortId })

    if (result) {
      return { clicks: result.clicks }
    }

    return null
  } catch (error) {
    console.error('Error retrieving URL analytics:', error)
    return null
  }
}

 async function getAllUrls() {
  try {
    await getDatabase()

    const urls = await Url.find().lean<(IUrl & { _id: Types.ObjectId })[]>().sort({ createdAt: -1 })
    
    return urls.map(url => ({
      _id: url._id.toString(),
      originalUrl: url.originalUrl,
      shortId: url.shortId,
      clicks: url.clicks,
      createdAt: url.createdAt.toISOString(),
      expiresAt: url.expiresAt ? url.expiresAt.toISOString() : null,
      password: !!url.password
    }))
  } catch (error) {
    console.error('Error fetching URLs:', error)
    throw new Error('Failed to fetch URLs. Please try again later.')
  }
}

export { shortenUrl, getOriginalUrl, getUrlAnalytics, getAllUrls }