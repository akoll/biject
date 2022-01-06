import type { Pairs, ImageElement, DomainElement, Domain, Image } from './utility/pairs';
import type { Distinct } from './utility/tuple';
import { BidirectionalMap } from './bidirectional_map';
import type { Equals } from './utility/equals';

type SurjectiveMap<Present, Missing> = readonly (readonly [unknown, Missing])[];
type InjectiveMap<Present, Missing> = readonly (readonly [Missing, unknown])[];

type AssertSet<T extends readonly unknown[]> = Equals<T, Distinct<T>>;
type AssertEqualCardinality<T extends Pairs> =
  AssertSet<Domain<T>> extends false ? 'Domain is not a valid set (contains duplicates).' :
  AssertSet<Image<T>> extends false ? 'Image is not a valid set (contains duplicates).' : T;

type AssertSurjectiveness<T extends Pairs, Codomain> = [Codomain] extends [ImageElement<T>] ? T : SurjectiveMap<ImageElement<T>, Exclude<Codomain, ImageElement<T>>>;

// NOTE: Technically does not determine injectiveness, only if cardinality is correct.
type AssertInjectiveness<T extends Pairs, Domain> = [Domain] extends [DomainElement<T>] ? T : InjectiveMap<Extract<DomainElement<T>, Domain>, Exclude<Domain, DomainElement<T>>>;

export function biject<Domain, Codomain>() {
  return BidirectionalMap as new <T extends readonly (readonly [Domain, Codomain])[]>(
    pairs: AssertEqualCardinality<T> &  AssertInjectiveness<T, Domain> & AssertSurjectiveness<T, Codomain>
  ) => BidirectionalMap<T>;
}
