import { connectDB } from "@/lib/mongodb";
import Caption from "@/models/Caption";

export async function GET(req) {
    try {
        await connectDB();

        const userId = req.nextUrl.searchParams.get("userId");
        if (!userId) return Response.json({ error: "User ID is required" }, { status: 400 });

        const userCaptions = await Caption.find({ userId }).sort({ createdAt: -1 });

        return Response.json({ captions: userCaptions }, { status: 200 });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
