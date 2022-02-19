import { expect } from 'chai';
import { biject } from '../src/biject';
import { Equals } from '../src/utility/equals';
import bigMaps from './big_maps';

describe('biject', () => {
  it('asserts map to be a valid function', () => {
    biject(
      // @ts-expect-error Given map is not a valid function.
      <const>[
        [1, 'c'],
        [2, 'a'],
        [1, 'b'],
      ]
    );

    biject<1 | 2, 'a' | 'b' | 'c'>()(
      // @ts-expect-error Given map is not a valid function.
      <const>[
        [1, 'c'],
        [2, 'a'],
        [1, 'b'],
      ]
    );

    biject(
      // @ts-expect-error Given map is not a valid function.
      <const>[
        [1, 'c'],
        [2, 'a'],
        [3, 'e'],
        [1, 'b'],
        [3, 'd'],
      ]
    );

    biject<1 | 2 | 3, 'a' | 'b' | 'c' | 'd' | 'e'>()(
      // @ts-expect-error Given map is not a valid function.
      <const>[
        [1, 'c'],
        [2, 'a'],
        [3, 'e'],
        [1, 'b'],
        [3, 'd'],
      ]
    );
  });

  it('asserts injectiveness', () => {
    biject(
      // @ts-expect-error Given map is not injective.
      <const>[
        ['a', 1],
        ['b', 2],
        ['c', 1],
      ]
    );

    biject<'a' | 'b' | 'c', 1 | 2 | 3>()(
      // @ts-expect-error Given map is not injective.
      <const>[
        ['a', 1],
        ['b', 2],
        ['c', 1],
      ]
    );

    biject(
      // @ts-expect-error Given map is not injective.
      <const>[
        ['a', 1],
        ['b', 2],
        ['c', 1],
      ]
    );

    biject<'a' | 'b' | 'c', 1 | 2>()(
      // @ts-expect-error Given map is not injective.
      <const>[
        ['a', 1],
        ['b', 2],
        ['c', 1],
      ]
    );

    biject(
      <const>[
        ['a', 3],
        ['b', 2],
        ['c', 1],
      ]
    );

    biject<'a' | 'b' | 'c', 1 | 2 | 3>()(
      <const>[
        ['a', 3],
        ['b', 2],
        ['c', 1],
      ]
    );
  });

  it('asserts surjectiveness when codomain is given', () => {
    biject<'a' | 'b', 1 | 2 | 3>()(
      // @ts-expect-error Given map is not surjective.
      <const>[
        ['a', 1],
        ['b', 2],
      ]
    );
  });

  it('enforces statically known map sizes', () => {
    biject(
      // @ts-expect-error Array is not <const>.
      [
        [1, 'a'],
        [2, 'b'],
      ]
    );

    biject<1 | 2, 'a' | 'b'>()(
      // @ts-expect-error Array is not <const>.
      [
        [1, 'a'],
        [2, 'b'],
      ]
    );

    biject(
      <const>[
        [1, 'a'],
        [2, 'b'],
      ]
    );

    biject<1 | 2, 'a' | 'b'>()(
      <const>[
        [1, 'a'],
        [2, 'b'],
      ]
    );
  });

  it('returns unknown on imprecise maps', () => {
    const union: 1 | 2 = 1;
    const bijection = biject(
      <const>[
        [union, 5],
      ]
    );
    const element = bijection.map(1);
    const elementUnknown: Equals<typeof element, unknown> = true;
    expect(elementUnknown).to.equal(true);
  });

  it('supports null and undefined');

  it('infers the image type', () => {
    const bijection = biject<'a' | 'b' | 'c', 1 | 2 | 3>()(
      <const>[
        ['a', 3],
        ['c', 2],
        ['b', 1],
      ],
    );
    const element: 2 = bijection.map('c');
    expect(element).to.equal(2);
  });

  it('infers the domain type', () => {
    const bijection = biject<'a' | 'b' | 'c', 1 | 2 | 3>()(
      <const>[
        ['a', 3],
        ['c', 2],
        ['b', 1],
      ],
    );
    const element: 'b' = bijection.invert(1);
    expect(element).to.equal('b');
  });

  bigMaps();
});
