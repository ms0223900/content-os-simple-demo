"use client";

import { useState } from "react";

import AttemptLogs from "@/components/AttemptLogs";
import InputPanel from "@/components/InputPanel";
import ResultPanel from "@/components/ResultPanel";
import { parseJsonSafely } from "@/lib/extractJson";
import { runWithRetry } from "@/lib/runWithRetry";
import { validateContentPack } from "@/lib/validator";
import type { AttemptLog, ContentPack } from "@/types/contentPack";

export default function Home() {
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState<"mock" | "api">("mock");
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputError, setInputError] = useState("");
  const [attempts, setAttempts] = useState<AttemptLog[]>([]);
  const [content, setContent] = useState<ContentPack | null>(null);
  const [lastRaw, setLastRaw] = useState<string | undefined>(undefined);

  const runWithApi = async (trimmedNotes: string) => {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: trimmedNotes }),
    });

    const body = (await response.json()) as
      | { raw: string }
      | { error: string; message: string };

    if (!response.ok || !("raw" in body)) {
      const message = "message" in body ? body.message : "failed to generate raw output";
      return {
        ok: false as const,
        attempts: [{ attempt: 1, ok: false as const, errorType: "UnknownError" as const, message }],
        lastRaw: undefined,
      };
    }

    const parsed = parseJsonSafely(body.raw);
    if (!parsed.ok) {
      return {
        ok: false as const,
        attempts: [{ attempt: 1, ok: false as const, errorType: parsed.errorType, message: parsed.message }],
        lastRaw: body.raw,
      };
    }

    const validated = validateContentPack(parsed.data);
    if (!validated.ok) {
      return {
        ok: false as const,
        attempts: [{ attempt: 1, ok: false as const, errorType: validated.errorType, message: validated.message }],
        lastRaw: body.raw,
      };
    }

    return {
      ok: true as const,
      content: validated.data,
      attempts: [{ attempt: 1, ok: true as const }],
    };
  };

  const handleGenerate = async () => {
    const trimmedNotes = notes.trim();
    if (trimmedNotes.length === 0) {
      setInputError("Please enter meeting notes before generating.");
      return;
    }

    setInputError("");
    setIsGenerating(true);
    setContent(null);
    setAttempts([]);
    setLastRaw(undefined);

    const result = mode === "mock" ? await runWithRetry({ notes: trimmedNotes }) : await runWithApi(trimmedNotes);

    setAttempts(result.attempts);
    if (result.ok) {
      setContent(result.content);
      setLastRaw(undefined);
    } else {
      setContent(null);
      setLastRaw(result.lastRaw);
    }

    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-black">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Content Generator Demo</h1>
        <InputPanel
          notes={notes}
          mode={mode}
          isGenerating={isGenerating}
          errorMessage={inputError}
          onNotesChange={setNotes}
          onModeChange={setMode}
          onGenerate={handleGenerate}
        />
        <AttemptLogs attempts={attempts} />
        <ResultPanel content={content} />
        {lastRaw ? (
          <section className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Last Raw Output</h2>
            <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">{lastRaw}</pre>
          </section>
        ) : null}
      </main>
    </div>
  );
}
