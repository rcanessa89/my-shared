import { type MutableRefObject } from 'react';

import { setRef } from './set-ref';

type Args<T> = ((instance: T | null) => void) | MutableRefObject<T | null>;

export const combineRefs =
  <T = unknown>(...refs: Args<T>[]) =>
  (node: T) => {
    refs.forEach((ref) => setRef<T>(ref, node));
  };
