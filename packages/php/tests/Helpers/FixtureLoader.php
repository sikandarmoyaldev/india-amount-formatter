<?php

namespace Sikandarmoyaldev\IndiaAmountFormatter\Tests\Helpers;

/**
 * Utility class to load shared JSON test fixtures.
 */
class FixtureLoader
{
    /**
     * Get the absolute path to the monorepo root.
     * (Goes up 4 levels from tests/Helpers/)
     */
    private static function getMonorepoRoot(): string
    {
        return dirname(__DIR__, 4);
    }

    /**
     * Reads and parses a shared JSON test fixture file.
     *
     * @param string $filePath The path to the JSON file, relative to the monorepo root.
     * @return array<string, array<int, array{input: array<string, mixed>, expected: string}>>
     */
    public static function load(string $filePath): array
    {
        $absolutePath = self::getMonorepoRoot() . '/' . ltrim($filePath, '/');
        $content = file_get_contents($absolutePath);

        if ($content === false) {
            throw new \RuntimeException("Could not read test fixtures file at: {$absolutePath}");
        }

        return json_decode($content, true);
    }
}
