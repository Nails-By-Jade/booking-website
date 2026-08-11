import { NextResponse } from "next/server";
import { getAllBlockedDates } from "@/lib/blocked-dates-store";

export async function GET() {
  const blockedDates = getAllBlockedDates().map((b) => ({
    date: b.date,
    reason: b.reason,
  }));
  return NextResponse.json({ blockedDates });
}