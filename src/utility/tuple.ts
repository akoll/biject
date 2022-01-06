export type First<T extends readonly unknown[]> = T extends readonly [infer First, ...unknown[]] ? First : never;
export type Rest<T extends readonly unknown[]> = T extends readonly [unknown, ...infer Rest] ? readonly [...Rest] : never;
export type Last<T extends readonly unknown[]> = T extends readonly [...unknown[], infer Last] ? Last : never;

export type Remove<Ts extends readonly unknown[], T> = First<Ts> extends T ? Rest<Ts> : [First<Ts>, ...Remove<Rest<Ts>, T>];
export type Subtract<Minuend extends readonly unknown[], Subtrahend extends readonly unknown[]> = Subtrahend extends readonly [] ? Minuend : Subtract<Remove<Minuend, First<Subtrahend>>, Rest<Subtrahend>>;

/**
 * Analogous to lodash's `initial` function.
 */
export type Initial<T> = T extends readonly [...infer Initial, unknown] ? readonly [...Initial] : never;

export type Index<T extends readonly unknown[]> = Exclude<keyof T, keyof unknown[]>;
export type IndexOf<T extends readonly unknown[], E> = {
  [I in Index<T>]: T[I] extends E ? I : never;
}[Index<T>];

// export type Distinct<T extends readonly unknown[]> = T extends readonly [] ? T : (IndexOf<Initial<T>, Last<T>> extends never ? readonly [...Distinct<Initial<T>>, Last<T>] : Distinct<Initial<T>>);
export type Distinct<T extends readonly unknown[], Accumulator extends readonly unknown[] = readonly []> = T extends readonly [] ? Accumulator : (IndexOf<Initial<T>, Last<T>> extends never ? Distinct<Initial<T>, readonly [Last<T>, ...Accumulator]> : Distinct<Initial<T>, Accumulator>);
