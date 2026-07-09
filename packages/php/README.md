# Indian Amount Formatter (PHP)

> A high-performance PHP utility package for formatting Indian currency amounts, percentages, and ranges.

## 📦 Installation

```bash
composer require sikandarmoyaldev/indian-amount-formatter
```

## 📖 Usage

### Static Methods (Default)

By default, the static methods use `round: false` (truncation) to prevent values like `4999` from incorrectly rounding to `5K`.

```php
use Sikandarmoyaldev\IndianAmountFormatter\InrFormatter as Inr;

echo Inr::formatAmount(200000); // Output: ₹2 Lakh
echo Inr::formatAmount(4999); // Output: ₹4.99K
echo Inr::formatAmount(null); // Output: Unlimited
echo Inr::formatPercentage(3.5); // Output: 3.5%
```

### Class-Based API (Custom Options)

You can instantiate the `InrFormatter` class to configure options like rounding.

```php
use Sikandarmoyaldev\IndianAmountFormatter\InrFormatter;

// Enable rounding globally for this instance
$inr = new InrFormatter(['round' => true]);

echo $inr->formatAmount(4999); // Output: ₹5K (Rounded)
echo $inr->formatPercentage(9.999); // Output: 10%

// Override options for a single method call
echo $inr->formatAmount(4999, '₹', ['round' => false]); // Output: ₹4.99K
```

## 💡 API Reference

| Method                                              | Description                                          | Example Output          |
| --------------------------------------------------- | ---------------------------------------------------- | ----------------------- |
| `formatAmount(amount, prefix?, options?)`           | Formats a numeric amount into Indian short-form.     | `₹2 Lakh, ₹4.99K`       |
| `formatPercentage(value, options?)`                 | Formats a percentage, removing trailing zeros.       | `3.5%, 10%`             |
| `formatAmountRange(min, max, prefix?, options?)`    | Formats a range of amounts.                          | `₹1 Lakh - ₹5 Lakh`     |
| `formatAmountWithActual(amount, prefix?, options?)` | Formats amount showing both short and actual values. | `₹1.4 Lakh (₹1,40,000`) |

> **Note**: You can also use the InrFormatter class to configure options like `round: true` or `round: false`.
