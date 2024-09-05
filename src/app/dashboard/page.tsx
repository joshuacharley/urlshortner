"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Url {
  _id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
}

export default function Dashboard() {
  const [urls, setUrls] = useState<Url[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserUrls();
  }, []);

  const fetchUserUrls = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/urls");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUrls(data);
    } catch (err) {
      console.error("Error fetching URLs:", err);
      setError("Failed to load URLs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchUserUrls}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Shortened URLs</h1>
      {urls.length === 0 ? (
        <p>No shortened URLs found. Create one to get started!</p>
      ) : (
        <ul className="space-y-4">
          {urls.map((url) => (
            <li key={url._id} className="bg-inherit shadow rounded-lg p-4">
              <p className="font-semibold">{url.originalUrl}</p>
              <p className="text-blue-500">
                <Link
                  href={`/${url.shortCode}`}
                >{`${process.env.NEXT_PUBLIC_BASE_URL}/${url.shortCode}`}</Link>
              </p>
              <p className="text-sm bg-inherit text-white-500">
                Clicks: {url.clicks}
              </p>
              <Link
                href={`/analytics/${url.shortCode}`}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block"
              >
                View Analytics
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link
        href="/"
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 inline-block"
      >
        Create New Short URL
      </Link>
    </div>
  );
}
