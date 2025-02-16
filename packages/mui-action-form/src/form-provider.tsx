import { type PropsWithChildren, type FC } from 'react';

import { FormContext } from './form-context';
import { type FormContextType } from './types';

export const FormProvider: FC<PropsWithChildren<FormContextType>> = ({
  children,
  errors,
  isPending
}) => {
  const value = {
    errors,
    isPending
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
