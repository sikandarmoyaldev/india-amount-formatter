const fs = require('fs');
const path = require('path');

// 1. Read the new version that Release It just put in the ROOT package.json
const rootPackagePath = path.resolve(__dirname, '../package.json');
const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf-8'));
const newVersion = rootPackage.version;

// 2. Update the TS package.json
const tsPackagePath = path.resolve(__dirname, '../packages/ts/package.json');
const tsPackage = JSON.parse(fs.readFileSync(tsPackagePath, 'utf-8'));
tsPackage.version = newVersion;
fs.writeFileSync(tsPackagePath, JSON.stringify(tsPackage, null, 2) + '\n');

// 3. Update the PHP composer.json (NOW IN THE ROOT!)
const composerPath = path.resolve(__dirname, '../composer.json');
const composer = JSON.parse(fs.readFileSync(composerPath, 'utf-8'));
composer.version = newVersion;
fs.writeFileSync(composerPath, JSON.stringify(composer, null, 4) + '\n');

console.log(`Synced TS package and root composer.json to v${newVersion}`);
