'use client'

import { useState } from 'react'
import { shortenUrl } from '../app/actions'
import { AlertCircle, CheckCircle2, Copy, Link as LinkIcon } from 'lucide-react'
import QRCode from './QRCode'

export default function UrlShortenerForm() {
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [useCustomAlias, setUseCustomAlias] = useState(false)
  const [useExpiration, setUseExpiration] = useState(false)
  const [usePassword, setUsePassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setShortUrl(null)

    try {
      const result = await shortenUrl(formData)
      if ('shortUrl' in result && result.shortUrl) {
        setShortUrl(result.shortUrl)
      } else if ('error' in result) {
        setError(result.error || null) // Ensure it's either a string or null
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
      <div className="p-8">
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Paste your long URL
            </label>
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                <LinkIcon className="h-5 w-5" />
              </span>
              <input
                type="url"
                id="originalUrl"
                name="originalUrl"
                required
                className="flex-1 block  w-full text-cyan-900 rounded-none rounded-r-md sm:text-sm border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/very/long/url"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <input
                id="useCustomAlias"
                name="useCustomAlias"
                type="checkbox"
                checked={useCustomAlias}
                onChange={(e) => setUseCustomAlias(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="useCustomAlias" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Custom alias
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="useExpiration"
                name="useExpiration"
                type="checkbox"
                checked={useExpiration}
                onChange={(e) => setUseExpiration(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="useExpiration" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Set expiration
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="usePassword"
                name="usePassword"
                type="checkbox"
                checked={usePassword}
                onChange={(e) => setUsePassword(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="usePassword" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Password protect
              </label>
            </div>
          </div>

          {useCustomAlias && (
            <div className="space-y-2">
              <label htmlFor="customAlias" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Custom Alias
              </label>
              <input
                type="text"
                id="customAlias"
                name="customAlias"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                placeholder="my-custom-alias"
              />
            </div>
          )}

          {useExpiration && (
            <div className="space-y-2">
              <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Expiration Date
              </label>
              <input
                type="datetime-local"
                id="expirationDate"
                name="expirationDate"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          )}

          {usePassword && (
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                placeholder="Enter a password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-150 ease-in-out dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isLoading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded" role="alert">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        )}

        {shortUrl && (
          <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">Your Shortened URL</h3>
            <div className="flex items-center space-x-2 mb-4">
              <input
                value={shortUrl}
                readOnly
                className="flex-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-800 dark:text-white"
              />
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex justify-center">
              <QRCode url={shortUrl} size={150} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}