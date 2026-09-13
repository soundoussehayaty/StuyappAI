import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));  // ADD THIS LINE

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate flashcards from text
app.post('/api/generate-flashcards', async (req, res) => {
  try {
    const { text, count = 5 } = req.body;
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Create ${count} flashcards from this text. Format as JSON array with "question" and "answer" fields:
    
    ${text}
    
    Return only valid JSON.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const flashcards = JSON.parse(response.text());
    
    res.json({ flashcards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate quiz questions
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { text, difficulty = 'medium' } = req.body;
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Create 5 ${difficulty} multiple choice questions from this text. Format as JSON with "question", "options" (array of 4), and "correct" (index) fields:
    
    ${text}
    
    Return only valid JSON.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const questions = JSON.parse(response.text());
    
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
