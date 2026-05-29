export type ActionState = {
  ok: boolean;
  message: string;
};

export const emptyActionState: ActionState = {
  ok: false,
  message: "",
};

export function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${labelFromKey(key)} is required.`);
  }

  return value.trim();
}

export function optionalString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function integerFromForm(
  formData: FormData,
  key: string,
  options: { min?: number; max?: number } = {},
) {
  const raw = requiredString(formData, key);
  const parsed = Number(raw);

  if (!Number.isInteger(parsed)) {
    throw new Error(`${labelFromKey(key)} must be a whole number.`);
  }

  if (options.min !== undefined && parsed < options.min) {
    throw new Error(`${labelFromKey(key)} must be at least ${options.min}.`);
  }

  if (options.max !== undefined && parsed > options.max) {
    throw new Error(`${labelFromKey(key)} must be at most ${options.max}.`);
  }

  return parsed;
}

export function centsFromForm(formData: FormData, key: string) {
  const raw = requiredString(formData, key);
  const normalized = raw.replace(/,/g, "");
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${labelFromKey(key)} must be a valid amount.`);
  }

  return Math.round(parsed * 100);
}

export function enumFromForm<T extends string>(
  formData: FormData,
  key: string,
  allowed: readonly T[],
) {
  const value = requiredString(formData, key);

  if (!allowed.includes(value as T)) {
    throw new Error(`${labelFromKey(key)} is invalid.`);
  }

  return value as T;
}

export function checkboxFromForm(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export function idFromForm(formData: FormData, key = "id") {
  return integerFromForm(formData, key, { min: 1 });
}

export function actionError(error: unknown): ActionState {
  return {
    ok: false,
    message: error instanceof Error ? error.message : "Something went wrong.",
  };
}

function labelFromKey(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
}
