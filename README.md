# Indian Amount Formatter

> A high-performance, dual-language utility package for formatting Indian currency amounts, percentages, and ranges.

This monorepo contains native implementations for both **TypeScript** and **PHP**, guaranteed to behave identically via shared test fixtures.

## 📚 Packages

| Package                            | Language             | Documentation                         |
| :--------------------------------- | :------------------- | :------------------------------------ |
| **[packages/ts](./packages/ts)**   | TypeScript / Node.js | [View Docs](./packages/ts/README.md)  |
| **[packages/php](./packages/php)** | PHP                  | [View Docs](./packages/php/README.md) |

## ✨ Features

- **Standardized Indian currency short-form:** K, Lakh, Cr.
- **Percentage formatting:** Automatic trailing zero removal.
- **Range formatting:** For min/max values (e.g., `₹1 Lakh - ₹5 Lakh`).
- **Transparent formatting:** Shows both short-form and actual numeric values.
- **100% native performance:** Zero FFI overhead in both languages.
- **Guaranteed behavioral parity:** Verified via shared JSON test fixtures.

## 📦 Installation

### TypeScript / Node.js

```bash
npm install @sikandarmoyaldev/indian-amount-formatter
# or
pnpm add @sikandarmoyaldev/indian-amount-formatter
```

### PHP

```bash
composer require sikandarmoyaldev/indian-amount-formatter
```

## 📖 Usage

### TypeScript

```ts
import * as Inr from '@sikandarmoyaldev/india-amount-formatter';

console.log(Inr.formatAmount(200000)); // Output: ₹2 Lakh
console.log(Inr.formatAmount(4999)); // Output: ₹4.99K
console.log(Inr.formatAmount(null)); // Output: Unlimited
console.log(Inr.formatPercentage(3.5)); // Output: 3.5%
console.log(Inr.formatAmountRange(100000, 500000)); // Output: ₹1 Lakh - ₹5 Lakh
console.log(Inr.formatAmountWithActual(140000)); // Output: ₹1.4 Lakh (₹1,40,000)
```

### PHP

```php
use Sikandarmoyaldev\IndiaAmountFormatter\InrFormatter as Inr;

echo Inr::formatAmount(200000); // Output: ₹2 Lakh
echo Inr::formatAmount(4999); // Output: ₹4.99K
echo Inr::formatAmount(null); // Output: Unlimited
echo Inr::formatPercentage(3.5); // Output: 3.5%
echo Inr::formatAmountRange(100000, 500000); // Output: ₹1 Lakh - ₹5 Lakh
echo Inr::formatAmountWithActual(140000); // Output: ₹1.4 Lakh (₹1,40,000)
```

## 💡 API Reference

| Method                                              | Description                                          | Example Output          |
| --------------------------------------------------- | ---------------------------------------------------- | ----------------------- |
| `formatAmount(amount, prefix?, options?)`           | Formats a numeric amount into Indian short-form.     | `₹2 Lakh, ₹4.99K`       |
| `formatPercentage(value, options?)`                 | Formats a percentage, removing trailing zeros.       | `3.5%, 10%`             |
| `formatAmountRange(min, max, prefix?, options?)`    | Formats a range of amounts.                          | `₹1 Lakh - ₹5 Lakh`     |
| `formatAmountWithActual(amount, prefix?, options?)` | Formats amount showing both short and actual values. | `₹1.4 Lakh (₹1,40,000)` |

> **Note**: You can also use the InrFormatter class to configure options like `round: true` or `round: false`.

## 🛠️ Development

This project uses a monorepo structure managed by `pnpm` (for TypeScript) and `composer` (for PHP).

### Prerequisites

- Node.js (v18 or higher)
- pnpm
- PHP (v8.1 or higher)
- Composer

### Setup

```bash
# Install root and TypeScript dependencies
pnpm install

# Install PHP dependencies
pnpm run php install
```

## 🧪 Running Tests

```bash
# Run all tests (TypeScript + PHP)
pnpm test

# Run only TypeScript tests (Vitest)
pnpm run test:ts

# Run only PHP tests (PHPUnit)
pnpm run test:php
```

## 📄 Formatting Code

We use Prettier globally to format TS, JS, JSON, MD, and PHP files.

```bash
# Format all files
pnpm format

# Check if files are formatted correctly (used in CI)
pnpm format:check
```

## License

This project is licensed under the MIT [License](LICENSE) - see the LICENSE file for details.
