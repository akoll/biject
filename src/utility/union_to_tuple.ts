export type UnionToTuple<T> = (
  (
    (
      T extends unknown
        ? (t: T) => T
        : never
    ) extends infer U
      ? (U extends unknown
        ? (u: U) => unknown
        : never
      ) extends (v: infer V) => unknown
        ? V
        : never
      : never
  ) extends (_: never) => infer W
    ? [...UnionToTuple<Exclude<T, W>>, W]
    : []
);
