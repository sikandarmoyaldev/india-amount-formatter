<?php

namespace Sikandarmoyaldev\IndiaAmountFormatter\Tests;

use PHPUnit\Framework\TestCase;
use Sikandarmoyaldev\IndiaAmountFormatter\InrFormatter;
use Sikandarmoyaldev\IndiaAmountFormatter\Tests\Helpers\FixtureLoader;

/**
 * Test suite for the InrFormatter class.
 * Uses shared JSON fixtures to guarantee behavioral parity with TypeScript.
 */
class FormatterTest extends TestCase
{
    private array $fixtures;

    /**
     * Load the specific JSON file by passing the path relative to the monorepo root.
     */
    protected function setUp(): void
    {
        $this->fixtures = FixtureLoader::load('shared/fixtures/test-cases.json');
    }

    /**
     * Tests the format method against all JSON cases.
     */
    public function testFormatAmount(): void
    {
        foreach ($this->fixtures['formatAmount'] as $case) {
            $input = $case['input'];
            $expected = $case['expected'];

            // Use default prefix '₹' if not explicitly provided in the JSON
            $prefix = $input['prefix'] ?? '₹';

            $result = InrFormatter::format($input['amount'], $prefix);

            $this->assertEquals($expected, $result, 'Failed for input: ' . json_encode($input));
        }
    }

    /**
     * Tests the formatPercentage method against all JSON cases.
     */
    public function testFormatPercentage(): void
    {
        foreach ($this->fixtures['formatPercentage'] as $case) {
            $result = InrFormatter::formatPercentage($case['input']['value']);

            $this->assertEquals(
                $case['expected'],
                $result,
                'Failed for input: ' . json_encode($case['input']),
            );
        }
    }

    /**
     * Tests the formatAmountRange method against all JSON cases.
     */
    public function testFormatAmountRange(): void
    {
        foreach ($this->fixtures['formatAmountRange'] as $case) {
            $input = $case['input'];
            $prefix = $input['prefix'] ?? '₹';

            $result = InrFormatter::formatAmountRange($input['min'], $input['max'], $prefix);

            $this->assertEquals(
                $case['expected'],
                $result,
                'Failed for input: ' . json_encode($input),
            );
        }
    }

    /**
     * Tests the formatAmountWithActual method against all JSON cases.
     */
    public function testFormatAmountWithActual(): void
    {
        foreach ($this->fixtures['formatAmountWithActual'] as $case) {
            $input = $case['input'];
            $prefix = $input['prefix'] ?? '₹';

            $result = InrFormatter::formatAmountWithActual($input['amount'], $prefix);

            $this->assertEquals(
                $case['expected'],
                $result,
                'Failed for input: ' . json_encode($input),
            );
        }
    }

    /**
     * Tests the format method with the 'round' option set to true.
     * This ensures the 4999 -> 5K bug is fixed when round is false (default),
     * and correctly rounds when round is explicitly set to true.
     */
    public function testFormatAmountWithRounding(): void
    {
        $inr = new InrFormatter(['round' => true]);

        // 4999 should round to 5K when round is true
        $this->assertEquals('₹5K', $inr->format(4999));
        $this->assertEquals('₹10 Lakh', $inr->format(999999));
        $this->assertEquals('₹10 Cr', $inr->format(99999999));

        // Test method override (force truncate for this specific call)
        $this->assertEquals('₹4.99K', $inr->format(4999, '₹', ['round' => false]));
        $this->assertEquals('₹9.99 Lakh', $inr->format(999999, '₹', ['round' => false]));
    }

    /**
     * Tests the formatPercentage method with the 'round' option.
     */
    public function testFormatPercentageWithRounding(): void
    {
        $inr = new InrFormatter(['round' => true]);
        $this->assertEquals('10%', $inr->formatPercentage(9.999));
        $this->assertEquals('3.33%', $inr->formatPercentage(3.333));

        // Test method override
        $this->assertEquals('9.99%', $inr->formatPercentage(9.999, ['round' => false]));
    }
}
