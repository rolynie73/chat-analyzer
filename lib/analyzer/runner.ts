import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getModelById } from "@/lib/ai-models";

interface RunOptions {
  model: string;
  system: string;
  userMessage: string;
  apiKey: string;
}

export async function runAnalysis({ model, system, userMessage, apiKey }: RunOptions): Promise<string> {
  const modelDef = getModelById(model);
  if (!modelDef) throw new Error(`Modelo desconocido: ${model}`);

  if (modelDef.provider === "anthropic") {
    const client = new Anthropic({ apiKey });
    const res = await client.messages.create({
      model,
      max_tokens: 4096,
      system,
      messages: [{ role: "user", content: userMessage }],
    });
    return res.content[0].type === "text" ? res.content[0].text : "";
  }

  if (modelDef.provider === "openai") {
    const client = new OpenAI({ apiKey });
    const res = await client.chat.completions.create({
      model,
      max_tokens: 4096,
      temperature: 0.3,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userMessage },
      ],
    });
    return res.choices[0]?.message?.content ?? "";
  }

  if (modelDef.provider === "google") {
    const genAI = new GoogleGenerativeAI(apiKey);
    const gemModel = genAI.getGenerativeModel({ model, systemInstruction: system });
    const chat = gemModel.startChat({ generationConfig: { maxOutputTokens: 4096, temperature: 0.3 } });
    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  }

  throw new Error(`Proveedor no soportado: ${modelDef.provider}`);
}

export function parseJsonResponse(raw: string): { success: true; data: unknown } | { success: false; error: string } {
  let clean = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const fb = clean.indexOf("{");
  const lb = clean.lastIndexOf("}");
  if (fb !== -1 && lb !== -1) clean = clean.substring(fb, lb + 1);

  try {
    return { success: true, data: JSON.parse(clean) };
  } catch (e) {
    return { success: false, error: `JSON inválido: ${(e as Error).message}` };
  }
}
