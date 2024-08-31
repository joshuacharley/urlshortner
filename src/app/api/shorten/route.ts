import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]";
import connectToDatabase from "@/lib/mongodb";
import Url from "@/models/Url";
import { nanoid } from "nanoid";
import QRCode from "qrcode";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { url, customBackHalf, expiresIn } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "Please provide a valid URL to shorten." },
        { status: 400 }
      );
    }

    let shortCode = customBackHalf || nanoid(8);

    if (customBackHalf) {
      const existingUrl = await Url.findOne({ customBackHalf });
      if (existingUrl) {
        return NextResponse.json(
          {
            error:
              "The custom back-half is already in use. Please choose a different one or leave it blank for an auto-generated code.",
          },
          { status: 400 }
        );
      }
    }

    let expiresAt = null;
    if (expiresIn) {
      const expiresInNum = parseInt(expiresIn);
      if (isNaN(expiresInNum) || expiresInNum <= 0) {
        return NextResponse.json(
          {
            error:
              "Please provide a valid positive number for the expiration time in seconds.",
          },
          { status: 400 }
        );
      }
      expiresAt = new Date(Date.now() + expiresInNum * 1000);
    }

    const newUrl = new Url({
      originalUrl: url,
      shortCode,
      customBackHalf: customBackHalf || null,
      expiresAt,
      userId: session.user.id,
    });
    await newUrl.save();

    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`;

    const qrCode = await QRCode.toDataURL(shortUrl);

    return NextResponse.json({ shortUrl, qrCode });
  } catch (error) {
    console.error("Error shortening URL:", error);
    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while processing your request. Please try again later.",
      },
      { status: 500 }
    );
  }
}
