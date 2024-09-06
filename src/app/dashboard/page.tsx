"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

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
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchUserUrls();
    }
  }, [user]);

  const fetchUserUrls = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/urls");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      const data = await response.json();
      setUrls(data);
    } catch (err) {
      console.error("Error fetching URLs:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
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
      <h1 className="text-2xl font-bold mb-4">Your Shortened URLs</h1>
      {urls.length === 0 ? (
        <p>No shortened URLs found. Create one to get started!</p>
      ) : (
        <ul className="space-y-4 mb-8">
          {urls.map((url) => (
            <li key={url._id} className="bg-white shadow rounded-lg p-4">
              <p className="font-semibold">{url.originalUrl}</p>
              <p className="text-blue-500">
                <Link
                  href={`/${url.shortCode}`}
                >{`${process.env.NEXT_PUBLIC_BASE_URL}/${url.shortCode}`}</Link>
              </p>
              <p className="text-sm text-gray-500">Clicks: {url.clicks}</p>
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
      <div className="flex justify-between items-center mt-8">
        <Link
          href="/"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 inline-block"
        >
          Home
        </Link>
        <Link
          href="/"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 inline-block"
        >
          Create New Short URL
        </Link>
      </div>
    </div>
  );
}
