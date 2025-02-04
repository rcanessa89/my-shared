import { type FC, type PropsWithChildren, useState, useCallback } from 'react';

import { LoginContext } from './context';
import { type FormView, type FormViewKey } from './types';

const DEFAULT_FORM_VIEW_STATE = {
  signIn: false,
  code: false,
  forgotPass: false,
  newPass: false
};

export const LoginProvider: FC<PropsWithChildren> = ({ children }) => {
  const [formViewState, setFormViewState] = useState<FormView>({
    ...DEFAULT_FORM_VIEW_STATE,
    signIn: true
  });
  const setFormView = useCallback((key: FormViewKey, value: boolean) => {
    setFormViewState(() => ({
      ...DEFAULT_FORM_VIEW_STATE,
      [key]: value
    }));
  }, []);
  const value = {
    formViewState,
    setFormView
  };

  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
};
