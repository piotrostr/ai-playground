import OpenAI from "openai";
import { dumpJSON } from "./util";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

async function generateCompletions(openai: OpenAI) {
  const stream = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [
      {
        role: "user",
        content: "Hello, I'm a human",
      },
    ],
    stream: true,
  });
  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}

async function main() {
  const openai = new OpenAI();

  dumpJSON(await openai.models.list());

  const res = await openai.images.generate({
    size: "1024x1024",
    style: "natural", // or "vivid"
    prompt: "This is a test, generate a black square for me",
    model: "dall-e-3",
    n: 1,
  });

  console.log(res);
}

main();
