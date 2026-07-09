# 🇮🇳 Contributing to India Amount Formatter

Thank you for your interest in contributing! This document explains how our monorepo is structured and how you can contribute safely.

## 🏛️ The Shared Fixtures Architecture

This project uses a "Shared Test Fixtures" approach. We do not share source code between TypeScript and PHP. Instead, we share the exact expected behavior.

All test cases are defined in `shared/fixtures/test-cases.json`. Both the TypeScript (Vitest) and PHP (PHPUnit) test suites read this file and verify that their native implementations produce the exact same output.

## 🛠️ How to Add a New Feature or Fix a Bug

If you need to change how an amount is formatted (for example, changing "Lakh" to "Lakhs", or adding a new function like `formatDate`), you must follow these steps:

1. **Update the Source of Truth:** Open `shared/fixtures/test-cases.json` and update the `expected` values or add new test cases to reflect the new behavior.
2. **Run the Tests:** Run `pnpm test` from the root directory. Both the TypeScript and PHP tests will now fail.
3. **Fix the Implementations:** Update `packages/ts/src/index.ts` and `packages/php/src/InrFormatter.php` until both test suites pass.
4. **Format and Commit:** Run `pnpm format` to ensure code style consistency, then submit your Pull Request.

## 📂 Adding a Completely New Test File

If you are adding a massive new feature that deserves its own test file:

1. Create a new JSON file in the `shared/fixtures/` folder (e.g., `date-test-cases.json`).
2. In your TypeScript test file, use the generic loader:

    ```typescript
    const dateFixtures = loadFixtures<MyDateType>('shared/fixtures/date-test-cases.json');
    ```

3. In your PHP test file, use the loader:

    ```php
    $dateFixtures = FixtureLoader::load('shared/fixtures/date-test-cases.json');
    ```

## 🧪 Running Tests Locally

- Run all tests (TS + PHP): `pnpm test`
- Run only TypeScript tests: `pnpm run test:ts`
- Run only PHP tests: `pnpm run test:php`

## 🎨 Code Style

We use Prettier globally for formatting. It handles TypeScript, JavaScript, JSON, Markdown, and PHP (via the [@prettier/plugin-php](https://www.npmjs.com/package/@prettier/plugin-php) plugin).

Please run `pnpm format` before committing your code to ensure the CI pipeline passes.

## 🚀 Pull Request Process

1. Fork the repository and create your branch from `main`.
2. Ensure all tests pass (`pnpm test`).
3. Ensure code is formatted (`pnpm format`).
4. Update the `README.md` if you changed any public APIs or usage examples.
5. Submit your Pull Request!
