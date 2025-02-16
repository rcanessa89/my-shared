export const getValueAtPath = (obj: object, path: string) => {
  let value: any = obj; // eslint-disable-line @typescript-eslint/no-explicit-any
  const keys = path.split('.');

  for (const key of keys) {
    if (value[key]) {
      value = value[key];
    } else {
      return undefined;
    }
  }

  return value;
};
