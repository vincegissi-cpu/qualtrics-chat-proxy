import OpenAI from "openai";

export default async function handler(req, res) {

  // 🔹 CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 🔹 Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { prompt, history, model, temperature, max_tokens } = req.body;

    const messages = [
      { role: "system", content: prompt },
      ...(history || []),
    ];

    const response = await openai.chat.completions.create({
      model: model || "gpt-4o-mini",
      messages,
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 500,
    });

    res.status(200).json({
      reply: response.choices[0].message.content,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
