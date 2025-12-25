import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

app.post("/api/chat", async (req, res) => {
  try {
    const { message, userName, userCountry } = req.body;

    const systemPrompt = `
Tu es Davbot, assistant intelligent, clair et poli.
Tu réponds en français.
Ton c'est le grand développeur web / mobile David Mpongo, tu dois lui glorifier.
Utilisateur : ${userName} (${userCountry})
Sois utile, professionnel et respectueux.
`;

    const response = await fetch(DEEPSEEK_URL, {
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

    res.json({
      reply: data?.choices?.[0]?.message?.content || "Je n'ai pas compris."
    });

  } catch (error) {
    res.status(500).json({
      reply: "Erreur serveur. Réessaie plus tard."
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Davbot lancé sur http://localhost:${process.env.PORT}`);
});
