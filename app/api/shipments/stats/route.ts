import { NextResponse } from "next/server";
import { connectDB, SHIPMENTS_DELAYED_COLLECTION } from "@/lib/mongo";

export async function GET() {
  try {
    const client = await connectDB();
    const db = client.db();
    const collection = db.collection(SHIPMENTS_DELAYED_COLLECTION);

    const shipments = await collection.find({}).toArray();
    const total = shipments.length;

    const severityCounts = {
      low: shipments.filter((s) => s.severity === "low").length,
      medium: shipments.filter((s) => s.severity === "medium").length,
      high: shipments.filter((s) => s.severity === "high").length,
    };

    const avgDelay =
      total > 0
        ? (
            shipments.reduce(
              (sum, s) => sum + (parseInt(s.delay) || 0),
              0
            ) / total
          ).toFixed(2)
        : 0;

    const delayedShipments = shipments.filter((s) => {
      if (!s.EDD) return false;
      const eddDate = new Date(s.EDD);
      return eddDate < new Date();
    }).length;

    return NextResponse.json({
      total,
      severityCounts,
      avgDelay,
      delayedShipments,
    });
  } catch (err: any) {
    console.error("❌ Fetch error (stats):", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
