import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Url from "@/models/urlSchema";

export async function GET(
  req: Request,
  { params }: { params: { shortCode: string } }
) {
  try {
    await connectToDatabase();
    const { shortCode } = params;

    const urlDoc = await Url.findOne({ shortCode });

    if (!urlDoc) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    return NextResponse.redirect(urlDoc.originalUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
