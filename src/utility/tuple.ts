import { Equals } from "./equals";

export type First<T> = T extends readonly [infer First, ...unknown[]] ? First : never;
export type Rest<T> = T extends readonly [unknown, ...infer Rest] ? Rest : never;
export type Last<T> = T extends readonly [...unknown[], infer Last] ? Last : never;

/**
 * Analogous to lodash's `initial` function.
 */
export type Initial<T> = T extends readonly [...infer Initial, unknown] ? Initial : never;

export type Index<T extends readonly unknown[]> = Exclude<keyof T, keyof unknown[]>;
export type IndexOf<T extends readonly unknown[], E> = {
  [I in Index<T>]: T[I] extends E ? I : never;
}[Index<T>];

export type Filter<T extends readonly unknown[], Criterion, Accumulator extends readonly unknown[] = readonly []> = T extends readonly [] ? Accumulator : (T extends readonly [infer First, ...infer Rest] ? (First extends Criterion ? Filter<Rest, Criterion, readonly [...Accumulator, First]> : Filter<Rest, Criterion, Accumulator>) : never);

export type Unique<T extends readonly unknown[], Criterion> = Equals<Filter<T, Criterion>['length'], 1>;

export type Distinct<T> = T extends readonly [] ? T : (IndexOf<Initial<T>, Last<T>> extends never ? [...Distinct<Initial<T>>, Last<T>] : Distinct<Initial<T>>);

export type Remove<Ts, T> = First<Ts> extends T ? Rest<Ts> : readonly [First<Ts>, ...Remove<Rest<Ts>, T>];
export type Subtract<Minuend, Subtrahend> = Subtrahend extends readonly [] ? Minuend : Subtract<Remove<Minuend, First<Subtrahend>>, Rest<Subtrahend>>;
