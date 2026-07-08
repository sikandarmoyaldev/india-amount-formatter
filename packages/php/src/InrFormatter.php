<?php

namespace Sikandarmoyaldev\IndiaAmountFormatter;

/**
 * Indian Amount Formatter
 *
 * Formats integers and floats into readable Indian currency short-form:
 * 1,000 -> 1K | 1,00,000 -> 1 Lakh | 1,00,00,000 -> 1 Cr
 *
 * @package Sikandarmoyaldev\IndiaAmountFormatter
 */
class InrFormatter
{
    /**
     * Format amount in Indian style with short labels.
     *
     * @param int|float|null $amount The numeric amount to format.
     * @param string $prefix The currency symbol prefix (default: "₹").
     * @return string The formatted currency string.
     */
    public static function format(int|float|null $amount, string $prefix = '₹'): string
    {
        // Handle null or empty values gracefully
        if (is_null($amount) || $amount === '') {
            return 'Unlimited';
        }

        // Ensure numeric value
        $amount = is_numeric($amount) ? (float) $amount : 0.0;

        if ($amount >= 10000000) {
            // Crores: 1,00,00,000+
            $value = $amount / 10000000;
            return $prefix . self::formatDecimal($value, 2) . ' Cr';
        }

        if ($amount >= 100000) {
            // Lakhs: 1,00,000 to 99,99,999
            $value = $amount / 100000;
            return $prefix . self::formatDecimal($value, 2) . ' Lakh';
        }

        if ($amount >= 1000) {
            // Thousands: 1,000 to 99,999
            $value = $amount / 1000;
            return $prefix . self::formatDecimal($value, 2) . 'K';
        }

        // Below 1K: show with prefix, using native Indian number formatting
        return $prefix . self::formatIndianNumber($amount);
    }

    /**
     * Format percentage value, removing trailing zeros.
     *
     * @param mixed $value The percentage value to format (number or string).
     * @return string The formatted percentage string.
     */
    public static function formatPercentage($value): string
    {
        $numValue = is_string($value) ? (float) $value : $value;
        if (!is_numeric($numValue) || is_nan($numValue)) {
            return '0%';
        }
        return self::formatDecimal($numValue) . '%';
    }

    /**
     * Format range: min and max amounts.
     * Returns: "₹1 Lakh - ₹5 Lakh" or "₹1 Lakh+"
     *
     * @param int|float|null $min The minimum amount.
     * @param int|float|null $max The maximum amount (null for unlimited).
     * @param string $prefix The currency symbol prefix (default: "₹").
     * @return string The formatted range string.
     */
    public static function formatAmountRange(
        int|float|null $min,
        int|float|null $max,
        string $prefix = '₹',
    ): string {
        $minFormatted = self::format($min, $prefix);

        if (is_null($max)) {
            return "{$minFormatted}+";
        }

        $maxFormatted = self::format($max, $prefix);
        return "{$minFormatted} - {$maxFormatted}";
    }

    /**
     * Format amount with BOTH short form AND actual numeric value.
     * Example: "₹1.4 Lakh (₹1,40,000)"
     *
     * @param int|float $amount The numeric amount to format.
     * @param string $prefix The currency symbol prefix (default: "₹").
     * @return string The formatted string containing both short and actual values.
     */
    public static function formatAmountWithActual(int|float $amount, string $prefix = '₹'): string
    {
        $short = self::format($amount, $prefix);
        $actual = $prefix . self::formatIndianNumber($amount);

        // Only show both if they are different (i.e., amount >= 1K)
        if ($amount >= 1000 && $short !== $actual) {
            return "{$short} ({$actual})";
        }

        // For small amounts, just show the actual value
        return $actual;
    }

    /**
     * Helper: Format decimal with configurable precision.
     * Removes trailing zeros for cleaner output.
     *
     * @param float $value The numeric value.
     * @param int $precision The number of decimal places.
     * @return string The formatted decimal string.
     */
    private static function formatDecimal(float $value, int $precision = 2): string
    {
        $formatted = number_format($value, $precision, '.', '');
        return rtrim(rtrim($formatted, '0'), '.');
    }

    /**
     * Helper: Format number using the native Indian locale (en_IN).
     * This ensures exact comma placement (e.g., 1,00,000 instead of 100,000).
     *
     * @param float $amount The numeric amount.
     * @return string The formatted number string.
     */
    private static function formatIndianNumber(float $amount): string
    {
        $formatter = new \NumberFormatter('en_IN', \NumberFormatter::DECIMAL);
        return $formatter->format($amount);
    }
}
