import { useState } from 'react';
import { useForm, z } from '@rcanessa/mui-hook-form';

import { useLoginContext } from './user-login-context';
import { type OnForgotPass } from '../types';

export interface UseForgotPassFormArgs {
  onForgotPass: OnForgotPass;
}

const validationSchema = z.object({
  username: z.string().email('Enter a valid email').trim()
});

export const useForgotPass = ({ onForgotPass }: UseForgotPassFormArgs) => {
  const context = useLoginContext();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      username: ''
    },
    schema: validationSchema
  });
  const handleSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    await onForgotPass(values, context);
    setLoading(false);
  });

  return {
    loading,
    form,
    handleSubmit
  };
};
