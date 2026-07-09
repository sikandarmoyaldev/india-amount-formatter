/**
 * Options for the InrFormatter.
 *
 * @module IndiaAmountFormatter
 */

export interface InrFormatterOptions {
    /** If true, rounds the decimal (e.g., 4.999 -> 5). If false, truncates (4.999 -> 4.99). Default: false. */
    round?: boolean;
}
