"use client";

import { useState } from "react";

import type { ContentPack } from "@/types/contentPack";

interface ResultPanelProps {
  content: ContentPack | null;
}

async function copyToClipboard(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export default function ResultPanel({ content }: ResultPanelProps) {
  const [copyMessage, setCopyMessage] = useState<string>("");

  if (!content) {
    return null;
  }

  const emailText = `Subject: ${content.email.subject}\n\n${content.email.draft}`;
  const blogText = `Title: ${content.blog.title}\n\n${content.blog.outline.map((item) => `- ${item}`).join("\n")}`;

  const handleCopy = async (target: "email" | "blog") => {
    const value = target === "email" ? emailText : blogText;
    const ok = await copyToClipboard(value);
    setCopyMessage(ok ? `${target} copied.` : `${target} copy failed.`);
  };

  return (
    <section className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Generated Result</h2>

      <div className="mb-4 rounded-md border border-zinc-200 p-3 dark:border-zinc-700">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Email</h3>
          <button
            type="button"
            onClick={() => handleCopy("email")}
            className="rounded-md border border-zinc-300 px-3 py-1 text-sm dark:border-zinc-700"
          >
            Copy Email
          </button>
        </div>
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{content.email.subject}</p>
        <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">{content.email.draft}</p>
      </div>

      <div className="rounded-md border border-zinc-200 p-3 dark:border-zinc-700">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Blog</h3>
          <button
            type="button"
            onClick={() => handleCopy("blog")}
            className="rounded-md border border-zinc-300 px-3 py-1 text-sm dark:border-zinc-700"
          >
            Copy Blog
          </button>
        </div>
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{content.blog.title}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          {content.blog.outline.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {copyMessage ? <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{copyMessage}</p> : null}
    </section>
  );
}
