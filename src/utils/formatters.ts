/**
 * Formats a number into Mexican Pesos currency representation
 */
export function formatCurrency(amount: number, locale = 'es-MX', currency = 'MXN'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Formats date string to localized readable format
 */
export function formatDate(dateStr: string, locale = 'es-MX'): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Formats a percentage
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}
