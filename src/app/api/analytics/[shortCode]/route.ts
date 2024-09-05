import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Url from "@/models/Url";
import QRCode from "qrcode";

export async function GET(
  request: Request,
  { params }: { params: { shortCode: string } }
) {
  const { shortCode } = params;

  try {
    await connectToDatabase();
    const url = await Url.findOne({ shortCode });

    if (!url) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    const qrCode = await QRCode.toDataURL(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`
    );

    const analytics = {
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      customBackHalf: url.customBackHalf,
      totalClicks: url.clicks,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
      clickData: url.clickData || [],
      qrCode,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
