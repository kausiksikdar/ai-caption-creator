import { connectDB } from "@/lib/mongodb";
import Caption from "@/models/Caption";

export async function DELETE(req) {
    try {
        const { captionId, userId } = await req.json();

        if (!captionId || !userId) {
            return new Response(JSON.stringify({ error: "Caption ID and User ID are required" }), { status: 400 });
        }

        await connectDB();

        const deletedCaption = await Caption.findOneAndDelete({ _id: captionId, userId });

        if (!deletedCaption) {
            return new Response(JSON.stringify({ error: "Caption not found or unauthorized" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Caption deleted successfully" }), { status: 200 });
    } catch (error) {
        console.error("Delete Error:", error);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
