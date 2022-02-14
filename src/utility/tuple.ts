import { Equals } from "./equals";

/**
 * Type of the first element in a tuple type.
 * @template T Tuple to get the first element type of.
 * @returns Type of the first element in {@link T} or `never` if {@link T} is not a valid tuple type.
 */
export type First<T> = T extends readonly [infer First, ...unknown[]] ? First : never;

/**
 * Tuple type without the first element.
 * @template T Tuple type to remove the first element type from.
 * @returns Tuple type that is {@link T} but with the first element removed or `never` if {@link T} is not a valid tuple type.
 */
export type Rest<T> = T extends readonly [unknown, ...infer Rest] ? Rest : never;

/**
 * Type of the last element in a tuple type.
 * @template T Tuple type to get the last element type of.
 * @returns Type of the last element in {@link T} or `never` if {@link T} is not a valid tuple type.
 */
export type Last<T> = T extends readonly [...unknown[], infer Last] ? Last : never;

/**
 * Tuple type without the last element.
 * @template T Tuple type to remove the last element type from.
 * @returns Tuple type that is {@link T} but with the last element removed or `never` if {@link T} is not a valid tuple type.
 * @remarks Analogous to lodash's `initial` function.
 */
export type Initial<T> = T extends readonly [...infer Initial, unknown] ? Initial : never;

/**
 * Index type of a tuple type.
 * @template T Tuple type to determine the index type of.
 * @returns Index type of {@link T}.
 * @example Index<['a', 'b', 'c']> // => '0' | '1' | '2'
 */
export type Index<T extends readonly unknown[]> = Exclude<keyof T, keyof unknown[]>;

/**
 * Index of an element type within a tuple type.
 * @template T Tuple type to determine the index in.
 * @template E Element type to determine the index of.
 * @returns Index of {@link E} in {@link T} (union if {@link E} occurs multiple times).
 * @example IndexOf<['a', 'b', 'c'], 'b'> // => '1'
 * @example IndexOf<['a', 'b', 'c', 'b', 'd'], 'b'> // => '1' | '3'
 */
export type IndexOf<T extends readonly unknown[], E> = {
  [I in Index<T>]: T[I] extends E ? I : never;
}[Index<T>];

/**
 * Filters a tuple type with a given predicate type. Element types that do not extend the predicate criterion are removed.
 * @template T Tuple type to filter.
 * @template Criterion Predicate type to filter with.
 * @example Filter<[1, 2, 3], 2> // => [2]
 * @example Filter<[1, 2, 3, 4], 2 | 3> // => [2, 3]
 * @example Filter<[true, 5, 'foo', false, 3.14], boolean> // => [true, false]
 * @example Filter<[true, 5, 'foo', false, 3.14], boolean | number> // => [true, 5, false, 3.14]
 */
export type Filter<T extends readonly unknown[], Criterion, Accumulator extends readonly unknown[] = readonly []> = T extends readonly [] ? Accumulator : (T extends readonly [infer First, ...infer Rest] ? (First extends Criterion ? Filter<Rest, Criterion, readonly [...Accumulator, First]> : Filter<Rest, Criterion, Accumulator>) : never);

/**
 * Determines if a predicate type is extended exactly once in a tuple type.
 * @template T The tuple type to search in.
 * @template Criterion Predicate type to search for.
 * @returns Whether exactly one element type on {@link T} extends {@link Criterion}.
 */
export type Unique<T extends readonly unknown[], Criterion> = Equals<Filter<T, Criterion>['length'], 1>;

/**
 * Tuple type with its duplicates removed.
 * @template T  Tuple type to remove duplicates of.
 * @returns Tuple type {@link T} without duplicates or {@link never} if {@link T} is not a valid tuple type.
 */
export type Distinct<T> = T extends readonly [] ? T : (IndexOf<Initial<T>, Last<T>> extends never ? [...Distinct<Initial<T>>, Last<T>] : Distinct<Initial<T>>);

/**
 * Removes element types from a tuple type.
 * @template Ts Tuple type to remove from.
 * @template T Predicate type to remove.
 * @returns Tuple type {@link Ts} with all elements removed that extend {@link T}.
 */
export type Remove<Ts, T> = First<Ts> extends T ? Rest<Ts> : readonly [First<Ts>, ...Remove<Rest<Ts>, T>];

/**
 * Subtracts a tuple type from another tuple type.
 * @template Minuend Tuple type to subtract from.
 * @template Subtrahend Tuple type to subtract.
 * @example Subtract<[1, 2, 3], [2]> // => [1, 3]
 * @example Subtract<[1, 2, 3, 2, 4], [2]> // => [1, 3, 2, 4]
 * @example Subtract<[1, 2, 3, 2, 4], [2, 1]> // => [3, 2, 4]
 * @example Subtract<[1, 2, 3, 2, 4], [1, 2, 3]> // => [2, 3]
 */
export type Subtract<Minuend, Subtrahend> = Subtrahend extends readonly [] ? Minuend : Subtract<Remove<Minuend, First<Subtrahend>>, Rest<Subtrahend>>;
