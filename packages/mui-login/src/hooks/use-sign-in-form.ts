import { useState } from 'react';
import { useForm, z } from '@rcanessa/mui-hook-form';

import { useLoginContext } from './user-login-context';
import { type OnSignIn } from '../types';

export interface UseSignInFormArgs {
  passwordSchema: z.ZodString;
  onSignIn: OnSignIn;
}

export const useSignInForm = ({
  passwordSchema,
  onSignIn
}: UseSignInFormArgs) => {
  const context = useLoginContext();
  const [loading, setLoading] = useState(false);
  const validationSchema = z.object({
    username: z.string().email('Enter a valid email').trim(),
    password: passwordSchema.trim()
  });
  const form = useForm({
    defaultValues: {
      username: '',
      password: ''
    },
    schema: validationSchema
  });
  const handleSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    await onSignIn(values, context);
    setLoading(false);
  });

  return {
    loading,
    form,
    handleSubmit
  };
};
