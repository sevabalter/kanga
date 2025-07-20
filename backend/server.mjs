/*  server.mjs  – Simple subtraction question generator with debugging */

import express from 'express';
import cors    from 'cors';
import dotenv  from 'dotenv';
import OpenAI  from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI client with debugging
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1'
});

// Debug middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`\n${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  if (req.method === 'POST') {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

app.use(cors());
app.use(express.json());

// Test endpoint to verify OpenAI connection
app.get('/api/test', async (req, res) => {
  try {
    console.log('Testing OpenAI connection...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Say hello" }],
      temperature: 0
    });
    
    console.log('OpenAI response:', completion.choices[0].message.content);
    res.json({
      message: 'API is working!',
      openaiResponse: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('OpenAI test error:', error);
    res.status(500).json({ 
      error: error.message, 
      details: error.response?.data 
    });
  }
});



/* ---------- Generate subtraction question --------------------- */
app.get('/api/question', async (req, res) => {
  try {
    const prompt = {
      topic: "basic subtraction",
      role: "You are a friendly and patient math tutor helping a 6-year-old child learn subtraction. Keep the tone encouraging and age-appropriate.",
      prompt: "Generate one subtraction problem using numbers between 1 and 10.\n\n📌 Respond in this exact format:\nLine 1: The question\nLine 2: The correct answer\n\n✏️ Example:\nWhat is 7 - 3?\n4"
    };

    console.log('Sending request to OpenAI API...');
    console.log('System message:', prompt.role);
    console.log('User message:', prompt.prompt);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 100,
      messages: [
        { role: 'system', content: prompt.role },
        { role: 'user', content: prompt.prompt }
      ]
    });

    console.log('OpenAI response received');
    console.log('Response content:', completion.choices[0].message.content);

    const response = completion.choices[0].message.content;
    const lines = response.split('\n');
    
    if (lines.length !== 2) {
      return res.status(500).json({ error: 'Invalid response format from OpenAI' });
    }

    res.json({
      question: lines[0].trim(),
      answer: lines[1].trim(),
      debug: {
        timestamp: new Date().toISOString(),
        apiCallSuccessful: true,
        responseFormat: 'question\nanswer'
      }
    });
  } catch (err) {
    console.error('Error generating question:', err);
    console.error('Error details:', err.response?.data);
    res.status(500).json({ 
      error: err.message, 
      debug: {
        timestamp: new Date().toISOString(),
        apiCallSuccessful: false,
        errorType: err.name,
        errorDetails: err.response?.data
      }
    });
  }
});

app.post('/api/answer', async (req, res, next) => {
  try {
    const { question, answer } = req.body;

    const messages = [
      { 
        role: 'system', 
        content: 'You are a math tutor. Please calculate the answer to the question first. Determine if the user answer to the math problem is correct or wrong based on your answer. Return only one word: Correct or Wrong. Do not explain or include any other text.' 
      },
      { 
        role: 'user',
        content: `Question: ${question}\nUser's Answer: ${answer}`
      }
    ];


    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      messages
    });

    const responseText = completion.choices[0].message.content.trim();

    res.send(responseText);
  } catch (err) {
    console.error('❌ Validation error:', err);
    next(err);
  }
});

/* ---------- start -------------------------------------------- */
app.listen(PORT, () => {
  console.log(`🚀  Listening on http://localhost:${PORT}`);
  console.log(`🔑  OpenAI key present: ${!!process.env.OPENAI_API_KEY}`);
});
