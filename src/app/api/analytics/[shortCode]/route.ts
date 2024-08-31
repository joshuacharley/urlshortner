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
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    const analytics = {
      totalClicks: urlDoc.clicks,
      clickData: urlDoc.clickData,
      createdAt: urlDoc.createdAt,
      expiresAt: urlDoc.expiresAt,
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
