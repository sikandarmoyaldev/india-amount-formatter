import { InrFormatterOptions } from './types';

/**
 * Class-based formatter for Indian currency amounts.
 * Provides standardized formatting for Indian currency (K, Lakh, Cr), percentages, and ranges.
 */
export class InrFormatter {
    private options: InrFormatterOptions;

    constructor(options: InrFormatterOptions = { round: false }) {
        // Default to false to fix the 4999 -> 5K bug
        this.options = { round: false, ...options };
    }

    /**
     * Formats a numeric value with a specified precision, removing unnecessary trailing zeros.
     *
     * @param value - The numeric value to format.
     * @param precision - The number of decimal places (default: 2).
     * @param overrideOptions - Optional overrides for this specific call.
     * @returns A string representation of the number without trailing zeros.
     */
    private formatDecimal(
        value: number,
        precision: number = 2,
        overrideOptions?: InrFormatterOptions
    ): string {
        const shouldRound = overrideOptions?.round ?? this.options.round;

        if (shouldRound) {
            return parseFloat(value.toFixed(precision)).toString();
        }

        // Truncate logic to prevent 4999 from becoming 5K
        const str = value.toString();
        const dotIndex = str.indexOf('.');

        if (dotIndex === -1) return str;

        let result = str.substring(0, dotIndex + precision + 1);
        if (result.includes('.')) {
            result = result.replace(/0+$/, '').replace(/\.$/, '');
        }

        return result;
    }

    /**
     * Formats a numeric amount into a readable Indian currency short-form string.
     * Examples: 200000 -> "₹2 Lakh", 1500 -> "₹1.5K", 500 -> "₹500".
     *
     * @param amount - The numeric amount to format. Returns "Unlimited" if null.
     * @param prefix - The currency symbol prefix (default: "₹").
     * @param options - Optional overrides for formatter settings.
     * @returns The formatted currency string.
     */
    formatAmount(
        amount: number | null,
        prefix: string = '₹',
        options?: InrFormatterOptions
    ): string {
        if (amount === null) return 'Unlimited';

        if (amount >= 10_000_000) {
            return `${prefix}${this.formatDecimal(amount / 10_000_000, 2, options)} Cr`;
        }
        if (amount >= 100_000) {
            return `${prefix}${this.formatDecimal(amount / 100_000, 2, options)} Lakh`;
        }
        if (amount >= 1_000) {
            return `${prefix}${this.formatDecimal(amount / 1_000, 2, options)}K`;
        }

        // Uses native Indian locale formatting for exact comma placement (e.g., 1,00,000)
        return `${prefix}${amount.toLocaleString('en-IN')}`;
    }

    /**
     * Formats a percentage value, removing trailing zeros and handling string inputs.
     * Examples: 3 -> "3%", "3.50" -> "3.5%".
     *
     * @param value - The percentage value to format (number or string).
     * @param options - Optional overrides for formatter settings.
     * @returns The formatted percentage string.
     */
    formatPercentage(value: number | string, options?: InrFormatterOptions): string {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(numValue)) return '0%';

        return `${this.formatDecimal(numValue, 2, options)}%`;
    }

    /**
     * Formats a range of amounts into a readable string.
     * Examples: (100000, 500000) -> "₹1 Lakh - ₹5 Lakh", (100000, null) -> "₹1 Lakh+".
     *
     * @param min - The minimum amount in the range.
     * @param max - The maximum amount (null for unlimited).
     * @param prefix - The currency symbol prefix (default: "₹").
     * @param options - Optional overrides for formatter settings.
     * @returns The formatted range string.
     */
    formatAmountRange(
        min: number,
        max: number | null,
        prefix: string = '₹',
        options?: InrFormatterOptions
    ): string {
        const minFormatted = this.formatAmount(min, prefix, options);
        if (max === null) return `${minFormatted}+`;

        return `${minFormatted} - ${this.formatAmount(max, prefix, options)}`;
    }

    /**
     * Formats an amount with both its short form and actual numeric value for transparency.
     * Examples: 140000 -> "₹1.4 Lakh (₹1,40,000)", 500 -> "₹500".
     *
     * @param amount - The numeric amount to format.
     * @param prefix - The currency symbol prefix (default: "₹").
     * @param options - Optional overrides for formatter settings.
     * @returns The formatted string containing both short and actual values.
     */
    formatAmountWithActual(
        amount: number,
        prefix: string = '₹',
        options?: InrFormatterOptions
    ): string {
        const short = this.formatAmount(amount, prefix, options);
        const actual = `${prefix}${amount.toLocaleString('en-IN')}`;

        // Only show both formats if the amount is large enough to have a short form
        return amount >= 1_000 && short !== actual ? `${short} (${actual})` : actual;
    }
}
