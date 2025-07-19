// node hashkey.js generates hash key

import { randomBytes } from 'crypto';

const secret = randomBytes(64).toString('hex');
console.log(secret);
