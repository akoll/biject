/**
 * Determines if two types are equal.
 * @template T First type to compare.
 * @template V Second type to compare.
 * @returns `true` when the two types are equal, `false` otherwise.
 */
export type Equals<T, V> = [T] extends [V] ? [V] extends [T] ? true : false : false;
