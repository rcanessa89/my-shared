export const getValueAtPath = (obj: object, path: string) => {
  const keys = path.split('.');
  let value: any = obj; // eslint-disable-line @typescript-eslint/no-explicit-any

  for (const key of keys) {
    if (value[key]) {
      value = value[key];
    } else {
      return undefined;
    }
  }

  return value;
};
