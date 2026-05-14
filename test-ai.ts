import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: 'Hi'
    });
    console.log("Success:", res.text);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
