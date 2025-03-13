import { connectDB } from "@/lib/mongodb";
import CommunityPost from "@/models/communityPost";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { userId, username, caption, imageUrl } = await req.json(); // Accept image URL

    const newPost = new CommunityPost({
      userId,
      username,
      caption,
      imageUrl,
    });

    await newPost.save();
    return NextResponse.json({ success: true, message: "Posted to community!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to post." }, { status: 500 });
  }
}
