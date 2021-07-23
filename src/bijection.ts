import { Pairs, ImageElement, DomainElement } from './utility/pairs';
import { First, Rest } from './utility/tuple';
import { BidirectionalMap } from './bidirectional_map';

type SurjectiveMap<Present, Missing> = {
  [i: number]: readonly [any, Missing];
}

type InjectiveMap<Present, Missing> = {
  [i: number]: readonly [Missing, any];
  // [I in Index<T>]: T[I] extends readonly [(Subtract<Domain<T>, Distinct<Domain<T>>> extends readonly any[] ? Subtract<Domain<T>, Distinct<Domain<T>>>[number] : never), any] ? readonly [Missing, any] : T[I];
}

//// Set utilities.

// type Somewhere<Ts, T> = Ts extends readonly [any] ? readonly [[T, any]] : readonly [[T, any], ...Rest<Ts>] | readonly [First<Ts>, ...Somewhere<Rest<Ts>, T>];

type Remove<Ts, T> = First<Ts> extends T ? Rest<Ts> : [First<Ts>, ...Remove<Rest<Ts>, T>];
type Subtract<Minuend, Subtrahend> = Subtrahend extends readonly [] ? Minuend : Subtract<Remove<Minuend, First<Subtrahend>>, Rest<Subtrahend>>;

// type AssertInjectiveness<T extends Pairs> = Distinct<Image<T>> extends Image<T> ? T : never;
type AssertSurjectiveness<T extends Pairs, Codomain> = [Codomain] extends [ImageElement<T>] ? T : SurjectiveMap<ImageElement<T>, Exclude<Codomain, ImageElement<T>>>;
// NOTE: Technically does not determine injectiveness, only if cardinality is correct.
type AssertInjectiveness<T extends Pairs, Domain> = [Domain] extends [DomainElement<T>] ? T : InjectiveMap<Extract<DomainElement<T>, Domain>, Exclude<Domain, DomainElement<T>>>;

////
// Explicit tuple builder (quickly hits instantiation depth limit).
// type BuildTuple<V, L extends number, T extends readonly any[] = readonly []> = T extends { length: L } ? T : BuildTuple<V, L, readonly [...T, V]>;

// Loose tuple builder.
// type BuildTuple<V, L extends number, T extends readonly any[] = readonly []> = readonly V[] & { length: L };

// Hybrid tuple builder with depth-limited explicit building before falling back to loose building.
// type BuildTuple<V, L extends number, DepthLimit extends number = 20, T extends readonly any[] = readonly []> = T extends { length: DepthLimit } ? readonly V[] & { length: L } : (T extends { length: L } ? T : BuildTuple<V, L, DepthLimit, readonly [...T, V]>);

// NOTE: Only <const> arrays allowed.
export function biject<Domain, Codomain>() {
  // return BidirectionalMap as new <T extends readonly (readonly [Domain[number], Codomain[number]])[]>(
  return BidirectionalMap as new <T extends readonly (readonly [Domain, Codomain])[]>(
    pairs: AssertInjectiveness<T, Domain> & AssertSurjectiveness<T, Codomain>
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
