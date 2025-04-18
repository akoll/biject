# biject
Type-safe compile-time bijective maps for [TypeScript](https://www.typescriptlang.org/).

[![NPM Version](https://img.shields.io/npm/v/biject.svg)](https://www.npmjs.com/package/biject)
![NPM Version](https://img.shields.io/npm/dependency-version/biject/peer/typescript)

```typescript
import { biject } from 'biject';

const example = biject<1 | 2, 'a' | 'b'>()(
  [
    [2, 'a'],
    [1, 'b'],
  ]
);

const foo: 'b' = example.map(1);
const bar: 2 = example.invert('a');
```

## Installation
```
$ npm install --save biject
```
```
$ yarn add biject
```

To use this package, [TypeScript](https://www.npmjs.com/package/typescript) version >= 4.1.0 is required as a peer dependency but using [TypeScript >= 4.5](https://github.com/microsoft/TypeScript/releases/tag/v4.5.2) is recommended because it supports mapping sets of bigger sizes through [tail-recursion elimination](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5/#tailrec-conditional).  

If you plan on mapping `undefined` or `null` values, make sure [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) is enabled to avoid them being inferred as `any`.

## Usage
```typescript
import { biject } from 'biject';

const example = biject([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

// The map can be used both ways.
example.map(2) // -> 'two'
example.invert('two') // -> 2
```

Maps that are not bijective will throw compilation errors.
```typescript
// Fails at compile-time.
biject([
  [1, 'a'],
  [1, 'b'],
]);

// Fails at compile-time.
biject([
  [1, 'a'],
  [2, 'a'],
]);
```

The type of query operations is known at compile-time.
```typescript
const example = biject([
  ['kek', 3141],
  ['lel', 5],
  ['pip', 927],
]);

// Compiles without error.
const five: 5 = example.map('lel');
const kek: 'kek' = example.invert(3141);

(element: 'kek' | 'pip') => {
  const mapsTo: 3141 | 927 = example.map(element);
}
```
> :warning: Correct type inferrence only works if the type of the map given to `biject` exactly represents its run-time value.
> Make sure to not reference any values that TypeScript infers as unions.  
> :x: Avoid:
> ```typescript
> // Bad.
> const union = 1 as 1 | 2;
> biject([[union, 3]]);
> ```
> This might lead to run-time errors.
>
> If you are using [TypeScript < 5.0](https://github.com/microsoft/TypeScript/releases/tag/v5.0.2), the input must be explicitly marked `as const`.
> ```typescript
> biject([[1, "a"], [2, "b"]] as const)
> ```
> Since the introduction of [const type parameters](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#const-type-parameters), this is not required anymore.

### Type-guards
To check if a value is part of the map's domain or codomain (image), there are type-guards available.
```typescript
// Define the bijection.
const example = biject([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);

// Get an unknown value from somewhere.
const element: unknown = document.getElementById('input').value;

if (example.isInDomain(element)) {
  // The `element` can now be used in `.map`.
  example.map(element);
}

if (example.isInImage(element)) {
  // The `element` can now be used in `.invert`.
  example.invert(element);
}
```

### Specifying sets
The domain and codomain sets can explicitly be set as unions of elements. This will ensure that the mapping is complete and no elements have been forgotten.
```typescript
type Domain = 1 | 2 | 3;
type Codomain = 'a' | 'b' | 'c';

// Fails at compile-time.
biject<Domain, Codomain>()(
  [
    [1, 'c'],
    [3, 'a'],
  ]
);

// Fails at compile-time.
biject<Domain, Codomain>()(
  [
    [1, 'c'],
    [1, 'b'],
    [3, 'a'],
  ]
);

// Compiles without error.
biject<Domain, Codomain>()(
  [
    [1, 'c'],
    [2, 'b'],
    [3, 'a'],
  ]
);
```
> :warning: Note the extra parenthesis in `biject<...>()(...`. This is due to a [restriction in TypeScript's type parameter inferrence](https://github.com/microsoft/TypeScript/issues/10571).
