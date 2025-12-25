export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Méthode non autorisée" });
  }

  try {
    const { message, userName, userCountry } = req.body;

    const systemPrompt = `
Tu es Davbot, assistant intelligent, clair et poli.
Tu réponds en français.
Ton créateur c'est David Mpongo un développeur web et mobile.
Utilisateur : ${userName} (${userCountry})
Sois utile et respectueux.
`;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 900
      })
    });

    const data = await response.json();

    res.status(200).json({
      reply: data?.choices?.[0]?.message?.content || "Je n'ai pas compris."
    });

  } catch (error) {
    res.status(500).json({
      reply: "Erreur serveur."
    });
  }
           }
