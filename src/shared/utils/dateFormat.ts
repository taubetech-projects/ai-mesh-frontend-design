import { format } from "date-fns";

export const formatBillingPeriod = (
  periodStart: Date | string | undefined,
  periodEnd: Date | string | undefined,
  fallback: string = "Billing Period: N/A"
): string => {
  if (!periodStart || !periodEnd) {
    return fallback;
  }

  const startDate =
    typeof periodStart === "string" ? new Date(periodStart) : periodStart;
  const endDate =
    typeof periodEnd === "string" ? new Date(periodEnd) : periodEnd;

  return `Billing Period: ${format(startDate, "MMM dd, yyyy")} - ${format(
    endDate,
    "MMM dd, yyyy"
  )}`;
};

// Usage
// formatBillingPeriod(invoicePreview?.periodStart, invoicePreview?.periodEnd);
// Returns: "Billing Period: Jan 01, 2024 - Jan 31, 2024"

export const formatDateYearMonthDay = (
  date: Date | string | undefined,
  fallback: string = "N/A"
): string => {
  if (!date) {
    return fallback;
  }

  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, "yyyy-MM-dd");
};
