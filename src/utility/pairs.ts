//// Pair utilities.
export type Pair = readonly [any, any];
export type Pairs = readonly Pair[];
type Flip<T> = T extends readonly [infer Left, infer Right] ? readonly [Right, Left] : never;

export type Domain<T> = T extends readonly [] ? T : (T extends readonly [readonly [infer V, any], ...any] ? readonly [V, ...Domain<Rest<T>>] : never);
export type DomainElement<T extends Pairs> = T[number][0];

export type Image<T> = T extends readonly [] ? T : (T extends readonly [readonly [any, infer V], ...any] ? readonly [V, ...Image<Rest<T>>] : never);
export type ImageElement<T extends Pairs> = T[number][1];

// type Left<T extends Pairs> = Domain<T>[number];
// type Right<T extends Pairs> = Image<T>[number];
export type Left<T extends Pairs> = T[number][0];
export type Right<T extends Pairs> = T[number][1];
