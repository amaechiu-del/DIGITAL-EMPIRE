import { NextResponse } from "next/server";
import { products } from "@/lib/products-data";

export async function GET() {
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // In production, verify admin token before allowing creation
    return NextResponse.json(
      { message: "Product creation requires admin privileges.", body },
      { status: 403 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
