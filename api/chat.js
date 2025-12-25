export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const DEEPSEEK_API_KEY = "sk-cd57441b19fb4c52877c21b6607ea5bb"; // ⚠️ clé en clair

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "Tu es Davbot, assistant poli et clair." },
          { role: "user", content: req.body.message }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });

  } catch (err) {
    res.status(500).json({ error: "Erreur DeepSeek" });
  }
}
