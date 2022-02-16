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
type RemoveUniqueImageElements<T extends Pairs, Current = T, Accumulator extends readonly unknown[] = readonly []> = Current extends readonly [] ? Accumulator : (Current extends readonly [infer First, ...infer Rest] ? (First extends readonly [unknown, infer Right] ? (Unique<T, readonly [unknown , Right]> extends false ? RemoveUniqueImageElements<T, Rest, [...Accumulator, First]> : RemoveUniqueImageElements<T, Rest, Accumulator>) : never) : never);

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
// TODO: Interpolate the violations into the error message's key (and make the value type `unique symbol`).
type AssertFunction<T extends Pairs> = RemoveUniqueDomainElements<T> extends readonly [] ? T : {
  readonly 'The given map is not a valid function.': unique symbol;
  'Some domain elements (left side) are ambiguous (mapped more than once)': DomainElement<RemoveUniqueDomainElements<T>>;
};

/**
 * Asserts that the mapping given by a set of pairs is injective in the sense that each value (right side) is mapped to by at most one key (left side).
 * @template T Array of pairs to evaluate.
 * @returns Type {@link T} if the mapping is injective or an opaque object type containing an error message otherwise.
 */
// TODO: Interpolate the violations into the error message's key (and make the value type `unique symbol`).
type AssertInjectiveness<T extends Pairs> = RemoveUniqueImageElements<T> extends readonly [] ? T : {
  readonly 'The given map is not injective.': unique symbol;
  'Some image elements (right side) are ambiguous (mapped more than once)': ImageElement<RemoveUniqueImageElements<T>>;
};

/**
 * Asserts that the mapping given by a set of pairs is surjective in the sense that each type in {@link Codomain} appears on the right side of at least one mapping pair.
 * @template T Array of pairs to evaluate.
 * @returns Type {@link T} if the mapping is surjective or an opaque object type containing an error message otherwise.
 */
// TODO: Interpolate the violations into the error message's key (and make the value type `unique symbol`).
type AssertSurjectiveness<T extends Pairs, Codomain> = [Codomain] extends [ImageElement<T>] ? T : {
  readonly 'The given map is not surjective.': unique symbol;
  'Some image elements are missing (function is not surjective)': Exclude<Codomain, ImageElement<T>>;
};

/**
 * Sets up a bijective map.
 * @returns A {@link BidirectionalMap} of the given bijection.
 * @example new (biject())(<const>[[2, 'a'], [1, 'b']])
 */
export function biject<T extends Pairs>(
  pairs: AssertFunction<T> & AssertInjectiveness<T> & AssertSurjectiveness<T, ImageElement<T>>
): BidirectionalMap<T>;

/**
 * Sets up a bijective map between two given sets.
 * @template Domain The domain (left side) of the map given as a union of element types.
 * @template Codomain The codomain (right side) of the map given as a union of element types.
 * @returns A function to set up a {@link BidirectionalMap} which only allows bijective maps between {@link Domain} and {@link Codomain} to be specified.
 * @example new (biject<1 | 2, 'a' | 'b'>())(<const>[[2, 'a'], [1, 'b']])
 */
// TODO: Once https://github.com/Microsoft/TypeScript/pull/26349 is applied, remove the unnecessary double paranthesis and infer `T` alongside `Domain` and `Codomain`.
export function biject<Domain, Codomain>(): <T extends readonly (readonly [Domain, Codomain])[]>(
  pairs: AssertFunction<T> & AssertInjectiveness<T> & AssertSurjectiveness<T, Codomain>
) => BidirectionalMap<T>;

export function biject<T extends Pairs>(pairs?: T) {
  if (pairs === undefined) return <T extends Pairs>(t: T) => new BidirectionalMap(t);
  else return new BidirectionalMap(pairs);
}
