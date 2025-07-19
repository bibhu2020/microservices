# TypeScript
Typescript is a programming language built on top of Javascripts. It was created in Microsoft to address some of the shortcoming of Javascripts. Benefits are:

- Statically typed (like C# & Java). Javascript & python are dynamically typed. Statically-typed prevents a string assigned to integer type. It means, the type is decided during compile time.
- Code Completion / Intelligence
- Refactoring
- Shorthand notations

Drawbacks:
- Transcompilation: Typescript always requires compilation to translate into javascript because still mordern browsers are not supporting typescript.
- Discipline in Coding: Requires more effort to ensure discipline.

## Setup Environment
```bash
# Install nodejs first

# Install typescript compiler package globally
sudo env "PATH=$PATH" npm install -g typescript

# Check version of Typescript compiler
tsc -v 
```

## Compile TypeScript
```
tsc index.ts

## Create the TypeScript Compipler Configuration (tsconfig.json)
tsc --init
or
npx tsc --init

```

## Data Types
JavaScript Types are: number, string, boolean, null, defined, object.
TypeScripts extends types and add more: any, unknown, never, enum, tuple


## Building a RESTAPI
```
npm install express
npm install --save-dev typescript ts-node @types/node @types/express nodemon

```

```package.json
{
  "scripts": {
    "dev": "nodemon -r ts-node/register src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}

```