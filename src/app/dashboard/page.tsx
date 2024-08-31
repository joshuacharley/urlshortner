"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

// Add this interface
interface Url {
  _id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [urls, setUrls] = useState<Url[]>([]);

  useEffect(() => {
    if (session) {
      fetchUserUrls();
    }
  }, [session]);

  const fetchUserUrls = async () => {
    const response = await fetch("/api/urls");
    const data = await response.json();
    setUrls(data);
  };

  if (!session) {
    return <p>Access Denied</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Shortened URLs</h1>
      <ul className="space-y-4">
        {urls.map((url) => (
          <li key={url._id} className="bg-white shadow rounded-lg p-4">
            <p className="font-semibold">{url.originalUrl}</p>
            <p className="text-blue-500">
              <Link
                href={`/${url.shortCode}`}
              >{`${process.env.NEXT_PUBLIC_BASE_URL}/${url.shortCode}`}</Link>
            </p>
            <p className="text-sm text-gray-500">Clicks: {url.clicks}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
