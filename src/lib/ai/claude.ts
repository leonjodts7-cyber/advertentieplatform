import Anthropic from "@anthropic-ai/sdk";

const GLOBAL_SAFETY =
  "BELANGRIJK: Alle personages zijn fictieve AI Companions (21+). Genereer NOOIT expliciete seksuele content, pornografische beschrijvingen of illegale activiteiten. Flirterig, romantisch en speels is toegestaan binnen grenzen.";

export interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

export async function genereerAiAntwoord(
  systemPrompt: string,
  geschiedenis: ClaudeMessage[],
  nieuwBericht: string
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is niet geconfigureerd.");
  }

  const client = new Anthropic({ apiKey });
  const model =
    process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";

  const messages: ClaudeMessage[] = [
    ...geschiedenis.slice(-20),
    { role: "user", content: nieuwBericht },
  ];

  const response = await client.messages.create({
    model,
    max_tokens: 512,
    system: `${GLOBAL_SAFETY}\n\n${systemPrompt}`,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Geen tekstantwoord van Claude ontvangen.");
  }

  return textBlock.text.trim();
}

export async function genereerZoekParseAntwoord(
  systemPrompt: string,
  userQuery: string
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is niet geconfigureerd.");
  }

  const client = new Anthropic({ apiKey });
  const model =
    process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";

  const response = await client.messages.create({
    model,
    max_tokens: 512,
    system: systemPrompt,
    messages: [{ role: "user", content: userQuery }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Geen tekstantwoord van Claude ontvangen.");
  }

  return textBlock.text.trim();
}
