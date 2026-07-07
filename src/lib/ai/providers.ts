import { env } from "@/lib/env";
import type { AIProvider } from "@/lib/ai/types";

export interface LLMService {
  provider: AIProvider;
  complete(prompt: string): Promise<string>;
  embed(input: string[]): Promise<number[][]>;
}

class PlaceholderLLMService implements LLMService {
  provider: AIProvider;

  constructor(provider: AIProvider) {
    this.provider = provider;
  }

  async complete(prompt: string): Promise<string> {
    return `placeholder:${this.provider}:${prompt.slice(0, 120)}`;
  }

  async embed(input: string[]): Promise<number[][]> {
    return input.map((value) =>
      Array.from({ length: 8 }, (_, index) => ((value.length + index) % 10) / 10)
    );
  }
}

const providerFromEnv = (): AIProvider => {
  const configured = process.env.AI_PROVIDER?.toUpperCase();
  if (configured === "OPENAI" || configured === "GEMINI" || configured === "CLAUDE" || configured === "OLLAMA") {
    return configured;
  }

  if (env.NODE_ENV === "production") {
    return "LOCAL";
  }

  return "LOCAL";
};

export function getLLMService(): LLMService {
  return new PlaceholderLLMService(providerFromEnv());
}
