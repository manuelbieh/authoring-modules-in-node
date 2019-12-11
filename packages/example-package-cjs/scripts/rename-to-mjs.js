/* eslint-disable security/detect-non-literal-fs-filename */
const fs = require('fs');
const path = require('path');
const baseDir = path.resolve(__dirname, '..', 'es');

if (fs.existsSync(baseDir) === false) {
    console.log('\nNo module files found. Please run `yarn build:esm` first.\n');
    process.exit(1);
}

fs.readdirSync(baseDir).map((filename) =>
    fs.renameSync(
        path.join(baseDir, filename),
        path.join(baseDir, filename.replace(/\.js$/, '.mjs'))
    )
);
