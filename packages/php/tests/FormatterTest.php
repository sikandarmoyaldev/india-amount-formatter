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
}
