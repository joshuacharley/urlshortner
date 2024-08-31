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
    const urlDoc = await Url.findOneAndUpdate(
      { $or: [{ shortCode }, { customBackHalf: shortCode }] },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (urlDoc) {
      return NextResponse.redirect(urlDoc.originalUrl);
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.error("Error redirecting:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
