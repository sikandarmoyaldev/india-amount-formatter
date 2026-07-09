<?php

namespace Sikandarmoyaldev\IndianAmountFormatter;

/**
 * Indian Amount Formatter
 *
 * Formats integers and floats into readable Indian currency short-form:
 * 1,000 -> 1K | 1,00,000 -> 1 Lakh | 1,00,00,000 -> 1 Cr
 *
 * @package Sikandarmoyaldev\IndianAmountFormatter
 *
 * @method string format(int|float|null $amount, string $prefix = '₹', ?array $options = null)
 * @method string formatPercentage(mixed $value, ?array $options = null)
 * @method string formatAmountRange(int|float|null $min, int|float|null $max, string $prefix = '₹', ?array $options = null)
 * @method string formatAmountWithActual(int|float $amount, string $prefix = '₹', ?array $options = null)
 *
 * @method static string format(int|float|null $amount, string $prefix = '₹', ?array $options = null)
 * @method static string formatPercentage(mixed $value, ?array $options = null)
 * @method static string formatAmountRange(int|float|null $min, int|float|null $max, string $prefix = '₹', ?array $options = null)
 * @method static string formatAmountWithActual(int|float $amount, string $prefix = '₹', ?array $options = null)
 */
class InrFormatter
{
    private bool $round;
    private static ?self $defaultInstance = null;

    /**
     * @param array{round?: bool} $options Options for the formatter. 'round' defaults to false.
     */
    public function __construct(array $options = ['round' => false])
    {
        // Default to false to fix the 4999 -> 5K bug
        $this->round = $options['round'] ?? false;
    }

    /**
     * Get the default instance used by static calls.
     */
    private static function getDefault(): self
    {
        if (self::$defaultInstance === null) {
            self::$defaultInstance = new self(['round' => false]);
        }
        return self::$defaultInstance;
    }

    /**
     * Set options for the default static instance.
     */
    public static function setDefaultOptions(array $options): void
    {
        self::$defaultInstance = new self($options);
    }

    // --- Magic Methods for API Compatibility ---
    // PHP does not allow static and instance methods with the same name.
    // We use __call and __callStatic to route both to our internal 'do' methods.

    public function __call(string $name, array $arguments)
    {
        $method = 'do' . ucfirst($name);
        if (method_exists($this, $method)) {
            return $this->$method(...$arguments);
        }
        throw new \BadMethodCallException("Method {$name} does not exist.");
    }

    public static function __callStatic(string $name, array $arguments)
    {
        $method = 'do' . ucfirst($name);
        if (method_exists(self::getDefault(), $method)) {
            return self::getDefault()->$method(...$arguments);
        }
        throw new \BadMethodCallException("Method {$name} does not exist.");
    }

    // --- Internal Implementation Methods ---

    /**
     * Format amount in Indian style with short labels.
     */
    private function doFormat(
        int|float|null $amount,
        string $prefix = '₹',
        ?array $options = null,
    ): string {
        // Handle null or empty values gracefully
        if (is_null($amount) || $amount === '') {
            return 'Unlimited';
        }

        // Ensure numeric value
        $amount = is_numeric($amount) ? (float) $amount : 0.0;

        if ($amount >= 10000000) {
            // Crores: 1,00,00,000+
            $value = $amount / 10000000;
            return $prefix . $this->formatDecimal($value, 2, $options) . ' Cr';
        }

        if ($amount >= 100000) {
            // Lakhs: 1,00,000 to 99,99,999
            $value = $amount / 100000;
            return $prefix . $this->formatDecimal($value, 2, $options) . ' Lakh';
        }

        if ($amount >= 1000) {
            // Thousands: 1,000 to 99,999
            $value = $amount / 1000;
            return $prefix . $this->formatDecimal($value, 2, $options) . 'K';
        }

        // Below 1K: show with prefix, using native Indian number formatting
        return $prefix . self::formatIndianNumber($amount);
    }

    /**
     * Format percentage value, removing trailing zeros.
     */
    private function doFormatPercentage($value, ?array $options = null): string
    {
        $numValue = is_string($value) ? (float) $value : $value;
        if (!is_numeric($numValue) || is_nan($numValue)) {
            return '0%';
        }
        return $this->formatDecimal($numValue, 2, $options) . '%';
    }

    /**
     * Format range: min and max amounts.
     * Returns: "₹1 Lakh - ₹5 Lakh" or "₹1 Lakh+"
     */
    private function doFormatAmountRange(
        int|float|null $min,
        int|float|null $max,
        string $prefix = '₹',
        ?array $options = null,
    ): string {
        $minFormatted = $this->doFormat($min, $prefix, $options);

        if (is_null($max)) {
            return "{$minFormatted}+";
        }

        $maxFormatted = $this->doFormat($max, $prefix, $options);
        return "{$minFormatted} - {$maxFormatted}";
    }

    /**
     * Format amount with BOTH short form AND actual numeric value.
     * Example: "₹1.4 Lakh (₹1,40,000)"
     */
    private function doFormatAmountWithActual(
        int|float $amount,
        string $prefix = '₹',
        ?array $options = null,
    ): string {
        $short = $this->doFormat($amount, $prefix, $options);
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
     */
    private function formatDecimal(
        float $value,
        int $precision = 2,
        ?array $overrideOptions = null,
    ): string {
        $shouldRound = $overrideOptions['round'] ?? $this->round;

        if ($shouldRound) {
            $formatted = number_format($value, $precision, '.', '');
            return rtrim(rtrim($formatted, '0'), '.');
        }

        // Truncate logic to prevent 4999 from becoming 5K
        $str = (string) $value;
        $dotIndex = strpos($str, '.');

        if ($dotIndex === false) {
            return $str;
        }

        $result = substr($str, 0, $dotIndex + $precision + 1);

        if (strpos($result, '.') !== false) {
            $result = rtrim($result, '0');
            $result = rtrim($result, '.');
        }

        return $result;
    }

    /**
     * Helper: Format number using the native Indian locale (en_IN).
     * This ensures exact comma placement (e.g., 1,00,000 instead of 100,000).
     */
    private static function formatIndianNumber(float $amount): string
    {
        $formatter = new \NumberFormatter('en_IN', \NumberFormatter::DECIMAL);
        return $formatter->format($amount);
    }
}
