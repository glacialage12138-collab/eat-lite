export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const token = process.env.AI_API_KEY || process.env.GITHUB_TOKEN || process.env.OPENAI_API_KEY;
  const baseUrl = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.AI_MODEL || "gpt-4.1-mini";

  if (!token) {
    response.status(500).json({ error: "Missing AI_API_KEY" });
    return;
  }

  const { image } = request.body || {};
  if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
    response.status(400).json({ error: "Missing image data URL" });
    return;
  }

  const aiResponse = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "你是营养记录助手。根据食物照片估算食物名称和热量。只能返回 JSON：{\"food\":\"名称\",\"kcal\":数字,\"note\":\"一句中文说明\"}。热量要保守估算，并提醒仅供参考。",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "请估算图片中可食用主体的卡路里。" },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
    }),
  });

  if (!aiResponse.ok) {
    const detail = await aiResponse.text();
    response.status(aiResponse.status).json({ error: "AI request failed", detail });
    return;
  }

  const data = await aiResponse.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = {};
  }

  response.status(200).json({
    food: String(parsed.food || "拍摄食物"),
    kcal: Number(parsed.kcal || 0),
    note: String(parsed.note || "AI 估算，仅供参考。"),
  });
}
