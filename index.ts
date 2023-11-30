import { Command } from "commander";
import OpenAI from "openai";

import { dumpJSON } from "./util";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

const quest = `{
        "title": "Job Description Content Writer",
        "description": "We are a growing immigration law firm that is looking to hire two candidates and we need an enticing job post created for both positions.\n\nOne post is for an experienced immigration paralegal in the south florida region.\n\nOne is for an experienced office admin person with extensive clerical skills in Fort Lauderdale.\n\nYou will need to research what the going compensation is in the south florida region.\n\nPlease let me know if this is something you would excel at! Thank you",
        "files": [],
        "contractDuration": "Short term",
        "jobTitle": "Content Writer",
        "workTypes": [],
        "skills": [],
        "timezones": [
            "UTC -12 Hours"
        ],
        "isYourTimezone": true,
        "hoursDifference": "2 Hours",
        "jobSize": "Small",
        "timeToComplete": "2 months",
        "toHire": "Yes",
        "billingMethod": "Project-based",
        "skillLevel": [
            3,
            6
        ]
    }
`;

async function generateSimilar(openai: OpenAI, quests: Array<string>) {
  const stream = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [
      {
        role: "user",
        content: `Generate a bunch of similar job descriptions based on examples below: \n\n${quests.toString()}`,
      },
    ],
    stream: true,
  });
  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}

async function generateImages(openai: OpenAI, quest: string) {
  const res = await openai.images.generate({
    size: "1024x1024",
    style: "vivid", // or "vivid"
    prompt: `Generate a thumbnail for this object: \n\n${quest}`,
    model: "dall-e-3",
    n: 1,
  });

  console.log(res);
}

const program = new Command();

program
  .version("0.0.1")
  .name("lancr-ai")
  .description("Lancr AI Generation stuff");

program.command("available-models").action(async () => {
  const openai = new OpenAI();
  const res = await openai.models.list();
  dumpJSON(res, "available-models.json");
  console.log(JSON.stringify(res, null, 2));
});

program.command("generate-similar").action(async () => {
  const openai = new OpenAI();
  await generateSimilar(openai, [quest]);
});

program.command("generate-images").action(async () => {
  const openai = new OpenAI();
  await generateImages(openai, quest);
});

program.parse();
