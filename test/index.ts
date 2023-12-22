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

  it('disallows intersections on imprecise maps', () => {
    const union = 1 as 1 | 2;
    biject(
      // @ts-expect-error 2 is mapped twice.
      <const>[
        [union, 5],
        [2, 6],
      ]
    );
  });

  it('supports undefined and null', () => {
    const bijection = biject(
      <const>[
        [1, undefined],
        [2, null],
        [undefined, 3],
        [null, 4],
      ]
    );

    const element1: undefined = bijection.map(1);
    expect(element1).to.equal(undefined);
    const inverse1: 1 = bijection.invert(undefined);
    expect(inverse1).to.equal(1);

    const element2: null = bijection.map(2);
    expect(element2).to.equal(null);
    const inverse2: 2 = bijection.invert(null);
    expect(inverse2).to.equal(2);

    const element3: 3 = bijection.map(undefined);
    expect(element3).to.equal(3);
    const inverse3: undefined = bijection.invert(3);
    expect(inverse3).to.equal(undefined);

    const element4: 4 = bijection.map(null);
    expect(element4).to.equal(4);
    const inverse4: null = bijection.invert(4);
    expect(inverse4).to.equal(null);
  });

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

  it('exposes a type guard for domain elements', () => {
    const bijection = biject(
      <const>[
        [1, 'c'],
        [2, 'a'],
        [3, 2],
        [4, 'b'],
        ['5', 3],
      ]
    );

    expect(bijection.isInDomain(1)).to.be.true;
    expect(bijection.isInDomain(2)).to.be.true;
    expect(bijection.isInDomain(3)).to.be.true;
    expect(bijection.isInDomain(4)).to.be.true;
    expect(bijection.isInDomain('5')).to.be.true;
    expect(bijection.isInDomain(5)).to.be.false;
    expect(bijection.isInDomain(6)).to.be.false;
    expect(bijection.isInDomain('1')).to.be.false;
    expect(bijection.isInDomain('2')).to.be.false;
    expect(bijection.isInDomain('text')).to.be.false;
    expect(bijection.isInDomain('')).to.be.false;
    expect(bijection.isInDomain(null)).to.be.false;
    expect(bijection.isInDomain(undefined)).to.be.false;
    expect(bijection.isInDomain([1, 'c'])).to.be.false;
    expect(bijection.isInDomain(['c', 1])).to.be.false;
  });

  it('exposes a type guard for image elements', () => {
    const bijection = biject(
      <const>[
        [1, 'c'],
        [2, 'a'],
        [3, 2],
        [4, 'b'],
        ['5', 3],
      ]
    );

    expect(bijection.isInImage('a')).to.be.true;
    expect(bijection.isInImage('b')).to.be.true;
    expect(bijection.isInImage('c')).to.be.true;
    expect(bijection.isInImage(2)).to.be.true;
    expect(bijection.isInImage(3)).to.be.true;
    expect(bijection.isInImage(4)).to.be.false;
    expect(bijection.isInImage(5)).to.be.false;
    expect(bijection.isInImage('5')).to.be.false;
    expect(bijection.isInImage('d')).to.be.false;
    expect(bijection.isInImage(123)).to.be.false;
    expect(bijection.isInImage('')).to.be.false;
    expect(bijection.isInImage(null)).to.be.false;
    expect(bijection.isInImage(undefined)).to.be.false;
    expect(bijection.isInImage([1, 'c'])).to.be.false;
    expect(bijection.isInImage(['c', 1])).to.be.false;
  });

  it('handles null and undefined in type guards', () => {
    const bijection = biject(
      <const>[
        [1, 'c'],
        [undefined, 2],
        [4, null],
        ['5', 3],
      ]
    );

    expect(bijection.isInDomain(null)).to.be.false;
    expect(bijection.isInDomain(undefined)).to.be.true;
    expect(bijection.isInImage(null)).to.be.true;
    expect(bijection.isInImage(undefined)).to.be.false;
  });
});
