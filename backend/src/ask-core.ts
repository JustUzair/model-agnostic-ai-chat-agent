import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createChatModel } from "./lc-model";
import { AskResult, AskResultSchema } from "./schema";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";

export async function askStructured(query: String): Promise<AskResult> {
  const { model, provider } = createChatModel();

  // keeping instructions brief so that schema stays visible to the model

  const systemContent =
    "You are a concise assistant. Return only the requested JSON.";
  const userContent =
    "Summarize for a beginner:\n" +
    `${query}\n` +
    `Return fields: summary(short paragraph), confidence (0..1)`;

  const structured = model.withStructuredOutput(AskResultSchema);
  const result = await structured.invoke([
    { role: "system", content: systemContent },
    {
      role: "user",
      content: userContent,
    },
  ]);

  return result;
}
