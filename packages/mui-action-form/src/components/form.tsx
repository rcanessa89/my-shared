import { type PropsWithChildren, ReactNode } from 'react';
import { z } from 'zod';

import { FormProvider } from '../form-provider';
import { useForm } from '../hooks/use-form';
import { type ZodInferSchema } from '../types';

export interface FormProps<T extends z.ZodType> {
  schema: T;
  defaultValues?: ZodInferSchema<T> | null;
  loading?: ReactNode | null;
  onSubmit: (data: ZodInferSchema<T>) => void;
}

export const Form = <T extends z.ZodType>({
  children,
  schema,
  defaultValues,
  loading = null,
  onSubmit
}: PropsWithChildren<FormProps<T>>) => {
  const { errors, isPending, submitAction } = useForm({
    schema,
    defaultValues,
    onSubmit
  });

  return (
    <FormProvider errors={errors} isPending={isPending}>
      {isPending && loading}
      <form noValidate action={submitAction}>
        {children}
      </form>
    </FormProvider>
  );
};
