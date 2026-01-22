import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

async function* streamGenerator(prompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const chat = model.startChat();

  const result = await chat.sendMessageStream(prompt);

  for await (const chunk of result.stream) {
    const chunkText = await chunk.text();
    yield chunkText;
  }
}

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const stream = streamGenerator(prompt);

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const value of stream) {
          controller.enqueue(new TextEncoder().encode(value));
        }
        controller.close();
      },
    }),
    {
      headers: { "Content-Type": "text/plain" },
    }
  );
}
