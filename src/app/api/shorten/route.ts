import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Url from "@/models/Url";
import { nanoid } from "nanoid";
import QRCode from "qrcode";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { url, customBackHalf } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let shortCode = customBackHalf || nanoid(8);

    if (customBackHalf) {
      const existingUrl = await Url.findOne({ customBackHalf });
      if (existingUrl) {
        return NextResponse.json(
          { error: "Custom back-half already in use" },
          { status: 400 }
        );
      }
    }

    const newUrl = new Url({ originalUrl: url, shortCode, customBackHalf });
    await newUrl.save();

    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/redirect/${shortCode}`;

    const qrCode = await QRCode.toDataURL(shortUrl);

    return NextResponse.json({ shortUrl, qrCode });
  } catch (error) {
    console.error("Error shortening URL:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
