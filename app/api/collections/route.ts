import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";

export async function GET() {
  try {
    const client = await connectDB();
    const db = client.db();
    const collections = await db.listCollections().toArray();
    const names = collections.map((c: any) => c.name);

    return NextResponse.json(names);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 });
  }
}
