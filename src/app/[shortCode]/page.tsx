import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import Url from "@/models/Url";

export default async function ShortUrlRedirect({
  params,
}: {
  params: { shortCode: string };
}) {
  const { shortCode } = params;

  try {
    await connectToDatabase();
    const urlDoc = await Url.findOne({ shortCode });

    if (urlDoc) {
      return redirect(urlDoc.originalUrl);
    } else {
      return redirect("/"); // Redirect to home page if short code is not found
    }
  } catch (error) {
    console.error("Error redirecting:", error);
    return redirect("/"); // Redirect to home page on error
  }
}
