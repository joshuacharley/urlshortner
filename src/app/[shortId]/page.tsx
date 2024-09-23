import { getOriginalUrl } from '../actions'
import { redirect } from 'next/navigation'

export default async function ShortUrlRedirect({ params }: { params: { shortId: string } }) {
  const originalUrl = await getOriginalUrl(params.shortId)

  if (originalUrl) {
    redirect(originalUrl)
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">404 - URL Not Found</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">The shortened URL you're looking for doesn't exist or has expired.</p>
        </div>
      </div>
    )
  }
}