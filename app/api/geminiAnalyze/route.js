import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { caption } = await req.json();

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Analyze this caption and provide sentiment score (0-100), engagement prediction (0-100), and relevance score (0-100): ${caption}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const rawData = await geminiResponse.text();

    const data = JSON.parse(rawData); // Parse raw response

    // Extract the response text
    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract numerical scores using regex
    const scores = responseText.match(/\d+/g) || [0, 0, 0];

    return NextResponse.json({
      sentimentScore: Number(scores[0]),
      engagementScore: Number(scores[1]),
      relevanceScore: Number(scores[2]),
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to fetch AI insights" }, { status: 500 });
  }
}
