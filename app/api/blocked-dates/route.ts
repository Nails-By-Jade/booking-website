import { NextResponse } from "next/server";
import { getAllBlockedDates } from "@/lib/blocked-dates-store";

export async function GET() {
  const all = await getAllBlockedDates();
  const blockedDates = all.map((b) => ({
    date: b.date,
    reason: b.reason,
  }));
  return NextResponse.json({ blockedDates });
}