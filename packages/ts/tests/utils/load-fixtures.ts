import * as fs from 'fs';
import * as path from 'path';

// Calculate the monorepo root (goes up 4 levels from tests/utils/)
const MONOREPO_ROOT = path.resolve(__dirname, '../../../..');

/**
 * Reads and parses a shared JSON test fixture file.
 *
 * @template T The expected shape of the JSON data.
 * @param filePath The path to the JSON file, relative to the monorepo root.
 * @returns The parsed test fixtures object cast to type T.
 */
export function loadFixtures<T = Record<string, any>>(filePath: string): T {
    const absolutePath = path.join(MONOREPO_ROOT, filePath);
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    return JSON.parse(fileContent) as T;
}
