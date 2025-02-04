import { useState } from 'react';
import { useForm, z } from '@rcanessa/mui-hook-form';

import { useLoginContext } from './user-login-context';
import { type OnNewPass } from '../types';

export interface UseNewPassFormArgs {
  passwordSchema: z.ZodString;
  onNewPass: OnNewPass;
}

export const useNewPassForm = ({
  passwordSchema,
  onNewPass
}: UseNewPassFormArgs) => {
  const context = useLoginContext();
  const [loading, setLoading] = useState(false);
  const validationSchema = z
    .object({
      password: passwordSchema.trim(),
      confirm: passwordSchema.trim()
    })
    .refine((d) => d.password === d.confirm, {
      message: 'Password should match',
      path: ['confirm']
    });
  const form = useForm({
    defaultValues: {
      password: '',
      confirm: ''
    },
    schema: validationSchema
  });
  const handleSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    await onNewPass(values, context);
    setLoading(false);
  });

  return {
    loading,
    form,
    handleSubmit
  };
};
