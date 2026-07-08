/**
 * Currency and Number Formatting Utilities
 * Provides standardized formatting for Indian currency (K, Lakh, Cr), percentages, and ranges.
 *
 * @module IndiaAmountFormatter
 */

/**
 * Formats a numeric value with a specified precision, removing unnecessary trailing zeros.
 *
 * @param value - The numeric value to format.
 * @param precision - The number of decimal places (default: 2).
 * @returns A string representation of the number without trailing zeros.
 */
function formatDecimal(value: number, precision: number = 2): string {
    return parseFloat(value.toFixed(precision)).toString();
}

/**
 * Formats a numeric amount into a readable Indian currency short-form string.
 * Examples: 200000 -> "₹2 Lakh", 1500 -> "₹1.5K", 500 -> "₹500".
 *
 * @param amount - The numeric amount to format. Returns "Unlimited" if null.
 * @param prefix - The currency symbol prefix (default: "₹").
 * @returns The formatted currency string.
 */
export function formatAmount(amount: number | null, prefix: string = '₹'): string {
    if (amount === null) return 'Unlimited';

    if (amount >= 10_000_000) {
        return `${prefix}${formatDecimal(amount / 10_000_000)} Cr`;
    }
    if (amount >= 100_000) {
        return `${prefix}${formatDecimal(amount / 100_000)} Lakh`;
    }
    if (amount >= 1_000) {
        return `${prefix}${formatDecimal(amount / 1_000)}K`;
    }

    // Uses native Indian locale formatting for exact comma placement (e.g., 1,00,000)
    return `${prefix}${amount.toLocaleString('en-IN')}`;
}

/**
 * Formats a percentage value, removing trailing zeros and handling string inputs.
 * Examples: 3 -> "3%", "3.50" -> "3.5%".
 *
 * @param value - The percentage value to format (number or string).
 * @returns The formatted percentage string.
 */
export function formatPercentage(value: number | string): string {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '0%';

    return `${formatDecimal(numValue)}%`;
}

/**
 * Formats a range of amounts into a readable string.
 * Examples: (100000, 500000) -> "₹1 Lakh - ₹5 Lakh", (100000, null) -> "₹1 Lakh+".
 *
 * @param min - The minimum amount in the range.
 * @param max - The maximum amount (null for unlimited).
 * @param prefix - The currency symbol prefix (default: "₹").
 * @returns The formatted range string.
 */
export function formatAmountRange(min: number, max: number | null, prefix: string = '₹'): string {
    const minFormatted = formatAmount(min, prefix);
    if (max === null) return `${minFormatted}+`;

    return `${minFormatted} - ${formatAmount(max, prefix)}`;
}

/**
 * Formats an amount with both its short form and actual numeric value for transparency.
 * Examples: 140000 -> "₹1.4 Lakh (₹1,40,000)", 500 -> "₹500".
 *
 * @param amount - The numeric amount to format.
 * @param prefix - The currency symbol prefix (default: "₹").
 * @returns The formatted string containing both short and actual values.
 */
export function formatAmountWithActual(amount: number, prefix: string = '₹'): string {
    const short = formatAmount(amount, prefix);
    const actual = `${prefix}${amount.toLocaleString('en-IN')}`;

    // Only show both formats if the amount is large enough to have a short form
    return amount >= 1_000 && short !== actual ? `${short} (${actual})` : actual;
}
