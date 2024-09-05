"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface ClickData {
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

interface Analytics {
  originalUrl: string;
  shortCode: string;
  customBackHalf: string | null;
  totalClicks: number;
  createdAt: string;
  expiresAt?: string;
  clickData: ClickData[];
  qrCode: string;
}

export default function AnalyticsPage({
  params,
}: {
  params: { shortCode: string };
}) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics/${params.shortCode}`);
        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setError("Failed to load analytics. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [params.shortCode]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
    );
  }

  if (!analytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        No analytics data found.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/dashboard"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        &larr; Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-4">
        Analytics for /{params.shortCode}
      </h1>
      <div className="bg-inherit shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">URL Details</h2>
        <p>
          <strong>Original URL:</strong>{" "}
          <a
            href={analytics.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {analytics.originalUrl}
          </a>
        </p>
        <p>
          <strong>Short URL:</strong>{" "}
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/${analytics.shortCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >{`${process.env.NEXT_PUBLIC_BASE_URL}/${analytics.shortCode}`}</a>
        </p>
        {analytics.customBackHalf && (
          <p>
            <strong>Custom Back-Half:</strong> {analytics.customBackHalf}
          </p>
        )}
        <p>
          <strong>Total Clicks:</strong> {analytics.totalClicks}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(analytics.createdAt).toLocaleString()}
        </p>
        {analytics.expiresAt && (
          <p>
            <strong>Expires At:</strong>{" "}
            {new Date(analytics.expiresAt).toLocaleString()}
          </p>
        )}
      </div>

      <div className="bg-inherit shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">QR Code</h2>
        <Image
          src={analytics.qrCode}
          alt="QR Code"
          width={200}
          height={200}
          className="mx-auto"
        />
      </div>

      <div className="bg-inherit shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Click Data</h2>
        {analytics.clickData.length > 0 ? (
          <ul className="space-y-4">
            {analytics.clickData.map((click, index) => (
              <li key={index} className="border-b pb-2">
                <p>
                  <strong>Time:</strong>{" "}
                  {new Date(click.timestamp).toLocaleString()}
                </p>
                <p>
                  <strong>IP Address:</strong> {click.ipAddress}
                </p>
                <p>
                  <strong>User Agent:</strong> {click.userAgent}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No click data available.</p>
        )}
      </div>
    </div>
  );
}
