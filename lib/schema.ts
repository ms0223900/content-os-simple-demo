export const contentPackSchema = {
  type: "object",
  properties: {
    meeting_title: { type: "string" },
    email: {
      type: "object",
      properties: {
        subject: { type: "string" },
        draft: { type: "string" },
      },
      required: ["subject", "draft"],
      additionalProperties: false,
    },
    blog: {
      type: "object",
      properties: {
        title: { type: "string" },
        outline: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["title", "outline"],
      additionalProperties: false,
    },
  },
  required: ["meeting_title", "email", "blog"],
  additionalProperties: false,
} as const;
