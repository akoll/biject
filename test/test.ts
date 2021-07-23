import { expect } from 'chai';

import { BidirectionalMap } from '../src/bidirectional_map';
import { biject } from '../src/bijection';

describe('biject', () => {
    it('returns the BidirectionalMap constructor', () => {
        const constructor1 = biject<'a' | 'b' | 'c', 1 | 2 | 3>();
        expect(constructor1).to.equal(BidirectionalMap);

        const constructor2 = biject<'kek' | 'lel' | 5 | 3.14, `${string}${number}` | 5 | 'pip' | false>();
        expect(constructor2).to.equal(BidirectionalMap);
    });

    it('infers the image type on <const> maps', () => {
        const bijection = new (biject<'a' | 'b' | 'c', 1 | 2 | 3>())(
            <const>[
                ['a', 3],
                ['c', 2],
                ['b', 1],
            ]
        );
        const element: 2 = bijection.getImage('c');
        expect(element).to.equal(2);
    });

    it('infers the domain type on <const> maps', () => {
        const bijection = new (biject<'a' | 'b' | 'c', 1 | 2 | 3>())(
            <const>[
                ['a', 3],
                ['c', 2],
                ['b', 1],
            ]
        );
        const element: 'b' = bijection.getDomain(1);
        expect(element).to.equal('b');
    });

    it('makes no assumptions about the image type on non-<const> maps', () => {
        const bijection = new (biject<'a' | 'b' | 'c', 1 | 2 | 3>())(
            [
                ['a', 3],
                ['c', 2],
                ['b', 1],
            ]
        );
        const element = bijection.getImage('c');
        expect(element).to.equal(2);

        type IsUnknown<T> = T extends unknown ? unknown extends T ? true : false : false;
        const elementTypeUnknown: IsUnknown<typeof element> = true;
        expect(elementTypeUnknown).to.equal(true)
    });

    it('makes no assumptions about the domain type on non-<const> maps', () => {
        const bijection = new (biject<'a' | 'b' | 'c', 1 | 2 | 3>())(
            [
                ['a', 3],
                ['c', 2],
                ['b', 1],
            ]
        );
        const element = bijection.getDomain(1);
        expect(element).to.equal('b');

        type IsUnknown<T> = T extends unknown ? unknown extends T ? true : false : false;
        const elementTypeUnknown: IsUnknown<typeof element> = true;
        expect(elementTypeUnknown).to.equal(true)
    });
});
