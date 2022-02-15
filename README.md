# Biject
Type-safe compile-time bijective maps for TypeScript.

[![NPM Version](https://img.shields.io/npm/v/biject.svg)](https://www.npmjs.com/package/biject)

```typescript
import { biject } from 'biject';

const example = new (biject<1 | 2, 'a' | 'b'>())(<const>[
  [2, 'a'],
  [1, 'b'],
]);

const foo: 'b' = example.map(1);
const bar: 2 = example.invert('a');
```