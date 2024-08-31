"use client";

import { useState } from "react";
import Image from "next/image";

// types
interface Analytics {
  totalClicks: number;
  createdAt: string;
  expiresAt?: string;
  clickData: Array<{ timestamp: string; ipAddress: string; userAgent: string }>;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [customBackHalf, setCustomBackHalf] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setShortUrl("");
  //   setQrCode("");
  //   setAnalytics(null);

  //   try {
  //     const response = await fetch("/api/shorten", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ url, customBackHalf, expiresIn }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || "Failed to shorten URL");
  //     }

  //     const data = await response.json();
  //     setShortUrl(data.shortUrl);
  //     setQrCode(data.qrCode);
  //   } catch (err) {
  //     setError(
  //       err instanceof Error
  //         ? err.message
  //         : "An error occurred while shortening the URL"
  //     );
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setQrCode("");
    setAnalytics(null);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, customBackHalf, expiresIn }),
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

  const fetchAnalytics = async () => {
    if (!shortUrl) return;

    const shortCode = shortUrl.split("/").pop();
    try {
      const response = await fetch(`/api/analytics/${shortCode}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching analytics"
      );
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">URL Shortener</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to shorten"
          required
          className="w-full p-2 border rounded mb-2 bg-inherit"
        />
        <input
          type="text"
          value={customBackHalf}
          onChange={(e) => setCustomBackHalf(e.target.value)}
          placeholder="Custom back-half (optional)"
          className="w-full p-2 border rounded mb-2 bg-inherit"
        />
        <input
          type="number"
          value={expiresIn}
          onChange={(e) => setExpiresIn(e.target.value)}
          placeholder="Expires in (seconds, optional)"
          className="w-full p-2 border rounded mb-2 bg-inherit"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Shorten URL
        </button>
      </form>
      {shortUrl && (
        <div className="mt-4">
          <p>Shortened URL:</p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            {shortUrl}
          </a>
          {qrCode && (
            <div className="mt-4">
              <p>QR Code:</p>
              <Image src={qrCode} alt="QR Code" width={200} height={200} />
            </div>
          )}
          <button
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Fetch Analytics
          </button>
        </div>
      )}
      {analytics && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Analytics</h2>
          <p>Total Clicks: {analytics.totalClicks}</p>
          <p>Created At: {new Date(analytics.createdAt).toLocaleString()}</p>
          {analytics.expiresAt && (
            <p>Expires At: {new Date(analytics.expiresAt).toLocaleString()}</p>
          )}
          <h3 className="text-lg font-bold mt-2">Click Data:</h3>
          <ul>
            {analytics.clickData.map((click, index) => (
              <li key={index}>
                Time: {new Date(click.timestamp).toLocaleString()}, IP:{" "}
                {click.ipAddress}, User Agent: {click.userAgent}
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </main>
  );
}
