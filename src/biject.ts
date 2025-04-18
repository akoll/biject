import { Pairs, ImageElement, DomainElement } from './utility/pairs';
import { Unique } from './utility/tuple';
import { BidirectionalMap } from './bidirectional_map';

/**
 * Removes all pairs from an array of pairs where the right-side type of the pair does not occur on the right side of any other pairs.
 * @template T The pairs array to remove from.
 * @template Current Rest parameter used for tail recursion. Should not be specified.
 * @template Accumulator Accumulator used for tail recursion. Should not be specified.
 * @returns The array type {@link T} with all pairs removed which have a non-unique right-side type.
 * @example RemoveUniqueImageElements<[[1, 'a'], [2, 'b']]> // => []
 * @example RemoveUniqueImageElements<[[1, 'a'], [2, 'b'], [3, 'a']]> // => [[1, 'a'], [3, 'a']]
 * @remarks Analogous to {@link RemoveUniqueDomainElements} but targeting the right instead of the left side of pairs.
 */
// TODO: Make more readable.
type RemoveUniqueImageElements<T extends Pairs, Current = T, Accumulator extends readonly unknown[] = readonly []> = Current extends readonly [] ? Accumulator : (Current extends readonly [infer First, ...infer Rest] ? (First extends readonly [unknown, infer Right] ? (Unique<T, readonly [unknown, Right]> extends false ? RemoveUniqueImageElements<T, Rest, [...Accumulator, First]> : RemoveUniqueImageElements<T, Rest, Accumulator>) : never) : never);

/**
 * Removes all pairs from an array of pairs where the left-side type of the pair does not occur on the left side of any other pairs.
 * @template T The pairs array to remove from.
 * @template Current Rest parameter used for tail recursion. Should not be specified.
 * @template Accumulator Accumulator used for tail recursion. Should not be specified.
 * @returns The array type {@link T} with all pairs removed which have a non-unique left-side type.
 * @example RemoveUniqueDomainElements<[[1, 'a'], [2, 'b']]> // => []
 * @example RemoveUniqueDomainElements<[[1, 'a'], [2, 'b'], [1, 'c']]> // => [[1, 'a'], [1, 'c']]
 * @remarks Analogous to {@link RemoveUniqueImageElements} but targeting the left instead of the right side of pairs.
 */
// TODO: Make more readable.
type RemoveUniqueDomainElements<T extends Pairs, Current = T, Accumulator extends readonly unknown[] = readonly []> = Current extends readonly [] ? Accumulator : (Current extends readonly [infer First, ...infer Rest] ? (First extends readonly [infer Left, unknown] ? (Unique<T, readonly [Left, unknown]> extends false ? RemoveUniqueDomainElements<T, Rest, [...Accumulator, First]> : RemoveUniqueDomainElements<T, Rest, Accumulator>) : never) : never);

/**
 * Asserts that the mapping given by a set of pairs is functional in the sense that each key (left side) maps to exactly one value (right side).
 * @template T Array of pairs to evaluate.
 * @returns Type {@link T} if the mapping is functional or an opaque object type containing an error message otherwise.
 */
type AssertFunction<T extends Pairs> = RemoveUniqueDomainElements<T> extends readonly [] ? T : {
  readonly 'The given map is not a valid function.': unique symbol;
  'Some domain elements (left side) are ambiguous (mapped more than once).': DomainElement<RemoveUniqueDomainElements<T>>;
  errors: `Domain element (left side) '${DomainElement<RemoveUniqueDomainElements<T>>}' is ambiguous (mapped more than once).`;
};

/**
 * Asserts that the mapping given by a set of pairs is injective in the sense that each value (right side) is mapped to by at most one key (left side).
 * @template T Array of pairs to evaluate.
 * @returns Type {@link T} if the mapping is injective or an opaque object type containing an error message otherwise.
 */
type AssertInjectiveness<T extends Pairs> = RemoveUniqueImageElements<T> extends readonly [] ? T : {
  readonly 'The given map is not injective.': unique symbol;
  'Some image elements (right side) are ambiguous (mapped more than once)': ImageElement<RemoveUniqueImageElements<T>>;
  errors: `Image element (right side) '${ImageElement<RemoveUniqueImageElements<T>>}' is ambiguous (mapped more than once).`;
};

/**
 * Asserts that the mapping given by a set of pairs is surjective in the sense that each type in {@link Codomain} appears on the right side of at least one mapping pair.
 * @template T Array of pairs to evaluate.
 * @template Codomain The codomain (right side) of the map given as a union of element types.
 * @returns Type {@link T} if the mapping is surjective or an opaque object type containing an error message otherwise.
 */
type AssertSurjectiveness<T extends Pairs, Codomain> = [Codomain] extends [ImageElement<T>] ? T : {
  readonly 'The given map is not surjective.': unique symbol;
  'Some image elements (right side) are missing': Exclude<Codomain, ImageElement<T>>;
  errors: `Image element (right side) '${Extract<Exclude<Codomain, ImageElement<T>>, string | number | bigint | boolean | null | undefined>}' is missing (not mapped).`;
};

/**
 * Asserts that the mapping given by a set of pairs is both injective and injective.
 * @template T Array of pairs to evaluate.
 * @template Codomain The codomain (right side) of the map given as a union of element types.
 * @returns Type {@link T} if the mapping is injective and surjective or an opaque object type containing an error message otherwise.
 */
type AssertBijectiveness<T extends Pairs, Codomain> = T extends AssertInjectiveness<T> ? AssertSurjectiveness<T, Codomain> : AssertInjectiveness<T>;

/**
 * Asserts that the size of a map given as an array of pairs can be inferred statically.
 * @template T Mapping array to evaluate for static length.
 * @returns Type {@link T} if the map size can be determined statically or an opaque object type containing an error message otherwise.
 */
type AssertFixedLength<T extends readonly unknown[]> = number extends T['length'] ? {
  readonly 'Failed to infer map size. Perhaps you are missing a const cast or the inferred types are imprecise.': unique symbol;
} : T;

/**
 * Sets up a bijective map with inferred domain and codomain types.
 * @returns A {@link BidirectionalMap} of the given bijection.
 * @example biject([[2, 'a'], [1, 'b']])
 */
export function biject<const T extends Pairs>(
  // The codomain is inferred from the given pairs, thus, a surjectiveness check is not necessary as it cannot fail.
  pairs: AssertFixedLength<T> & AssertFunction<T> & AssertInjectiveness<T>
): BidirectionalMap<T>;

/**
 * Sets up a bijective map between two given sets.
 * @template Domain The domain (left side) of the map given as a union of element types.
 * @template Codomain The codomain (right side) of the map given as a union of element types.
 * @returns A function to set up a {@link BidirectionalMap} which only allows bijective maps between {@link Domain} and {@link Codomain} to be specified.
 * @example new (biject<1 | 2, 'a' | 'b'>())([[2, 'a'], [1, 'b']])
 */
// TODO: Once https://github.com/Microsoft/TypeScript/pull/26349 is applied, remove the unnecessary double paranthesis and infer `T` alongside `Domain` and `Codomain`.
export function biject<Domain, Codomain>(): <const T extends readonly (readonly [Domain, Codomain])[]>(
  pairs: AssertFixedLength<T> & AssertFunction<T> & AssertBijectiveness<T, Codomain>
) => BidirectionalMap<T>;

export function biject<T extends Pairs>(pairs?: T) {
  if (pairs === undefined) return (pairs: T) => new BidirectionalMap(pairs);
  else return new BidirectionalMap(pairs);
}
