import UrlShortenerForm from '../components/UrlShortenerForm'

export default function Home() {
  return (
    <div className="min-h-full bg-gradient-to-b from-blue-100 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-4 text-blue-800 dark:text-blue-400">
          Shorten Your Links
        </h1>
        <p className="text-xl text-center mb-12 text-gray-600 dark:text-gray-300">
          Create short, powerful links to boost your brand and track performance
        </p>
        <UrlShortenerForm />
      </div>
    </div>
  )
}