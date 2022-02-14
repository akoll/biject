/**
 * A pair of two values (2-tuple).
 */
export type Pair = readonly [unknown, unknown];

/**
 * An array of pairs.
 */
export type Pairs = readonly Pair[];

/**
 * Flips the two types in a pair (2-tuple).
 * @template T The pair type to flip.
 * @returns A pair type with the two types in {@link T} swapped or `never` if {@link T} is not a valid pair.
 */
export type Flip<T> = T extends readonly [infer Left, infer Right] ? readonly [Right, Left] : never;

/**
 * Union type of possible values on the left side of an array of pairs.
 * @example DomainElement<[[1, 'a'], [2, 'b']]> // => 1 | 2
 */
export type DomainElement<T extends Pairs> = T[number][0];

/**
 * Union type of possible values on the right side of an array of pairs.
 * @example ImageElement<[[1, 'a'], [2, 'b']]> // => 'a' | 'b'
 */
export type ImageElement<T extends Pairs> = T[number][1];
