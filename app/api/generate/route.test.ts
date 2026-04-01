import { describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/generate/route";
import { generateRaw } from "@/lib/generateRaw";

vi.mock("@/lib/generateRaw", () => ({
  generateRaw: vi.fn(),
}));

describe("POST /api/generate", () => {
  it("returns 400 when notes is empty", async () => {
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({ notes: "   " }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "INVALID_INPUT", message: "notes is required" });
  });

  it("returns 200 with raw string for valid notes", async () => {
    vi.mocked(generateRaw).mockReturnValueOnce("{\"meeting_title\":\"x\"}");
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({ notes: "meeting notes" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ raw: "{\"meeting_title\":\"x\"}" });
  });

  it("returns 500 when generation throws", async () => {
    vi.mocked(generateRaw).mockImplementationOnce(() => {
      throw new Error("boom");
    });
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({ notes: "meeting notes" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "INTERNAL_ERROR", message: "failed to generate raw output" });
  });
});
