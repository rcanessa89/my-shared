import { type FC } from 'react';
import { z } from '@rcanessa/mui-hook-form';

import { LoginGroup } from './login-group';
import { LoginProvider } from '../provider';
import {
  type OnCode,
  type OnForgotPass,
  type OnNewPass,
  type OnSignIn
} from '../types';

export interface LoginProps {
  passwordSchema: z.ZodString;
  onCode: OnCode;
  onForgotPass: OnForgotPass;
  onNewPass: OnNewPass;
  onSignIn: OnSignIn;
}

export const Login: FC<LoginProps> = ({
  passwordSchema,
  onCode,
  onForgotPass,
  onNewPass,
  onSignIn
}) => (
  <LoginProvider>
    <LoginGroup
      passwordSchema={passwordSchema}
      onCode={onCode}
      onForgotPass={onForgotPass}
      onNewPass={onNewPass}
      onSignIn={onSignIn}
    />
  </LoginProvider>
);
