import type { AttemptLog, AttemptErrorType } from "@/types/contentPack";

interface AttemptLogsProps {
  attempts: AttemptLog[];
}

function getErrorLabel(errorType?: AttemptErrorType): string {
  if (!errorType) return "Unknown";
  if (errorType === "ParseError") return "ParseError";
  if (errorType === "SchemaError") return "SchemaError";
  return "UnknownError";
}

export default function AttemptLogs({ attempts }: AttemptLogsProps) {
  return (
    <section className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Attempt Logs</h2>
      {attempts.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">No attempts yet. Generate to see logs.</p>
      ) : (
        <ul className="space-y-2">
          {attempts.map((attempt) => (
            <li
              key={attempt.attempt}
              className="rounded-md border border-zinc-200 bg-zinc-50 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <p className={attempt.ok ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}>
                #{attempt.attempt} {attempt.ok ? "Success" : getErrorLabel(attempt.errorType)}
              </p>
              {!attempt.ok && attempt.message ? (
                <p className="mt-1 text-zinc-700 dark:text-zinc-300">{attempt.message}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
