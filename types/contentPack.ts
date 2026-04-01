export interface ContentPack {
  meeting_title: string;
  email: {
    subject: string;
    draft: string;
  };
  blog: {
    title: string;
    outline: string[];
  };
}

export type AttemptErrorType = "ParseError" | "SchemaError" | "UnknownError";

export interface AttemptLog {
  attempt: number;
  ok: boolean;
  errorType?: AttemptErrorType;
  message?: string;
}
