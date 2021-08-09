export type Equals<T, V> = [T] extends [V] ? [V] extends [T] ? true : false : false;
