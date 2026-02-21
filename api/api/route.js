import OpenAI from "openai";

export async function POST(req) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await req.json();
    const { prompt, history, model, temperature, max_tokens } = body;

    const messages = [
      { role: "system", content: prompt },
      ...(history || [])
    ];

    const response = await openai.chat.completions.create({
      model: model || "gpt-4o-mini",
      messages,
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 500,
    });

    const text = response.choices[0].message.content;

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
