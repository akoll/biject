//// Array utilities.
type First<T> = T extends readonly [infer First, ...any] ? First : never;
type Rest<T> = T extends readonly [any, ...infer Rest] ? Rest : never;
type Last<T> = T extends readonly [...any, infer Last] ? Last : never;
/**
 * Analogous to lodash's `initial` function.
 */
type Initial<T> = T extends readonly [...infer Initial, any] ? Initial : never;

type Index<T extends readonly any[]> = Exclude<keyof T, keyof any[]>;
type IndexOf<T extends readonly any[], E> = {
  [I in Index<T>]: T[I] extends E ? I : never;
}[Index<T>];


// type Distinct<T extends readonly any[]> = T extends [] ? [] : (IndexOf<Rest<T>, First<T>> extends never ? [First<T>, ...Distinct<Rest<T>>] : Distinct<Rest<T>>);
type Distinct<T> = T extends readonly [] ? T : (IndexOf<Initial<T>, Last<T>> extends never ? [...Distinct<Initial<T>>, Last<T>] : Distinct<Initial<T>>);

//// Pair utilities.
type Pair = readonly [any, any];
type Pairs = readonly Pair[];
type Flip<T> = T extends readonly [infer Left, infer Right] ? readonly [Right, Left] : never;

type Domain<T> = T extends readonly [] ? T : (T extends readonly [readonly [infer V, any], ...any] ? readonly [V, ...Domain<Rest<T>>] : never);
type DomainElement<T extends Pairs> = T[number][0];

type Image<T> = T extends readonly [] ? T : (T extends readonly [readonly [any, infer V], ...any] ? readonly [V, ...Image<Rest<T>>] : never);
type ImageElement<T extends Pairs> = T[number][1];

type Left<T extends Pairs> = T[number][0];
type Right<T extends Pairs> = T[number][1];
// type Left<T extends Pairs> = Domain<T>[number];
// type Right<T extends Pairs> = Image<T>[number];

type ValueOf<T extends Pairs, E> = {
  [I in Exclude<keyof T, keyof any[]>]: T[I] extends readonly [E, infer V] ? V : never;
}[Index<T>];

type InverseValueOf<T extends Pairs, E> = {
  [I in Exclude<keyof T, keyof any[]>]: T[I] extends readonly [infer V, E] ? V : never;
}[Index<T>];


// type Invert<T extends Pairs> = {
//   [I in Exclude<keyof T, keyof []>]: Flip<T[I]>;
// } & Flip<T[number]>[];
type Invert<T extends Pairs> = T extends readonly [] ? T : (T extends readonly [readonly [infer Left, infer Right], ...infer Rest] ? readonly [[Right, Left], ...(Rest extends Pairs ? Invert<Rest> : never)] : never);

function invert<T extends Pairs>(pairs: T): Invert<T> {
  return pairs.map(([left, right]) => <const>[right, left]) as Invert<T>;
}

//// Bidi map.

export class BidirectionalMap<T extends Pairs> {
  private image: Map<Left<T>, Right<T>>;
  // private domain: Map<Left<Invert<T>>, Right<Invert<T>>>;
  private domain: Map<Right<T>, Left<T>>;

  constructor(pairs: T) {
    this.image = new Map(pairs);
    this.domain = new Map(invert(pairs));
  }

  getImage<Element extends Left<T>>(element: Element): ValueOf<T, Element> {
    return this.image.get(element) as ValueOf<T, Element>;
  }

  getDomain<Element extends Right<T>>(element: Element): InverseValueOf<T, Element> {
    return this.domain.get(element) as InverseValueOf<T, Element>;
  }
}

//// Set utilities.
type SurjectiveMap<Present, Missing> = {
  [i: number]: readonly [any, Missing];
}

type InjectiveMap<Present, Missing> = {
  [i: number]: readonly [Missing, any];
  // [I in Index<T>]: T[I] extends readonly [(Subtract<Domain<T>, Distinct<Domain<T>>> extends readonly any[] ? Subtract<Domain<T>, Distinct<Domain<T>>>[number] : never), any] ? readonly [Missing, any] : T[I];
}

// type Somewhere<Ts, T> = Ts extends readonly [any] ? readonly [[T, any]] : readonly [[T, any], ...Rest<Ts>] | readonly [First<Ts>, ...Somewhere<Rest<Ts>, T>];

type Remove<Ts, T> = First<Ts> extends T ? Rest<Ts> : [First<Ts>, ...Remove<Rest<Ts>, T>];
type Subtract<Minuend, Subtrahend> = Subtrahend extends readonly [] ? Minuend : Subtract<Remove<Minuend, First<Subtrahend>>, Rest<Subtrahend>>;

// type AssertInjectiveness<T extends Pairs> = Distinct<Image<T>> extends Image<T> ? T : never;
type AssertSurjectiveness<T extends Pairs, Codomain extends readonly any[]> = Codomain[number] extends ImageElement<T> ? T : SurjectiveMap<ImageElement<T>, Exclude<Codomain[number], ImageElement<T>>>;
// NOTE: Technically does not determine injectiveness, only if cardinality is correct.
type AssertInjectiveness<T extends Pairs, Definition extends readonly any[]> = Definition[number] extends DomainElement<T> ? T : InjectiveMap<DomainElement<T>,Exclude<Definition[number], DomainElement<T>>>;

////
// Explicit tuple builder (quickly hits instantiation depth limit).
// type BuildTuple<V, L extends number, T extends readonly any[] = readonly []> = T extends { length: L } ? T : BuildTuple<V, L, readonly [...T, V]>;

// Loose tuple builder.
// type BuildTuple<V, L extends number, T extends readonly any[] = readonly []> = readonly V[] & { length: L };

// Hybrid tuple builder with depth-limited explicit building before falling back to loose building.
type BuildTuple<V, L extends number, DepthLimit extends number = 20, T extends readonly any[] = readonly []> = T extends { length: DepthLimit } ? readonly V[] & { length: L } : (T extends { length: L } ? T : BuildTuple<V, L, DepthLimit, readonly [...T, V]>);

// NOTE: Only <const> arrays allowed.
export function biject<Domain extends readonly any[], Codomain extends readonly any[] & { length: Domain['length'] }>() {
  // return BidirectionalMap as new <T extends readonly (readonly [Domain[number], Codomain[number]])[]>(
  return BidirectionalMap as new <T extends BuildTuple<readonly [Domain[number], Codomain[number]], Domain['length']>>(
    pairs: AssertInjectiveness<T, Domain> & AssertSurjectiveness<T, Codomain>,
  ) => BidirectionalMap<T>;
}

// export function biject<Domain extends readonly any[], Codomain extends readonly any[] & { length: Domain['length'] }>():
//   new <T extends readonly (readonly [Domain[number], Codomain[number]])[]>(
//     pairs: T & AssertInjectiveness<T, Domain> & AssertSurjectiveness<T, Codomain>,
//   ) => BidirectionalMap<T>;
// export function biject<Domain extends Exclude<any, readonly any[]>, Codomain extends Exclude<any, readonly any[]>>():
//   new <T extends readonly (readonly [UnionToTuple<Domain>[number], UnionToTuple<Codomain>[number]])[]>(
//     pairs: T & { length: UnionToTuple<Domain>['length'] & UnionToTuple<Codomain>['length'] } & AssertInjectiveness<T, UnionToTuple<Domain>> & AssertSurjectiveness<T, UnionToTuple<Codomain>>,
//   ) => BidirectionalMap<T>;
// export function biject() {
//   return BidirectionalMap;
// }

// type Convert<T> = T extends readonly [...any] ? T : UnionToTuple<T>;
// export function biject<Domain, Codomain>() {
//   return BidirectionalMap as new <T extends readonly (readonly [Convert<Domain>[number], Convert<Codomain>[number]])[]>(
//     pairs: T & { length: Convert<Domain>['length'] & Convert<Codomain>['length'] } & AssertInjectiveness<T, Convert<Domain>> & AssertSurjectiveness<T, Convert<Codomain>>,
//   ) => BidirectionalMap<T>;
// }

////

// test.getDomain(13)

////
// TODO: Possibly check for IndexOf to return as is instead of never for arrays that don't contain it
// type Without<Ts, T> = First<Ts> extends T ? Rest<Ts> : [First<Ts>, ...Without<Rest<Ts>, T>];

// type AlleErsten<Ts, Acc = Ts> = Acc extends readonly [] ? Acc : ([
//   [Acc[0], ...Complete<Without<Ts, Acc[0]>>],
//   ...AlleErsten<Ts, Rest<Acc>>
// ]);

// type Tust = AlleErsten<[1, 2, 3, 4]>[number];

// type Complete<T> = T extends readonly [] ? T : (
//   // [T[0], ...Complete<Without<T, T[0]>>]
//   AlleErsten<T>[number]
// );

// const lel: Complete<[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]


/////

type Kek = ['a', 'b', 'c'];

enum Lel {
  FIRST,
  SECOND,
  THIRD,
}

type Test = UnionToTuple<Lel>;

// const test2 = new (biject<Kek[number], Lel>())(<const>[
//   ['a', Lel.FIRST],
//   ['b', Lel.SECOND],
//   ['c', Lel.THIRD],
// ]);

import { UnionToTuple } from './union_to_tuple';