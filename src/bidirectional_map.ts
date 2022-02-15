import { DomainElement, ImageElement, Pairs } from './utility/pairs';
import { Index } from './utility/tuple';

/**
 * Inverts a tuple of pairs by flipping each pair (swapping the left and right element types).
 * @template T Tuple type of pairs to invert.
 * @returns Tuple type of pairs with each pair flipped (types of left and right element swapped).
 * @example Invert<[[1, 'a'], [2, 'b']]> // => [['a', 1], ['b', 2]]
 * @example Invert<[[string, boolean], [number, string]]> // => [[boolean, string], [string, number]]
 */
type Invert<T extends Pairs> = T extends readonly [] ? T : (T extends readonly [readonly [infer Left, infer Right], ...infer Rest] ? readonly [[Right, Left], ...(Rest extends Pairs ? Invert<Rest> : never)] : never);

/**
 * Inverts pairs (swaps left and right side of each pair).
 * @template T Type of pairs to invert.
 * @param pairs Pairs to invert.
 * @returns The pairs inverted (left and right side of each pair swapped).
 * @example invert([[1, 'a'], [2, 'b']]) // => [['a', 1], ['b', 2]]
 */
function invert<T extends Pairs>(pairs: T): Invert<T> {
  return pairs.map(([left, right]) => <const>[right, left]) as Invert<T>;
}

/**
 * Converts one type to another if it matches a condition.
 * @template T Type to convert.
 * @template From Type to convert from. Conversion only happens when {@link T} extends {@link From}.
 * @template To Type to convert to if {@link T} extends {@link From}.
 * @returns Type {@link To} if {@link T} extends {@link From} or {@link T} otherwise.
 */
type Convert<T, From, To> = [T] extends [From] ? To : T;

/**
 * Determines the corresponding right side (value) types of pairs with the given left side (key) type.
 * @template T Pairs to search in.
 * @template E Key (pair's left side) type to search for.
 * @returns Union of value types (right sides) of pairs containing the key (left side) type {@link E}.
 */
type ValueOf<T extends Pairs, E> = Convert<{
  [I in Exclude<keyof T, keyof unknown[]>]: T[I] extends readonly [E, infer V] ? V : never;
}[Index<T>], never, ImageElement<T>>;

/**
 * Determines the corresponding left side (key) types of pairs with the given right side (value) type.
 * @template T Pairs to search in.
 * @template E Value (pair's right side) type to search for.
 * @returns Union of key types (left sides) of pairs containing the value (right side) type {@link E}.
 */
type InverseValueOf<T extends Pairs, E> = Convert<{
  [I in Exclude<keyof T, keyof unknown[]>]: T[I] extends readonly [infer V, E] ? V : never;
}[Index<T>], never, DomainElement<T>>;

/**
 * Map that supports querying in both directions.
 * @template T Type of the map's pair array.
 */
export class BidirectionalMap<T extends Pairs> {
  /**
   * Underlying map from left to right.
   * @remarks Sets up querying from the input pairs' left side to its right side.
   */
  private image: Map<DomainElement<T>, ImageElement<T>>;

  /**
   * Underlying map from right to left.
   * @remarks Sets up querying from the input pairs' right side to its left side.
   */
  private domain: Map<ImageElement<T>, DomainElement<T>>;

  /**
   * @param pairs Array of pairs to construct the map with.
   */
  constructor(pairs: T) {
    this.image = new Map<DomainElement<T>, ImageElement<T>>(pairs);
    this.domain = new Map<ImageElement<T>, DomainElement<T>>(invert(pairs));
  }

  /**
   * Gets the right-side value associated to the left-side value {@link element}.
   * @param element Left-side element to search for.
   * @returns The right-side value associated to the left-side value {@link element}.
   */
  map<Element extends DomainElement<T>>(element: Element): ValueOf<T, Element> {
    return this.image.get(element) as ValueOf<T, Element>;
  }

  /**
   * Gets the left-side value associated to the right-side value {@link element}.
   * @param element Right-side element to search for.
   * @returns The left-side value associated to the right-side value {@link element}.
   */
  invert<Element extends ImageElement<T>>(element: Element): InverseValueOf<T, Element> {
    return this.domain.get(element) as InverseValueOf<T, Element>;
  }
}
