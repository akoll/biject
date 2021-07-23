export type First<T> = T extends readonly [infer First, ...any] ? First : never;
export type Rest<T> = T extends readonly [any, ...infer Rest] ? Rest : never;
export type Last<T> = T extends readonly [...any, infer Last] ? Last : never;

/**
 * Analogous to lodash's `initial` function.
 */
export type Initial<T> = T extends readonly [...infer Initial, any] ? Initial : never;

export type Index<T extends readonly any[]> = Exclude<keyof T, keyof any[]>;
export type IndexOf<T extends readonly any[], E> = {
  [I in Index<T>]: T[I] extends E ? I : never;
}[Index<T>];

export type Distinct<T> = T extends readonly [] ? T : (IndexOf<Initial<T>, Last<T>> extends never ? [...Distinct<Initial<T>>, Last<T>] : Distinct<Initial<T>>);
