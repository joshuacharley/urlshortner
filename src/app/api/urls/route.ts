import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Url from "@/models/Url";

export async function GET() {
  try {
    await connectToDatabase();
    const urls = await Url.find().sort({ createdAt: -1 });
    return NextResponse.json(urls);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
