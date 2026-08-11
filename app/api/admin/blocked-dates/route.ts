import { NextRequest, NextResponse } from "next/server";
import { addBlockedDates, getAllBlockedDates } from "@/lib/blocked-dates-store";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ blockedDates: await getAllBlockedDates() });
}

export async function POST(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const { dates, reason } = body as { dates?: string[]; reason?: string };

  if (!Array.isArray(dates) || dates.length === 0) {
    return NextResponse.json({ error: "Pick at least one date." }, { status: 400 });
  }
  if (!reason || !reason.trim()) {
    return NextResponse.json({ error: "Add a short reason." }, { status: 400 });
  }

  const blockedDates = await addBlockedDates(dates, reason.trim());
  return NextResponse.json({ blockedDates }, { status: 201 });
}