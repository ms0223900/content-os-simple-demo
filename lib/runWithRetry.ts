import { parseJsonSafely } from "@/lib/extractJson";
import { mockGenerateLoose, mockGenerateStrict } from "@/lib/mockGenerate";
import { validateContentPack } from "@/lib/validator";
import type { AttemptLog, ContentPack } from "@/types/contentPack";

export interface RunWithRetryParams {
  notes: string;
  maxAttempts?: number;
  generator?: (input: { notes: string; attempt: number; mode: "loose" | "strict" }) => string | Promise<string>;
}

type RunSuccess = { ok: true; content: ContentPack; attempts: AttemptLog[] };
type RunFailure = { ok: false; attempts: AttemptLog[]; lastRaw?: string };

function defaultGenerator(input: { notes: string; attempt: number; mode: "loose" | "strict" }): string {
  return input.mode === "strict" ? mockGenerateStrict(input) : mockGenerateLoose(input);
}

export async function runWithRetry(params: RunWithRetryParams): Promise<RunSuccess | RunFailure> {
  const maxAttempts = params.maxAttempts ?? 5;
  const attempts: AttemptLog[] = [];
  let lastRaw: string | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const mode: "loose" | "strict" = attempt <= 2 ? "loose" : "strict";
    const generate = params.generator ?? defaultGenerator;

    try {
      const raw = await generate({ notes: params.notes, attempt, mode });
      lastRaw = raw;

      const parsed = parseJsonSafely(raw);
      if (!parsed.ok) {
        attempts.push({
          attempt,
          ok: false,
          errorType: parsed.errorType,
          message: parsed.message,
        });
        continue;
      }

      const validated = validateContentPack(parsed.data);
      if (!validated.ok) {
        attempts.push({
          attempt,
          ok: false,
          errorType: validated.errorType,
          message: validated.message,
        });
        continue;
      }

      attempts.push({ attempt, ok: true });
      return { ok: true, content: validated.data, attempts };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown generation error";
      attempts.push({
        attempt,
        ok: false,
        errorType: "UnknownError",
        message,
      });
    }
  }

  return { ok: false, attempts, lastRaw };
}
