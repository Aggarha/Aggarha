import { NextResponse } from "next/server";
import { runAIDashboard } from "@/lib/ai";

export async function GET() {
  const data = await runAIDashboard();
  return NextResponse.json({ status: "ok", data });
}
