import { describe, expect, it } from 'vitest';

import {
    formatAmount,
    formatAmountRange,
    formatAmountWithActual,
    formatPercentage,
} from '../src/index';
import { loadFixtures } from './utils/load-fixtures';

// 1. Define the exact shape of your JSON file for strict type checking
interface TestFixtures {
    formatAmount: Array<{ input: { amount: number | null; prefix?: string }; expected: string }>;
    formatPercentage: Array<{ input: { value: number | string }; expected: string }>;
    formatAmountRange: Array<{
        input: { min: number; max: number | null; prefix?: string };
        expected: string;
    }>;
    formatAmountWithActual: Array<{ input: { amount: number; prefix?: string }; expected: string }>;
}

// 2. Load the specific JSON file by passing the path relative to the monorepo root
const fixtures = loadFixtures<TestFixtures>('shared/fixtures/test-cases.json');

describe('India Amount Formatter', () => {
    describe('formatAmount', () => {
        fixtures.formatAmount.forEach(({ input, expected }) => {
            it(`should format ${input.amount} to ${expected}`, () => {
                const prefix = input.prefix || '₹';
                expect(formatAmount(input.amount, prefix)).toBe(expected);
            });
        });
    });

    describe('formatPercentage', () => {
        fixtures.formatPercentage.forEach(({ input, expected }) => {
            it(`should format ${input.value} to ${expected}`, () => {
                expect(formatPercentage(input.value)).toBe(expected);
            });
        });
    });

    describe('formatAmountRange', () => {
        fixtures.formatAmountRange.forEach(({ input, expected }) => {
            it(`should format range to ${expected}`, () => {
                const prefix = input.prefix || '₹';
                expect(formatAmountRange(input.min, input.max, prefix)).toBe(expected);
            });
        });
    });

    describe('formatAmountWithActual', () => {
        fixtures.formatAmountWithActual.forEach(({ input, expected }) => {
            it(`should format with actual to ${expected}`, () => {
                const prefix = input.prefix || '₹';
                expect(formatAmountWithActual(input.amount, prefix)).toBe(expected);
            });
        });
    });
});
