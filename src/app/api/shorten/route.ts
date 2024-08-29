import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Url from "@/models/urlSchema";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const shortCode = nanoid(8); // Generate a short code
    const newUrl = new Url({ originalUrl: url, shortCode });
    await newUrl.save();

    return NextResponse.json({
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`,
    });
  } catch (error) {
    console.error("Error shortening URL:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
