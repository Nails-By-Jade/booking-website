import { NextRequest, NextResponse } from "next/server";
import { createMessage, getAllMessages } from "@/lib/messages-store";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

// Public: visitors send a message from the Contact page.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Please fill in every field." },
        { status: 400 }
      );
    }

    const saved = await createMessage({
      name,
      email,
      message,
    });

    return NextResponse.json(
      { message: saved },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json(
      { error: "Unable to send your message. Please try again." },
      { status: 500 }
    );
  }
}

// Admin-only: read submitted messages.
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!verifySessionToken(token)) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      messages: await getAllMessages(),
    });
  } catch (error) {
    console.error("Messages API error:", error);

    return NextResponse.json(
      { error: "Unable to load messages." },
      { status: 500 }
    );
  }
}