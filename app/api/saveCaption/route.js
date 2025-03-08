import { connectDB } from "@/lib/mongodb";
import Caption from "@/models/Caption";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
    try {
        await connectDB();
        const { userId, prompt, caption, image } = await req.json();

        if (!userId || !caption) {
            return Response.json({ error: "User ID and Caption are required" }, { status: 400 });
        }

        let imageUrl = null;
        if (image) {
            // Upload to Cloudinary
            const uploadedImage = await cloudinary.uploader.upload(image, {
                folder: "captions", // Optional: Save in a folder named 'captions'
            });
            imageUrl = uploadedImage.secure_url;
        }

        await Caption.create({ userId, prompt, captions: caption, image: imageUrl });

        return Response.json({ message: "Caption saved successfully!" }, { status: 201 });

    } catch (error) {
        return Response.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}