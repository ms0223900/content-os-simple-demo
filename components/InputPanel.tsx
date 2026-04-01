"use client";

interface InputPanelProps {
  notes: string;
  isGenerating: boolean;
  errorMessage?: string;
  mode: "mock" | "api";
  onNotesChange: (value: string) => void;
  onModeChange: (value: "mock" | "api") => void;
  onGenerate: () => void;
}

export default function InputPanel({
  notes,
  isGenerating,
  errorMessage,
  mode,
  onNotesChange,
  onModeChange,
  onGenerate,
}: InputPanelProps) {
  const isDisabled = isGenerating || notes.trim().length === 0;

  return (
    <section className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Meeting Notes</h2>
      <div className="mb-3 flex items-center gap-4 text-sm text-zinc-700 dark:text-zinc-300">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="mode"
            value="mock"
            checked={mode === "mock"}
            disabled={isGenerating}
            onChange={() => onModeChange("mock")}
          />
          Mock
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="mode"
            value="api"
            checked={mode === "api"}
            disabled={isGenerating}
            onChange={() => onModeChange("api")}
          />
          API
        </label>
      </div>
      <textarea
        value={notes}
        onChange={(event) => onNotesChange(event.target.value)}
        placeholder="Paste your meeting notes here..."
        disabled={isGenerating}
        className="min-h-40 w-full rounded-md border border-zinc-300 bg-white p-3 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      {errorMessage ? <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errorMessage}</p> : null}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isDisabled}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {isGenerating ? "Generating..." : "Generate"}
        </button>
      </div>
    </section>
  );
}
