import { connectDB } from "@/lib/mongodb";
import CommunityPost from "@/models/communityPost";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const posts = await CommunityPost.find().sort({ createdAt: -1 }); // Latest posts first

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch posts." }, { status: 500 });
  }
}
