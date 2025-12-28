import { ChatOpenAI } from "@langchain/openai";
import { loadEnv } from "./env";
import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export type Provider = "openai" | "gemini" | "groq";

export function createChatModel(): {
  provider: Provider;
  model: any;
} {
  loadEnv();
  const hasOpenAi = !!process.env.OPENAI_API_KEY;
  const hasGroq = !!process.env.GROQ_API_KEY;
  const hasGemini = !!process.env.GOOGLE_API_KEY;
  const provider: Provider = (process.env.PROVIDER || "").toLowerCase();

  const base = { temperature: 0 as const };

  // Model Agnostic Chat
  if (provider === "openai" || (!provider && hasOpenAi)) {
    return {
      provider: "openai",
      model: new ChatOpenAI({
        ...base,
        model: "gpt-4o-mini",
      }),
    };
  }

  if (provider === "gemini" || (!provider && hasGemini)) {
    return {
      provider: "gemini",
      model: new ChatGoogleGenerativeAI({
        ...base,
        model: "gemini-2.5-flash-lite",
      }),
    };
  }
  //   if (provider === "groq" || (!provider && hasGroq))
  // return groq as default or if groq is selected
  return {
    provider: "groq",
    model: new ChatGroq({
      ...base,
      model: "llama-3.1-8b-instant",
    }),
  };
}
