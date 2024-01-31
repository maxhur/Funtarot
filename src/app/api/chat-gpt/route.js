import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request) {
  const { question } = await request.json();

  console.log("this is what passes: ", question)

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model:"gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You're a mystical tarot oracle with deep insights into the universe",
      },
      {
        role: "user",
        content: question,
      }
    ],
    temperature: 0,
    max_tokens: 2000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  return NextResponse.json(response);
}
