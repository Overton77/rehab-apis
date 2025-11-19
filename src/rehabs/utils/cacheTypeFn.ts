export type GetCacheKeyFn = (
  prefix: string,
  ...parts: (string | number | object)[]
) => string;
