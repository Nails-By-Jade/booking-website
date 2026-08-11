import { NextRequest, NextResponse } from "next/server";
import { getBlockedSlots } from "@/lib/bookings-store";
import { getServiceBySlug } from "@/lib/services";

// Public endpoint used by the booking page to grey out taken slots.
// Deliberately returns only times, never names/emails/phones — the full
// booking list at /api/bookings is admin-only.
export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  const serviceSlug = request.nextUrl.searchParams.get("service");
  if (!date) {
    return NextResponse.json({ error: "Missing date." }, { status: 400 });
  }

  const duration = serviceSlug ? getServiceBySlug(serviceSlug)?.duration ?? 60 : 60;
  const takenSlots = getBlockedSlots(date, duration);

  return NextResponse.json({ takenSlots });
}
