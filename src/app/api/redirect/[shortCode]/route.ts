import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Url from "@/models/Url";

export async function GET(
  request: Request,
  { params }: { params: { shortCode: string } }
) {
  const { shortCode } = params;

  try {
    await connectToDatabase();
    const urlDoc = await Url.findOne({
      $or: [{ shortCode }, { customBackHalf: shortCode }],
    });

    if (!urlDoc) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Check if the link has expired
    if (urlDoc.expiresAt && new Date() > new Date(urlDoc.expiresAt)) {
      return NextResponse.redirect(
        new URL(`/expired/${shortCode}`, request.url)
      );
    }

    // Update click data
    const clickData = {
      timestamp: new Date(),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    };

    await Url.findByIdAndUpdate(urlDoc._id, {
      $inc: { clicks: 1 },
      $push: { clickData: clickData },
    });

    // Ensure the URL starts with http:// or https://
    let redirectUrl = urlDoc.originalUrl;
    if (
      !redirectUrl.startsWith("http://") &&
      !redirectUrl.startsWith("https://")
    ) {
      redirectUrl = "http://" + redirectUrl;
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
