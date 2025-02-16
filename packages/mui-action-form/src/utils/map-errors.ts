import { type ZodError } from 'zod';

export const mapError = <T>({ issues }: ZodError): Record<keyof T, string> => {
  const errors = Object.create(null);
  const laps = issues.length;

  for (let i = 0; i < laps; i++) {
    errors[issues[i].path[0]] = issues[i].message;
  }

  return errors;
};
