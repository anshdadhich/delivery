import { NextResponse } from "next/server";
import { connectDB, SHIPMENTS_DELAYED_COLLECTION } from "@/lib/mongo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const search = searchParams.get("search") || "";
    const severity = searchParams.get("severity") || "all";

    const client = await connectDB();
    const db = client.db();
    const collection = db.collection(SHIPMENTS_DELAYED_COLLECTION);

    const query: any = {};
    if (search) {
      query.$or = [
        { DocketNo: { $regex: search, $options: "i" } },
        { CustomerName: { $regex: search, $options: "i" } },
        { logistics_email: { $regex: search, $options: "i" } },
        { DeliveryPartner: { $regex: search, $options: "i" } },
        { "From Location": { $regex: search, $options: "i" } },
        { "To Location": { $regex: search, $options: "i" } },
        { EDD: { $regex: search, $options: "i" } },
      ];
    }
    if (severity !== "all") query.severity = severity;

    const total = await collection.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const shipments = await collection
      .find(query, { projection: { _id: 0, threadId: 0 } }) 
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ CreatedAt: -1 })
      .toArray();

    return NextResponse.json({
      data: shipments,
      page,
      totalPages,
    });
  } catch (err: any) {
    console.error("❌ Fetch error (shipments):", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
