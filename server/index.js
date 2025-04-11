const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
     messages: [
    { role: "system", content: "You are a digital marketing expert that writes catchy and effective social media ads." },
    { role: "user", content: "Generate a Facebook ad for a meal delivery service targeting busy professionals." }
  ],
      temperature: 0.7,
      max_tokens: 500
    });

    const content = completion.choices[0].message.content;
    
    // Parse the JSON response
    try {
      const adContent = JSON.parse(content);
      res.json(adContent);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      res.status(500).json({ error: 'Failed to parse ad content' });
    }
  } catch (error) {
    console.error('Error generating ad content:', error);
    res.status(500).json({ error: error.message || 'Failed to generate ad content' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
