import { useRef } from 'react';

import { useDidMount } from './use-did-mount';

export const useUnmount = (fn: () => void) => {
  const fnRef = useRef(fn);

  fnRef.current = fn;

  useDidMount(() => () => fnRef.current());
};
