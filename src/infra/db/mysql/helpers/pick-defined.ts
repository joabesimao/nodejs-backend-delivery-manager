export const pickDefined = <T extends object, K extends keyof T>(
  source: T,
  keys: readonly K[],
): Partial<Pick<T, K>> =>
  keys.reduce<Partial<Pick<T, K>>>(
    (picked, key) =>
      source?.[key] === undefined ? picked : { ...picked, [key]: source[key] },
    {},
  );
