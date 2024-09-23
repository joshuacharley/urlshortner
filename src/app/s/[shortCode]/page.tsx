import { redirect } from 'next/navigation'
import { getOriginalUrl } from '../../actions'

export default async function ShortUrlRedirect({ params }: { params: { shortCode: string } }) {
  const originalUrl = await getOriginalUrl(params.shortCode)

  if (originalUrl) {
    redirect(originalUrl)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">URL not found</h1>
      <p>The requested short URL does not exist or has expired.</p>
    </div>
  )
}