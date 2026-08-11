import { NextRequest, NextResponse } from "next/server";
import { createMessage, getAllMessages } from "@/lib/messages-store";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

// Public: visitors send a message from the Contact page.
export async function POST(request: NextRequest) {
  const { name, email, message } = await request.json();
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please fill in every field." },
      { status: 400 }
    );
  }

  const saved = createMessage({ name, email, message });
  return NextResponse.json({ message: saved }, { status: 201 });
}

// Admin-only: read submitted messages.
export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json({ messages: getAllMessages() });
}
