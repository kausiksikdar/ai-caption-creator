import { connectDB } from "@/lib/mongodb";
import Caption from "@/models/Caption";

export async function POST(req) {
    try {
        await connectDB();
        const { userId, prompt, caption, image } = await req.json();

        if (!userId) {
            return Response.json({ error: "User ID is required" }, { status: 400 });
        }
        if (!caption) {
            return Response.json({ error: "Caption is required" }, { status: 400 });
        }

        const newCaption = new Caption({
            userId,
            prompt: prompt || "Generated Caption",
            captions: caption, // Saving only the selected caption
            image: image || null, // Store image if provided
        });

        await newCaption.save();
        return Response.json({ message: "Caption saved successfully!" }, { status: 200 });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
