import { NextResponse } from "next/server";

export async function GET() {
  // In production, verify auth token and fetch from Firestore
  return NextResponse.json({ orders: [] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, items, total, paymentReference } = body;

    if (!userId || !items || !total || !paymentReference) {
      return NextResponse.json(
        { error: "Missing required fields: userId, items, total, paymentReference" },
        { status: 400 }
      );
    }

    const order = {
      id: `ORD_${Date.now()}`,
      userId,
      items,
      total,
      paymentReference,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // In production, save to Firestore via adminDb
    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
