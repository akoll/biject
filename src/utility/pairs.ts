import { First, Rest } from "./tuple";

export type Pair = readonly [unknown, unknown];
export type Left<T> = T extends readonly [infer E, unknown] ? E : never;
export type Right<T> = T extends readonly [unknown, infer E] ? E : never;

export type Pairs = readonly Pair[];
export type Flip<T> = T extends readonly [infer Left, infer Right] ? readonly [Right, Left] : never;

export type DomainElement<T extends Pairs> = T[number][0];
export type ImageElement<T extends Pairs> = T[number][1];

export type Domain<T extends Pairs> = T extends readonly [] ? T : readonly [Left<First<T>>, ...Domain<Rest<T> extends Pairs ? Rest<T> : never>];
export type Image<T extends Pairs> = T extends readonly [] ? T : readonly [Right<First<T>>, ...Image<Rest<T> extends Pairs ? Rest<T> : never>];
