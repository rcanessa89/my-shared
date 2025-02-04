import { useState } from 'react';
import { useForm, z } from '@rcanessa/mui-hook-form';

import { useLoginContext } from './user-login-context';
import { type OnCode } from '../types';

export interface UseCodeFormArgs {
  passwordSchema: z.ZodString;
  onCode: OnCode;
}

export const useCodeForm = ({ passwordSchema, onCode }: UseCodeFormArgs) => {
  const context = useLoginContext();
  const [loading, setLoading] = useState(false);
  const validationSchema = z
    .object({
      code: z.string().nonempty('Code is required').trim(),
      password: passwordSchema.trim(),
      confirm: passwordSchema.trim()
    })
    .refine((d) => d.password === d.confirm, {
      message: 'Password should match',
      path: ['confirm']
    });
  const form = useForm({
    defaultValues: {
      code: '',
      password: '',
      confirm: ''
    },
    schema: validationSchema
  });
  const handleSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    await onCode(values, context);
    setLoading(false);
  });

  return {
    loading,
    form,
    handleSubmit
  };
};
