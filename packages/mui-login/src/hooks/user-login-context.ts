import { useContext } from 'react';

import { LoginContext } from '../context';

export const useLoginContext = () => {
  const context = useContext(LoginContext);

  if (!context) {
    throw new Error('Please use LoginProvider to use the context');
  }

  return context;
};
