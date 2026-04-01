import { mockGenerateLoose, mockGenerateStrict } from "@/lib/mockGenerate";

export type GenerateMode = "loose" | "strict";

export function generateRaw(notes: string, mode: GenerateMode = "loose"): string {
  const input = { notes, attempt: 1, mode };
  return mode === "strict" ? mockGenerateStrict(input) : mockGenerateLoose(input);
}
