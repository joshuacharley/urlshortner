"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [url, setUrl] = useState("");
  const [customBackHalf, setCustomBackHalf] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setQrCode("");

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          customBackHalf: customBackHalf || undefined,
          expiresIn: expiresIn || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to shorten URL");
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
      setQrCode(data.qrCode);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while shortening the URL"
      );
    }
  };

  const handleViewAnalytics = () => {
    if (shortUrl) {
      const shortCode = shortUrl.split("/").pop();
      router.push(`/dashboard`);
    }
  };

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">URL Shortener</h1>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700"
          >
            URL to Shorten
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label
            htmlFor="customBackHalf"
            className="block text-sm font-medium text-gray-700"
          >
            Custom Back-Half (Optional)
          </label>
          <input
            id="customBackHalf"
            type="text"
            value={customBackHalf}
            onChange={(e) => setCustomBackHalf(e.target.value)}
            placeholder="my-custom-url"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label
            htmlFor="expiresIn"
            className="block text-sm font-medium text-gray-700"
          >
            Expires In (Seconds, Optional)
          </label>
          <input
            id="expiresIn"
            type="number"
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            placeholder="3600 (1 hour)"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Shorten URL
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {shortUrl && (
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <h2 className="text-xl font-semibold mb-2">Shortened URL</h2>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {shortUrl}
          </a>
          {qrCode && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">QR Code</h3>
              <Image
                src={qrCode}
                alt="QR Code"
                width={200}
                height={200}
                className="mx-auto"
              />
            </div>
          )}
          <button
            onClick={handleViewAnalytics}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            View Analytics
          </button>
        </div>
      )}
      <div className="text-center">
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          View All Shortened URLs
        </Link>
      </div>
    </main>
  );
}
