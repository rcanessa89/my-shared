import { type MutableRefObject } from 'react';

export const setRef = <T = unknown>(
  ref: ((instance: T | null) => void) | MutableRefObject<T | null>,
  node: T
) => {
  if (ref && typeof ref === 'function') {
    ref(node);
  } else if (ref && ref.current !== undefined) {
    ref.current = node;
  }
};
