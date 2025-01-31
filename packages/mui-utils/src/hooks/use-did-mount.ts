import { useEffect, EffectCallback } from 'react';

export const useDidMount = (fn: EffectCallback) => {
  useEffect(fn, []); // eslint-disable-line
};
