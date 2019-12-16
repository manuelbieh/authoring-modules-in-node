// eslint-disable-next-line unicorn/import-index
import math from '../example-package-esm/dist/esm/index.js';
import add from '../example-package-esm/dist/esm/add.js';
import func from './legacy.cjs';

console.log(math('divide')(4, 2));
console.log(add(4, 2));
func();
