import { connectDB } from "@/lib/mongodb";

export async function POST(req) {
    try {
        await connectDB();

        const formData = await req.formData();

        const prompt = formData.get("prompt");
        const tone = formData.get("tone") || "funny";
        const language = formData.get("language") || "en";
        const no = formData.get("no") || 5;
        const reason = formData.get("reason") || "general";
        const imageFile = formData.get("image");

        if (!prompt && (!imageFile || !(imageFile instanceof Blob))) {
            return Response.json({ error: "Provide at least a prompt or an image" }, { status: 400 });
        }

        let apiRequestBody = { contents: [{ parts: [] }] };

        if (imageFile && imageFile instanceof Blob) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const base64Image = buffer.toString("base64");

            apiRequestBody.contents[0].parts.push({
                inline_data: { mime_type: imageFile.type, data: base64Image },
            });
        }

        if (prompt && imageFile) {
            apiRequestBody.contents[0].parts.push({
                text: `Generate ${no} captions in ${language} with a ${tone} tone for ${reason}, combining the provided image and this prompt: "${prompt}" with some trendy hashtags.`,
            });
        } else if (prompt) {
            apiRequestBody.contents[0].parts.push({
                text: `Generate ${no} captions in ${language} with a ${tone} tone for ${reason} based on: "${prompt}" with some trendy hashtags.`,
            });
        } else {
            apiRequestBody.contents[0].parts.push({
                text: `Generate ${no} captions in ${language} with a ${tone} tone for ${reason} based on the provided image with some trendy hashtags.`,
            });
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001-tuning:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(apiRequestBody),
        });

        const data = await response.json();

        if (data.error) {
            return Response.json({ error: data.error.message }, { status: 500 });
        }

        const captions = data.candidates?.[0]?.content?.parts?.[0]?.text
            .split("\n")
            .map(c => c.trim())
            .filter(Boolean);

        return Response.json({ captions }, { status: 200 });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
