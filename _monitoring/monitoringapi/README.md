# Nodejs


## Common js vs ESM
CommonJS (CJS) and ECMAScript Modules (ESM) are two different module systems used in JavaScript. Here's a comparison between the two:
### CommonJS (CJS)
- Synchronous: CommonJS modules are loaded synchronously. When a module is required, the code pauses until the module is loaded and executed.
- Dynamic: Dependencies are resolved at runtime, allowing for dynamic module loading.
- Used in Node.js: CommonJS is the module system used in Node.js by default.
- Exports and require: Modules use module.exports to export values and require() to import modules.
- File Extension: CommonJS modules typically use the .js file extension.
```
// Exporting
module.exports = {
    getData: () => {
        return "Some data";
    }
};

// Importing
const model = require('./models/exampleModel');
const data = model.getData();

```
### ECMAScript Modules (ESM)
- Asynchronous: ESM supports asynchronous loading. Modules are loaded asynchronously, allowing for better performance in modern browsers and environments.
- Static: Dependencies are resolved statically at compile time, which means imports and exports are known before execution.
- Standardized by ECMAScript: ESM is part of the ECMAScript standard, which means it's supported in modern browsers and can be used in Node.js with the --experimental-modules flag or by setting "type": "module" in package.json.
- Exports and Imports: Modules use export and import statements to export and import values, respectively.
- File Extension: ESM modules typically use the .mjs file extension, although Node.js also supports .js files as ESM with the "type": "module" configuration.
```
// Exporting
export const getData = () => {
    return "Some data";
};

// Importing
import { getData } from './models/exampleModel.mjs';
const data = getData();

```

## Setting up unit testing
Install the required packages
npm install mocha chai chai-http --save-dev
