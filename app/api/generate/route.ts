import { NextResponse } from "next/server";

import { generateRaw } from "@/lib/generateRaw";

interface GenerateRequestBody {
  notes?: unknown;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequestBody;
    const notes = typeof body.notes === "string" ? body.notes.trim() : "";

    if (!notes) {
      return NextResponse.json(
        { error: "INVALID_INPUT", message: "notes is required" },
        { status: 400 },
      );
    }

    const raw = generateRaw(notes);
    return NextResponse.json({ raw }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "failed to generate raw output" },
      { status: 500 },
    );
  }
}
