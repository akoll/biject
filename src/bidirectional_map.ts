import { Pairs, Left, Right } from './utility/pairs';
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
  [I in Exclude<keyof T, keyof any[]>]: T[I] extends readonly [E, infer V] ? V : never;
}[Index<T>], never, unknown>;

type InverseValueOf<T extends Pairs, E> = Convert<{
  [I in Exclude<keyof T, keyof any[]>]: T[I] extends readonly [infer V, E] ? V : never;
}[Index<T>], never, unknown>;

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
