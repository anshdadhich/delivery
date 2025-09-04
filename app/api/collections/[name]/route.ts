// app/api/collections/[name]/route.ts
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ai-logistics";
const client = new MongoClient(uri);

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection(params.name);

    const data = await collection.find({}).limit(100).toArray();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
