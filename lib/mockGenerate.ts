type MockMode = "loose" | "strict";

export interface MockGenerateInput {
  notes: string;
  attempt: number;
  mode?: MockMode;
}

function buildValidPayload(notes: string, attempt: number): string {
  return JSON.stringify({
    meeting_title: `Meeting Summary #${attempt}`,
    email: {
      subject: `Follow-up: ${notes.slice(0, 40) || "Meeting Notes"}`,
      draft: `Hi team,\n\nHere is a follow-up based on the meeting notes:\n${notes}\n\nBest regards,`,
    },
    blog: {
      title: `Key Takeaways: ${notes.slice(0, 30) || "Meeting"}`,
      outline: ["Context and goals", "Discussion highlights", "Action items"],
    },
  });
}

function buildInvalidOutput(notes: string, attempt: number, variant: number): string {
  const valid = JSON.parse(buildValidPayload(notes, attempt)) as {
    meeting_title: string;
    email: { subject: string; draft: string };
    blog: { title: string; outline: string[] };
  };

  switch (variant % 4) {
    case 0:
      return "Sure, I can do that. Here is the result in plain text only.";
    case 1:
      return JSON.stringify({
        meeting_title: valid.meeting_title,
        email: valid.email,
        blog: { title: valid.blog.title },
      });
    case 2:
      return JSON.stringify({
        meeting_title: valid.meeting_title,
        email: {
          subject: 12345,
          draft: valid.email.draft,
        },
        blog: {
          title: valid.blog.title,
          outline: "not-an-array",
        },
      });
    default:
      return `Sure! Here is the JSON:\n${JSON.stringify(valid)}\nHope this helps!`;
  }
}

function generateByMode(input: MockGenerateInput, failureRate: number): string {
  const { notes, attempt } = input;
  const roll = Math.random();

  if (roll < failureRate) {
    const variant = Math.floor(Math.random() * 4) + attempt;
    return buildInvalidOutput(notes, attempt, variant);
  }

  return buildValidPayload(notes, attempt);
}

export function mockGenerateLoose(input: MockGenerateInput): string {
  return generateByMode({ ...input, mode: "loose" }, 0.7);
}

export function mockGenerateStrict(input: MockGenerateInput): string {
  return generateByMode({ ...input, mode: "strict" }, 0.2);
}
