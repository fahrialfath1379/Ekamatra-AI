const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Endpoint Chat yang Menghubungkan ke Groq AI
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    const GROQ_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_KEY) {
        return res.status(500).json({ reply: "API Key Groq belum dipasang di Render!" });
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: message }]
            })
        });

        const data = await response.json();
        const botReply = data.choices[0]?.message?.content || "Tidak ada respon dari AI.";
        res.json({ reply: botReply });
    } catch (error) {
        res.status(500).json({ reply: "Terjadi kesalahan pada server AI." });
    }
});

// Jalankan Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
