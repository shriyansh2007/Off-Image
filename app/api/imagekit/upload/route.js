import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

const parseNumber = (value) => {
  if (value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export async function POST(req) {
    console.log("UPLOAD ROUTE HIT");
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const rawFileName = formData.get("fileName") || formData.get("projectTitle") || "upload";
    const width = parseNumber(formData.get("width"));
    const height = parseNumber(formData.get("height"));

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No valid file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedFileName = String(rawFileName)
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "_");

    const uploadResult = await imageKit.upload({
      file: buffer,
      fileName: `${Date.now()}-${sanitizedFileName}`,
      folder: "/projects",
      useUniqueFileName: true,
    });

    if (!uploadResult?.url) {
      throw new Error("ImageKit upload returned no URL");
    }

    return NextResponse.json(
      {
        originalImageUrl: uploadResult.url,
        thumbnailUrl: uploadResult.url,
        width: width ?? 0,
        height: height ?? 0,
      },
      { status: 200 }
    );
  } catch (error) {
    if(error.response) {
      console.error("ImageKit API error:", error.response.data);
    } 

    console.error("Image upload failed:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
