import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Home from "@/app/page";
import { runWithRetry } from "@/lib/runWithRetry";

vi.mock("@/lib/runWithRetry", () => ({
  runWithRetry: vi.fn(),
}));

describe("Home page flow", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    cleanup();
  });

  it("triggers mock mode flow and updates logs/result", async () => {
    vi.mocked(runWithRetry).mockResolvedValueOnce({
      ok: true,
      content: {
        meeting_title: "M1",
        email: { subject: "S1", draft: "D1" },
        blog: { title: "B1", outline: ["o1", "o2"] },
      },
      attempts: [{ attempt: 1, ok: true }],
    });

    const user = userEvent.setup();
    render(<Home />);

    await user.type(screen.getByPlaceholderText("Paste your meeting notes here..."), "notes");
    await user.click(screen.getByRole("button", { name: "Generate" }));

    await waitFor(() => expect(runWithRetry).toHaveBeenCalledWith({ notes: "notes" }));
    expect(await screen.findByText("S1")).toBeInTheDocument();
    expect(screen.getByText("#1 Success")).toBeInTheDocument();
  });

  it("uses API mode and shows last raw on parse failure", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ raw: "not json at all" }),
    } as Response);

    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getAllByRole("radio", { name: "API" })[0]);
    await user.type(screen.getByPlaceholderText("Paste your meeting notes here..."), "notes");
    await user.click(screen.getByRole("button", { name: "Generate" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(await screen.findByText("Last Raw Output")).toBeInTheDocument();
  });
});
