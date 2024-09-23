'use client'

import { useState, useEffect } from 'react'
import { getUrlAnalytics } from '../app/actions'

export default function Analytics({ shortCode }: { shortCode: string }) {
  const [clicks, setClicks] = useState<number | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      const analytics = await getUrlAnalytics(shortCode)
      if (analytics) {
        setClicks(analytics.clicks)
      }
    }
    fetchAnalytics()
  }, [shortCode])

  if (clicks === null) {
    return null
  }

  return (
    <div className="mt-2 text-sm text-gray-600">
      Clicks: {clicks}
    </div>
  )
}