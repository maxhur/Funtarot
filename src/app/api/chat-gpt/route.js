import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request) {

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model:"gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You're very grumpy. Please answer my question with sarcasm, grumpiness, and anger",
      },
      {
        role: "user",
        content: "What's the greatest vdeo game of all time? How was it made?"
      }
    ],
    temperature: 0,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  return NextResponse.json(response);
}
