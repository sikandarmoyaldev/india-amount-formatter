import { describe, expect, it } from 'vitest';

import {
    formatAmount,
    formatAmountRange,
    formatAmountWithActual,
    formatPercentage,
    InrFormatter,
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
    describe('formatAmount (Standalone)', () => {
        fixtures.formatAmount.forEach(({ input, expected }) => {
            it(`should format ${input.amount} to ${expected}`, () => {
                const prefix = input.prefix || '₹';
                expect(formatAmount(input.amount, prefix)).toBe(expected);
            });
        });
    });

    describe('formatPercentage (Standalone)', () => {
        fixtures.formatPercentage.forEach(({ input, expected }) => {
            it(`should format ${input.value} to ${expected}`, () => {
                expect(formatPercentage(input.value)).toBe(expected);
            });
        });
    });

    describe('formatAmountRange (Standalone)', () => {
        fixtures.formatAmountRange.forEach(({ input, expected }) => {
            it(`should format range to ${expected}`, () => {
                const prefix = input.prefix || '₹';
                expect(formatAmountRange(input.min, input.max, prefix)).toBe(expected);
            });
        });
    });

    describe('formatAmountWithActual (Standalone)', () => {
        fixtures.formatAmountWithActual.forEach(({ input, expected }) => {
            it(`should format with actual to ${expected}`, () => {
                const prefix = input.prefix || '₹';
                expect(formatAmountWithActual(input.amount, prefix)).toBe(expected);
            });
        });
    });

    describe('InrFormatter Class', () => {
        it('should truncate by default (fix 4999 bug)', () => {
            const inr = new InrFormatter();
            expect(inr.formatAmount(4999)).toBe('₹4.99K');
            expect(inr.formatAmount(999999)).toBe('₹9.99 Lakh');
            expect(inr.formatPercentage(9.999)).toBe('9.99%');
        });

        it('should round when round: true is passed in constructor', () => {
            const inr = new InrFormatter({ round: true });
            expect(inr.formatAmount(4999)).toBe('₹5K');
            expect(inr.formatAmount(999999)).toBe('₹10 Lakh');
            expect(inr.formatPercentage(9.999)).toBe('10%');
        });

        it('should allow method-level override for round option', () => {
            const inr = new InrFormatter({ round: true });

            // Override to truncate
            expect(inr.formatAmount(4999, '₹', { round: false })).toBe('₹4.99K');
            expect(inr.formatPercentage(9.999, { round: false })).toBe('9.99%');

            const inrTruncate = new InrFormatter({ round: false });

            // Override to round
            expect(inrTruncate.formatAmount(4999, '₹', { round: true })).toBe('₹5K');
            expect(inrTruncate.formatPercentage(9.999, { round: true })).toBe('10%');
        });

        it('should format ranges and actual amounts correctly with class instance', () => {
            const inr = new InrFormatter();
            expect(inr.formatAmountRange(4999, 9999)).toBe('₹4.99K - ₹9.99K');
            expect(inr.formatAmountWithActual(4999)).toBe('₹4.99K (₹4,999)');
            expect(inr.formatAmountWithActual(999999)).toBe('₹9.99 Lakh (₹9,99,999)');
        });
    });
});
