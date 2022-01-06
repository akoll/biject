import { Pairs, ImageElement, DomainElement } from './utility/pairs';
import { First, Rest } from './utility/tuple';
import { BidirectionalMap } from './bidirectional_map';

type SurjectiveMap<Present, Missing> = readonly (readonly [unknown, Missing])[];
type InjectiveMap<Present, Missing> = readonly (readonly [Missing, unknown])[];

type Remove<Ts, T> = First<Ts> extends T ? Rest<Ts> : [First<Ts>, ...Remove<Rest<Ts>, T>];
type Subtract<Minuend, Subtrahend> = Subtrahend extends readonly [] ? Minuend : Subtract<Remove<Minuend, First<Subtrahend>>, Rest<Subtrahend>>;

type AssertSurjectiveness<T extends Pairs, Codomain> = [Codomain] extends [ImageElement<T>] ? T : SurjectiveMap<ImageElement<T>, Exclude<Codomain, ImageElement<T>>>;

// NOTE: Technically does not determine injectiveness, only if cardinality is correct.
type AssertInjectiveness<T extends Pairs, Domain> = [Domain] extends [DomainElement<T>] ? T : InjectiveMap<Extract<DomainElement<T>, Domain>, Exclude<Domain, DomainElement<T>>>;

export function biject<Domain, Codomain>() {
  return BidirectionalMap as new <T extends readonly (readonly [Domain, Codomain])[]>(
    pairs: AssertInjectiveness<T, Domain> & AssertSurjectiveness<T, Codomain>
  ) => BidirectionalMap<T>;
}
