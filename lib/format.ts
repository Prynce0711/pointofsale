export const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 2,
});

export function formatCurrency(cents: number) {
  return currencyFormatter.format(cents / 100);
}

export function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
  }).format(value);
}

export function formatTime(value?: Date | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-PH", {
    timeStyle: "short",
  }).format(value);
}

export function formatDateInput(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function startOfTomorrow() {
  const today = startOfToday();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
}