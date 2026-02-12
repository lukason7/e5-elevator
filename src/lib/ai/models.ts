// AI Model Abstraction Layer
// Supports Google Gemini, OpenAI, and Anthropic
// Each provider has its own implementation but a unified interface

export interface AIModel {
  id: string;
  provider: "google" | "openai" | "anthropic";
  model: string;
  displayName: string;
  costPerInputToken: number; // in USD
  costPerOutputToken: number; // in USD
}

export interface AIRequest {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  text: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUSD: number;
  durationMs: number;
}

// Available models — easily add or swap
export const MODELS: Record<string, AIModel> = {
  "gemini-flash": {
    id: "gemini-flash",
    provider: "google",
    model: "gemini-2.0-flash",
    displayName: "Gemini 2.0 Flash",
    costPerInputToken: 0.0000001, // $0.10 per 1M input
    costPerOutputToken: 0.0000004, // $0.40 per 1M output
  },
  "gpt-4o-mini": {
    id: "gpt-4o-mini",
    provider: "openai",
    model: "gpt-4o-mini",
    displayName: "GPT-4o Mini",
    costPerInputToken: 0.00000015, // $0.15 per 1M input
    costPerOutputToken: 0.0000006, // $0.60 per 1M output
  },
  "claude-haiku": {
    id: "claude-haiku",
    provider: "anthropic",
    model: "claude-3-5-haiku-latest",
    displayName: "Claude 3.5 Haiku",
    costPerInputToken: 0.0000008, // $0.80 per 1M input
    costPerOutputToken: 0.000004, // $4.00 per 1M output
  },
};

// Default model — change this to test different providers
const DEFAULT_MODEL_ID = "gemini-flash";

export function getDefaultModel(): AIModel {
  return MODELS[DEFAULT_MODEL_ID];
}

// Unified generate function
export async function generateText(
  request: AIRequest,
  modelId?: string
): Promise<AIResponse> {
  const model = MODELS[modelId || DEFAULT_MODEL_ID];
  if (!model) {
    throw new Error(`Unknown model: ${modelId}`);
  }

  const startTime = Date.now();

  switch (model.provider) {
    case "google":
      return callGemini(model, request, startTime);
    case "openai":
      return callOpenAI(model, request, startTime);
    case "anthropic":
      return callAnthropic(model, request, startTime);
    default:
      throw new Error(`Unknown provider: ${model.provider}`);
  }
}

// --- Google Gemini ---
async function callGemini(
  model: AIModel,
  request: AIRequest,
  startTime: number
): Promise<AIResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const contents = [];

  if (request.systemPrompt) {
    contents.push({
      role: "user",
      parts: [{ text: request.systemPrompt }],
    });
    contents.push({
      role: "model",
      parts: [{ text: "Understood. I will follow these instructions." }],
    });
  }

  contents.push({
    role: "user",
    parts: [{ text: request.prompt }],
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model.model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          maxOutputTokens: request.maxTokens || 4096,
          temperature: request.temperature ?? 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const inputTokens = data.usageMetadata?.promptTokenCount || 0;
  const outputTokens = data.usageMetadata?.candidatesTokenCount || 0;

  return {
    text,
    model: model.model,
    inputTokens,
    outputTokens,
    costUSD:
      inputTokens * model.costPerInputToken +
      outputTokens * model.costPerOutputToken,
    durationMs: Date.now() - startTime,
  };
}

// --- OpenAI ---
async function callOpenAI(
  model: AIModel,
  request: AIRequest,
  startTime: number
): Promise<AIResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const messages: { role: string; content: string }[] = [];

  if (request.systemPrompt) {
    messages.push({ role: "system", content: request.systemPrompt });
  }
  messages.push({ role: "user", content: request.prompt });

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model.model,
      messages,
      max_tokens: request.maxTokens || 4096,
      temperature: request.temperature ?? 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  const inputTokens = data.usage?.prompt_tokens || 0;
  const outputTokens = data.usage?.completion_tokens || 0;

  return {
    text,
    model: model.model,
    inputTokens,
    outputTokens,
    costUSD:
      inputTokens * model.costPerInputToken +
      outputTokens * model.costPerOutputToken,
    durationMs: Date.now() - startTime,
  };
}

// --- Anthropic ---
async function callAnthropic(
  model: AIModel,
  request: AIRequest,
  startTime: number
): Promise<AIResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const body: Record<string, unknown> = {
    model: model.model,
    max_tokens: request.maxTokens || 4096,
    temperature: request.temperature ?? 0.7,
    messages: [{ role: "user", content: request.prompt }],
  };

  if (request.systemPrompt) {
    body.system = request.systemPrompt;
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const text =
    data.content
      ?.filter((c: { type: string }) => c.type === "text")
      .map((c: { text: string }) => c.text)
      .join("") || "";
  const inputTokens = data.usage?.input_tokens || 0;
  const outputTokens = data.usage?.output_tokens || 0;

  return {
    text,
    model: model.model,
    inputTokens,
    outputTokens,
    costUSD:
      inputTokens * model.costPerInputToken +
      outputTokens * model.costPerOutputToken,
    durationMs: Date.now() - startTime,
  };
}
