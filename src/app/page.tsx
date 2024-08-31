"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [url, setUrl] = useState("");
  const [customBackHalf, setCustomBackHalf] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setQrCode("");

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, customBackHalf }),
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
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </main>
  );
}
