import { FC } from 'react';
import { z } from '@rcanessa/mui-hook-form';

import { CodeForm } from './code-form';
import { ForgotPassForm } from './forgot-pass-form';
import { NewPassForm } from './new-pass-form';
import { SignInForm } from './sign-in-form';
import { useLoginContext } from '../hooks/user-login-context';
import {
  type OnCode,
  type OnForgotPass,
  type OnNewPass,
  type OnSignIn
} from '../types';

export interface LoginGroupProps {
  passwordSchema: z.ZodString;
  onCode: OnCode;
  onForgotPass: OnForgotPass;
  onNewPass: OnNewPass;
  onSignIn: OnSignIn;
}

export const LoginGroup: FC<LoginGroupProps> = ({
  passwordSchema,
  onCode,
  onForgotPass,
  onNewPass,
  onSignIn
}) => {
  const { formViewState } = useLoginContext();

  return (
    <>
      {formViewState.code && (
        <CodeForm passwordSchema={passwordSchema} onCode={onCode} />
      )}
      {formViewState.forgotPass && (
        <ForgotPassForm onForgotPass={onForgotPass} />
      )}
      {formViewState.newPass && (
        <NewPassForm passwordSchema={passwordSchema} onNewPass={onNewPass} />
      )}
      {formViewState.signIn && (
        <SignInForm passwordSchema={passwordSchema} onSignIn={onSignIn} />
      )}
    </>
  );
};
