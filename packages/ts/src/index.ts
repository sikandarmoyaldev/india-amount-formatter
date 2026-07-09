/**
 * Currency and Number Formatting Utilities
 * Provides standardized formatting for Indian currency (K, Lakh, Cr), percentages, and ranges.
 *
 * @module IndiaAmountFormatter
 */

export * from './formatter';
export * from './types';

import { InrFormatter } from './formatter';
import { InrFormatterOptions } from './types';

// Default instance used by standalone functions (round: false fixes the 4999 bug)
const defaultFormatter = new InrFormatter({ round: false });

/**
 * Formats a numeric amount into a readable Indian currency short-form string.
 * (Standalone function using default formatter)
 */
export function formatAmount(
    amount: number | null,
    prefix: string = '₹',
    options?: InrFormatterOptions
): string {
    return defaultFormatter.formatAmount(amount, prefix, options);
}

/**
 * Formats a percentage value, removing trailing zeros and handling string inputs.
 * (Standalone function using default formatter)
 */
export function formatPercentage(value: number | string, options?: InrFormatterOptions): string {
    return defaultFormatter.formatPercentage(value, options);
}

/**
 * Formats a range of amounts into a readable string.
 * (Standalone function using default formatter)
 */
export function formatAmountRange(
    min: number,
    max: number | null,
    prefix: string = '₹',
    options?: InrFormatterOptions
): string {
    return defaultFormatter.formatAmountRange(min, max, prefix, options);
}

/**
 * Formats an amount with both its short form and actual numeric value for transparency.
 * (Standalone function using default formatter)
 */
export function formatAmountWithActual(
    amount: number,
    prefix: string = '₹',
    options?: InrFormatterOptions
): string {
    return defaultFormatter.formatAmountWithActual(amount, prefix, options);
}
