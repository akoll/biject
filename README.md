# biject
Type-safe compile-time bijective maps for [TypeScript](https://www.typescriptlang.org/).

[![NPM Version](https://img.shields.io/npm/v/biject.svg)](https://www.npmjs.com/package/biject)
![NPM Version](https://img.shields.io/npm/dependency-version/biject/peer/typescript)

```typescript
import { biject } from 'biject';

const example = new (biject<1 | 2, 'a' | 'b'>())(<const>[
  [2, 'a'],
  [1, 'b'],
]);

const foo: 'b' = example.map(1);
const bar: 2 = example.invert('a');
```

## Installation
```
$ npm install --save-dev biject
```
```
$ yarn add --dev biject
```

To use this package, [TypeScript](https://www.npmjs.com/package/typescript) version >= 4.1.0 is required as a peer dependency but using [TypeScript >= 4.5](https://github.com/microsoft/TypeScript/releases/tag/v4.5.2) is recommended because it supports mapping sets of bigger sizes through [tail-recursion elimination](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5/#tailrec-conditional).