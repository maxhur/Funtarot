import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req) {
  const { messages, body } = await req.json();
  const cards = body?.drawnCard ?? [];

  console.log("Received messages:", messages);
  // Stream a response from GPT-4o
  const result = streamText({
    model: openai("gpt-4o"),
    system:
      "You are a mystical tarot oracle. Explain symbols but give practical advice too.",
    messages,
  });

  // Return the Response object that Next.js expects
  return result.toDataStreamResponse();
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
// ///// this is what the original code looked like before the refactor
// export async function POST(req) {
//   const { question, cards = [], history = [] } = await req.json();

//   if (!question) {
//     return new Response(JSON.stringify({ error: "question required" }), {
//       status: 422,
//     });
//   }

//   const system = {
//     role: "system",
//     content:
//       "You are a mystical tarot oracle. Explain symbols but give practical advice too.",
//   };

//   const finalUserMsg = {
//     role: "user",
//     content: `${question}\n\nCards drawn: ${cards.join(", ")}`,
//   };

//   const stream = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     stream: true,
//     messages: [system, ...history, finalUserMsg],
//     temperature: 0.8,
//     max_tokens: 1500,
//   });

//   return new StreamingTextResponse(OpenAIStream(stream));
// }
///// this is what the original code looked like before the refactor
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// export default async function POST(req, res) {
//   const { action, question } = await req.json();

//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   console.log("FETCH READING CHAT GPT API HAS STARTED !!!!!!!!!!!!!!!!!!");
//   try {

//     console.log("this is what passes: ", question);

//     let tarotReadingResult;

//     if (action === "SimpleReading") {
//       tarotReadingResult = await openai.chat.completions.create({
//         model: "gpt-4o-mini",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You're a mystical tarot oracle with deep insights into the universe",
//           },
//           {
//             role: "user",
//             content: question,
//           },
//         ],
//         temperature: 0.8,
//         max_tokens: 1500,
//         top_p: 1,
//         frequency_penalty: 0,
//         presence_penalty: 0,
//       });

//       console.log(
//         "THIS IS A TAROT READING RESULT RESULT !!!!!! :",
//         tarotReadingResult.choices[0].message.content
//       );

//       return NextResponse.json(tarotReadingResult);
//     } else if (action === "StreamReading") {
//       try {
//         tarotReadingResult = await openai.chat.completions.create({
//           model: "gpt-4o-mini",
//           messages: [
//             {
//               role: "system",
//               content:
//                 "You're a mystical tarot oracle with deep insights into the universe.",
//             },
//             {
//               role: "user",
//               content: question,
//             },
//           ],
//           temperature: 0.7,
//           max_tokens: 2000,
//           top_p: 1,
//           frequency_penalty: 0,
//           presence_penalty: 0,
//           stream: true,
//         });

//         console.log(
//           "THIS IS A TAROT READING RESULT RESULT !! :",
//           tarotReadingResult
//         );

//         res.setHeader("Content-Type", "text/event-stream");
//         res.setHeader("Cache-Control", "no-cache, no-transform");
//         res.setHeader("Connection", "keep-alive");

//         for await (const chunk of tarotReadingResult) {
//           const content = chunk.choices[0]?.delta?.content || "";
//           if (content) {
//             res.write(`data: ${JSON.stringify(content)}\n\n`); // Send data in chunks
//           }
//         }

//         res.end();
//       } catch (error) {
//         console.error("Error fetching tarot reading:", error);
//         res.status(500).json({ error: "Failed to fetch tarot reading" });
//       }
//     }
//   } catch (error) {
//     console.error("Error processing request: ", error);
//     return new Response("An error occured.", { status: 500 });
//   }
// }
