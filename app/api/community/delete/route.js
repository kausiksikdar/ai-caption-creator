import { connectDB } from "@/lib/mongodb";
import CommunityPost from "@/models/communityPost";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await connectDB();
    const { postId, userId } = await req.json();

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found." }, { status: 404 });
    }

    if (post.userId !== userId) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    await CommunityPost.findByIdAndDelete(postId);
    return NextResponse.json({ success: true, message: "Post deleted!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete post." }, { status: 500 });
  }
}
