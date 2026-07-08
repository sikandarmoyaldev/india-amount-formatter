const fs = require('fs');
const path = require('path');

// 1. Read the new version that Release It just put in the TS package.json
const tsPackagePath = path.resolve(__dirname, '../packages/ts/package.json');
const tsPackage = JSON.parse(fs.readFileSync(tsPackagePath, 'utf-8'));
const newVersion = tsPackage.version;

// 2. Update the PHP composer.json with that exact same version
const composerPath = path.resolve(__dirname, '../packages/php/composer.json');
const composer = JSON.parse(fs.readFileSync(composerPath, 'utf-8'));
composer.version = newVersion;
fs.writeFileSync(composerPath, JSON.stringify(composer, null, 4) + '\n');

console.log(`Synced composer.json to v${newVersion}`);
