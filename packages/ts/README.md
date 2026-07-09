# Indian Amount Formatter (TypeScript)

> A high-performance TypeScript utility package for formatting Indian currency amounts, percentages, and ranges.

## 📦 Installation

```bash
npm install @sikandarmoyaldev/indian-amount-formatter
# or
pnpm add @sikandarmoyaldev/indian-amount-formatter
```

## 📖 Usage

### Standalone Functions (Default)

By default, the standalone functions use `round: false` (truncation) to prevent values like `4999` from incorrectly rounding to `5K`.

```ts
import * as Inr from '@sikandarmoyaldev/indian-amount-formatter';

console.log(Inr.formatAmount(200000)); // Output: ₹2 Lakh
console.log(Inr.formatAmount(4999)); // Output: ₹4.99K
console.log(Inr.formatAmount(null)); // Output: Unlimited
console.log(Inr.formatPercentage(3.5)); // Output: 3.5%
console.log(Inr.formatAmountRange(100000, 500000)); // Output: ₹1 Lakh - ₹5 Lakh
console.log(Inr.formatAmountWithActual(140000)); // Output: ₹1.4 Lakh (₹1,40,000)
```

### Class-Based API (Custom Options)

You can instantiate the `InrFormatter` class to configure options like rounding.

```ts
import { InrFormatter } from '@sikandarmoyaldev/indian-amount-formatter';

// Enable rounding globally for this instance
const inr = new InrFormatter({ round: true });

console.log(inr.formatAmount(4999)); // Output: ₹5K (Rounded)
console.log(inr.formatPercentage(9.999)); // Output: 10%

// Override options for a single method call
console.log(inr.formatAmount(4999, '₹', { round: false })); // Output: ₹4.99K
```

## 💡 API Reference

| Method                                              | Description                                          | Example Output          |
| --------------------------------------------------- | ---------------------------------------------------- | ----------------------- |
| `formatAmount(amount, prefix?, options?)`           | Formats a numeric amount into Indian short-form.     | `₹2 Lakh, ₹4.99K`       |
| `formatPercentage(value, options?)`                 | Formats a percentage, removing trailing zeros.       | `3.5%, 10%`             |
| `formatAmountRange(min, max, prefix?, options?)`    | Formats a range of amounts.                          | `₹1 Lakh - ₹5 Lakh`     |
| `formatAmountWithActual(amount, prefix?, options?)` | Formats amount showing both short and actual values. | `₹1.4 Lakh (₹1,40,000)` |

> **Note**: You can also use the `InrFormatter` class to configure options like `round: true` or `round: false`.
