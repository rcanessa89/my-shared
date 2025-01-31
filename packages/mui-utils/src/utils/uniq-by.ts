export const uniqBy = <T = object[]>(
  arr: T[],
  predicate: keyof T | (() => T[keyof T])
): T[] => {
  const cb =
    typeof predicate === 'function'
      ? predicate
      : (o: T) => o[predicate as keyof typeof o];

  return [
    ...arr
      .reduce((map, item) => {
        const key = item === null || item === undefined ? item : cb(item);

        map.has(key) || map.set(key, item);

        return map;
      }, new Map())
      .values()
  ];
};
