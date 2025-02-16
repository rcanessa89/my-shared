import { use } from 'react';

import { FormContext } from '../form-context';

export const useFormContext = () => {
  const context = use(FormContext);

  if (!context) {
    throw new Error('No form context');
  }

  return context;
};
