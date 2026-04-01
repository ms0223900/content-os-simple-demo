type ParseJsonSuccess = { ok: true; data: unknown };
type ParseJsonFailure = { ok: false; errorType: "ParseError"; message: string };

export function extractJson(raw: string): string {
  const startIndex = raw.indexOf("{");
  const endIndex = raw.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error("ParseError: cannot locate JSON object boundaries");
  }

  return raw.slice(startIndex, endIndex + 1);
}

export function parseJsonSafely(raw: string): ParseJsonSuccess | ParseJsonFailure {
  try {
    const jsonSlice = extractJson(raw);
    const data = JSON.parse(jsonSlice) as unknown;
    return { ok: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown parse error";
    return { ok: false, errorType: "ParseError", message };
  }
}
