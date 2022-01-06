import { DomainElement, ImageElement, Pairs } from './utility/pairs';
import { Index } from './utility/tuple';

// type Invert<T extends Pairs> = {
//   [I in Exclude<keyof T, keyof []>]: Flip<T[I]>;
// } & Flip<T[number]>[];
type Invert<T extends Pairs> = T extends readonly [] ? T : (T extends readonly [readonly [infer Left, infer Right], ...infer Rest] ? readonly [[Right, Left], ...(Rest extends Pairs ? Invert<Rest> : never)] : never);

function invert<T extends Pairs>(pairs: T): Invert<T> {
  return pairs.map(([left, right]) => <const>[right, left]) as Invert<T>;
}

type Convert<T, From, To> = [T] extends [From] ? To : T;

type ValueOf<T extends Pairs, E> = Convert<{
  [I in Exclude<keyof T, keyof unknown[]>]: T[I] extends readonly [E, infer V] ? V : never;
}[Index<T>], never, ImageElement<T>>;

type InverseValueOf<T extends Pairs, E> = Convert<{
  [I in Exclude<keyof T, keyof unknown[]>]: T[I] extends readonly [infer V, E] ? V : never;
}[Index<T>], never, DomainElement<T>>;

export class BidirectionalMap<T extends Pairs> {
  private image: Map<DomainElement<T>, ImageElement<T>>;
  private domain: Map<ImageElement<T>, DomainElement<T>>;

  constructor(pairs: T) {
    this.image = new Map<DomainElement<T>, ImageElement<T>>(pairs);
    this.domain = new Map<ImageElement<T>, DomainElement<T>>(invert(pairs));
  }

  map<Element extends DomainElement<T>>(element: Element): ValueOf<T, Element> {
    return this.image.get(element) as ValueOf<T, Element>;
  }

  invert<Element extends ImageElement<T>>(element: Element): InverseValueOf<T, Element> {
    return this.domain.get(element) as InverseValueOf<T, Element>;
  }
}
