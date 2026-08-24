/**
 * Validates corporate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates Mexican RFC format (persona moral o física)
 */
export function isValidRFC(rfc: string): boolean {
  const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/i;
  return rfcRegex.test(rfc.trim());
}

/**
 * Validates 10-digit telephone number
 */
export function isValidPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10;
}
