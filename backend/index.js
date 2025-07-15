import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      model: 'gpt-3.5-turbo',
    });
    res.json({ reply: chatCompletion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ reply: 'Error generating response from Jobsy.' });
  }
});

app.listen(5000, () => console.log('Jobsy backend running on port 5000'));