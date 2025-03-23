import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create guest session (use a predefined guest account)
    const session = await auth().createSession({
      identifier: "ahujarohit995@gmail.com", // Use a guest email in Clerk
      password: "kosec@123",
    });

    // Attach session token
    const response = NextResponse.json({ success: true });
    response.cookies.set("clerk_session", session.getToken(), { httpOnly: true });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Guest login failed" }, { status: 500 });
  }
}
