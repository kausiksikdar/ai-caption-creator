import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import CommunityPost from "@/models/communityPost";
import { connectDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    await connectDB();
    const { postId, remove } = await req.json();

    // ✅ Find the post
    const post = await CommunityPost.findById(postId);
    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    // ✅ Toggle Boost
    if (remove) {
      post.boosts = Math.max(0, post.boosts - 1); // Ensure it doesn't go negative
    } else {
      post.boosts += 1;
    }

    await post.save();

    return NextResponse.json({ success: true, boosts: post.boosts }, { status: 200 });
  } catch (error) {
    console.error("Boost API Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
