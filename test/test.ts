import { expect } from 'chai';

import { BidirectionalMap } from '../src/bidirectional_map';
import { biject } from '../src/bijection';
import { Equals } from '../src/utility/equals';


describe('biject', () => {
  it('returns the BidirectionalMap constructor', () => {
    expect(
      biject<'a' | 'b' | 'c', 1 | 2 | 3>()
    ).to.equal(BidirectionalMap);

    expect(
      biject<'kek' | 'lel' | 5 | 3.14, `${string}${number}` | 5 | 'pip' | false>()
    ).to.equal(BidirectionalMap);
  });

  it('asserts equal set cardinality', () => {
    new (
      biject<'a' | 'b', 1 | 2 | 3>()
    // @ts-expect-error Domain contains duplicates.
    )(<const>[
      ['a', 1],
      ['b', 2],
      ['a', 3],
    ]);

    new (
      biject<'a' | 'b' | 'c', 1 | 2>()
    // @ts-expect-error Image contains duplicates.
    )(<const>[
      ['a', 1],
      ['b', 2],
      ['c', 1],
    ]);
  });

  it('asserts injectiveness', () => {
    new (biject<'a' | 'b' | 'c', 1 | 2 | 3>())(
      // @ts-expect-error Given map is not injective.
      <const>[
        ['a', 1],
        ['b', 2],
        ['c', 1],
      ]
    );

    new (biject<'a' | 'b' | 'c', 1 | 2 | 3>())(
      <const>[
        ['a', 3],
        ['b', 2],
        ['c', 1],
      ]
    );
  });

  it('asserts surjectiveness', () => {
    new (biject<'a' | 'b', 1 | 2 | 3>())(
      // @ts-expect-error Given map is not surjective.
      <const>[
        ['a', 1],
        ['b', 2],
      ]
    );
  });

  it('infers the image type on <const> maps', () => {
    const bijection = new (biject<'a' | 'b' | 'c', 1 | 2 | 3>())(
      <const>[
        ['a', 3],
        ['c', 2],
        ['b', 1],
      ],
    );
    const element: 2 = bijection.map('c');
    expect(element).to.equal(2);
  });

  it('infers the domain type on <const> maps', () => {
    const bijection = new (biject<'a' | 'b' | 'c', 1 | 2 | 3>())(
      <const>[
        ['a', 3],
        ['c', 2],
        ['b', 1],
      ],
    );
    const element: 'b' = bijection.invert(1);
    expect(element).to.equal('b');
  });

  it('makes no assumptions about the image element type on non-<const> maps', () => {
    const bijection = new (biject<'a' | 'b' | 'c', 1 | 2 | 3>())(
      [
        ['a', 3],
        ['c', 2],
        ['b', 1],
      ],
    );
    const element = bijection.map('c');
    expect(element).to.equal(2);

    const elementTypeUnknown: Equals<typeof element, 1 | 2 | 3> = true;
    expect(elementTypeUnknown).to.equal(true);
  });

  it('makes no assumptions about the domain element type on non-<const> maps', () => {
    const bijection = new (biject<'a' | 'b' | 'c', 1 | 2 | 3>())(
      [
        ['a', 3],
        ['c', 2],
        ['b', 1],
      ],
    );
    const element = bijection.invert(1);
    expect(element).to.equal('b');

    const elementTypeUnknown: Equals<typeof element, 'a' | 'b' | 'c'> = true;
    expect(elementTypeUnknown).to.equal(true);
  });

  it('works with big sets', () => {
    new (biject<
      1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100,
      1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100
    >())(
      <const>[
        [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20], [21, 21], [22, 22], [23, 23], [24, 24], [25, 25], [26, 26], [27, 27], [28, 28], [29, 29], [30, 30], [31, 31], [32, 32], [33, 33], [34, 34], [35, 35], [36, 36], [37, 37], [38, 38], [39, 39], [40, 40], [41, 41], [42, 42], [43, 43], [44, 44], [45, 45], [46, 46], [47, 47], [48, 48], [49, 49], [50, 50], [51, 51], [52, 52], [53, 53], [54, 54], [55, 55], [56, 56], [57, 57], [58, 58], [59, 59], [60, 60], [61, 61], [62, 62], [63, 63], [64, 64], [65, 65], [66, 66], [67, 67], [68, 68], [69, 69], [70, 70], [71, 71], [72, 72], [73, 73], [74, 74], [75, 75], [76, 76], [77, 77], [78, 78], [79, 79], [80, 80], [81, 81], [82, 82], [83, 83], [84, 84], [85, 85], [86, 86], [87, 87], [88, 88], [89, 89], [90, 90], [91, 91], [92, 92], [93, 93], [94, 94], [95, 95], [96, 96], [97, 97], [98, 98], [99, 99], [100, 100],
      ],
    );
  });
});
