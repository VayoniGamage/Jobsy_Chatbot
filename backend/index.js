import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
import pdfParse from 'pdf-parse';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/analyze', async (req, res) => {
  let text = req.body.text || '';
  const mode = req.body.mode || 'default';

  if (!text && req.files?.resume) {
    const data = await pdfParse(req.files.resume);
    text = data.text;
  }

  const prompt =
    mode === 'interview'
      ? `Pretend you're an HR interviewer. Ask 3 smart interview questions based on this resume:\n\n${text}`
      : `Analyze the resume below and respond with:\n1. Resume Feedback\n2. Role Suggestions\n3. 3 Sample Interview Questions\n4. Job Boards/Freelance Sites best suited for this person\n\nResume:\n${text}`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({ reply: completion.data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: 'Error contacting AI service' });
  }
});

app.listen(5000, () => console.log('✅ Backend running on http://localhost:5000'));