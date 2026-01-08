interface FormatCurrencyOptions {
  decimals?: number;
  prefix?: string;
  suffix?: string;
  fallback?: string;
  divisor?: number; // For different units (cents, nanoUSD, etc.)
}

export const formatCurrency = (
  amount: number | undefined,
  options: FormatCurrencyOptions = {}
): string => {
  const {
    decimals = 4,
    prefix = "",
    suffix = "",
    fallback = "0.00",
    divisor = 1000000000, // Default for nanoUSD
  } = options;

  if (amount === undefined || amount === null || isNaN(amount)) {
    return fallback;
  }

  const formattedAmount = (amount / divisor).toFixed(decimals);
  return `${prefix}${formattedAmount}${suffix}`;
};

// Usage
// formatCurrency(invoicePreview?.totalAmountCents); // "0.0000"
// formatCurrency(invoicePreview?.totalAmountCents, { decimals: 2 }); // "0.00"
// formatCurrency(invoicePreview?.totalAmountCents, { prefix: '$', decimals: 2 }); // "$0.00"
// formatCurrency(invoicePreview?.totalAmountCents, { suffix: ' USD', decimals: 2 }); // "0.00 USD"
