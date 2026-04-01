import Ajv, { type ErrorObject, type ValidateFunction } from "ajv";

import { contentPackSchema } from "@/lib/schema";
import type { ContentPack } from "@/types/contentPack";

const ajv = new Ajv({ allErrors: true });

const validateSchema = ajv.compile(contentPackSchema as object) as ValidateFunction<ContentPack>;

type ValidateSuccess = { ok: true; data: ContentPack };
type ValidateFailure = { ok: false; errorType: "SchemaError"; message: string };

export function formatAjvErrors(errors: ErrorObject[] | null | undefined): string {
  if (!errors || errors.length === 0) {
    return "Schema validation failed";
  }

  return errors
    .map((error) => {
      const path = error.instancePath
        ? error.instancePath.replace(/\//g, ".").replace(/^\./, "")
        : "root";

      if (error.keyword === "required" && typeof error.params === "object" && error.params !== null) {
        const maybeMissingProperty = (error.params as { missingProperty?: unknown }).missingProperty;
        if (typeof maybeMissingProperty === "string") {
          const fullPath = path === "root" ? maybeMissingProperty : `${path}.${maybeMissingProperty}`;
          return `${fullPath}: is required`;
        }
      }

      return `${path}: ${error.message ?? "invalid value"}`;
    })
    .join("; ");
}

export function validateContentPack(data: unknown): ValidateSuccess | ValidateFailure {
  if (validateSchema(data)) {
    return { ok: true, data };
  }

  return {
    ok: false,
    errorType: "SchemaError",
    message: formatAjvErrors(validateSchema.errors),
  };
}
