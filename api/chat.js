export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Méthode non autorisée" });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "Tu es Davbot, un assistant intelligent. Réponds clairement en français."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    // 🔥 extraction robuste (très important)
    let reply =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      data?.output_text ||
      "Désolé, je n’ai pas pu répondre correctement.";

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({
      reply: "Erreur serveur. Réessaie."
    });
  }
}
