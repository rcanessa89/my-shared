import yaml from 'yaml';

export const getRefTag = (value: string) => {
  const ref = new yaml.Scalar(value);

  ref.tag = '!Ref';

  return ref;
};
