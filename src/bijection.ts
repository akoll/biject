import { Pairs, ImageElement, DomainElement } from './utility/pairs';
import { First, Rest, Unique } from './utility/tuple';
import { BidirectionalMap } from './bidirectional_map';

type Remove<Ts, T> = First<Ts> extends T ? Rest<Ts> : [First<Ts>, ...Remove<Rest<Ts>, T>];
type Subtract<Minuend, Subtrahend> = Subtrahend extends readonly [] ? Minuend : Subtract<Remove<Minuend, First<Subtrahend>>, Rest<Subtrahend>>;

// NOTE: Technically does not determine injectiveness, only if cardinality is correct.
// type AssertInjectiveness<T extends Pairs, Domain> = [Domain] extends [DomainElement<T>] ? T : InjectiveMap<Extract<DomainElement<T>, Domain>, Exclude<Domain, DomainElement<T>>>;

type RemoveUniqueImageElements<T extends Pairs, Current = T, Accumulator extends readonly unknown[] = readonly []> = Current extends readonly [] ? Accumulator : (Current extends readonly [infer First, ...infer Rest] ? (First extends readonly [unknown, infer Right] ? (Unique<T, readonly [unknown , Right]> extends false ? RemoveUniqueImageElements<T, Rest, [...Accumulator, First]> : RemoveUniqueImageElements<T, Rest, Accumulator>) : never) : never);
type RemoveUniqueDomainElements<T extends Pairs, Current = T, Accumulator extends readonly unknown[] = readonly []> = Current extends readonly [] ? Accumulator : (Current extends readonly [infer First, ...infer Rest] ? (First extends readonly [infer Left, unknown] ? (Unique<T, readonly [Left, unknown]> extends false ? RemoveUniqueDomainElements<T, Rest, [...Accumulator, First]> : RemoveUniqueDomainElements<T, Rest, Accumulator>) : never) : never);

type AssertFunction<T extends Pairs> = RemoveUniqueDomainElements<T> extends readonly [] ? T : {
  'Some domain elements (left side) are ambiguous (mapped more than once)': DomainElement<RemoveUniqueDomainElements<T>>;
};

type AssertInjectiveness<T extends Pairs> = RemoveUniqueImageElements<T> extends readonly [] ? T : {
  'Some image elements (right side) are ambiguous (mapped more than once)': ImageElement<RemoveUniqueImageElements<T>>;
};

type AssertSurjectiveness<T extends Pairs, Codomain> = [Codomain] extends [ImageElement<T>] ? T : {
  'Some image elements are missing (function is not surjective)': Exclude<Codomain, ImageElement<T>>;
};

export function biject<Domain, Codomain>() {
  return BidirectionalMap as new <T extends readonly (readonly [Domain, Codomain])[]>(
    pairs: AssertFunction<T> & AssertInjectiveness<T> & AssertSurjectiveness<T, Codomain>
  ) => BidirectionalMap<T>;
}
