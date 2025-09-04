import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const collectionName = searchParams.get("collection");

    if (!collectionName) {
      return NextResponse.json({ error: "Missing collection name" }, { status: 400 });
    }

    const client = await connectDB();
    const db = client.db();
    const data = await db.collection(collectionName).find({}).toArray();

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

