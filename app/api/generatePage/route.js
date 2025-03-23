export async function POST(req) {
    try {
        const { prompt, tone, language } = await req.json();
        if (!prompt) {
            return Response.json({ error: "Prompt is required" }, { status: 400 });
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001-tuning:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `You are a trained caption generator for social media, Generate 10 short and engaging captions with a ${tone} tone for: ${prompt} in ${language}. 
                        Each caption must include trendy hashtags and emojis.` }] }]
            })
        });

        const data = await response.json();
        if (data.error) {
            return Response.json({ error: data.error.message }, { status: 500 });
        }

        const caption = data.candidates?.[0]?.content?.parts?.[0]?.text || "No caption generated";
        return Response.json({ caption }, { status: 200 });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}