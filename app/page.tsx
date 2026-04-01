"use client";

import { useState } from "react";

import AttemptLogs from "@/components/AttemptLogs";
import InputPanel from "@/components/InputPanel";
import ResultPanel from "@/components/ResultPanel";
import { runWithRetry } from "@/lib/runWithRetry";
import type { AttemptLog, ContentPack } from "@/types/contentPack";

export default function Home() {
  const [notes, setNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputError, setInputError] = useState("");
  const [attempts, setAttempts] = useState<AttemptLog[]>([]);
  const [content, setContent] = useState<ContentPack | null>(null);
  const [lastRaw, setLastRaw] = useState<string | undefined>(undefined);

  const handleGenerate = async () => {
    if (notes.trim().length === 0) {
      setInputError("Please enter meeting notes before generating.");
      return;
    }

    setInputError("");
    setIsGenerating(true);
    setContent(null);
    setAttempts([]);
    setLastRaw(undefined);

    const result = await runWithRetry({ notes: notes.trim() });

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
          isGenerating={isGenerating}
          errorMessage={inputError}
          onNotesChange={setNotes}
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
