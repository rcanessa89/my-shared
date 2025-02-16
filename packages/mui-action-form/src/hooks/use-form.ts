import { useActionState } from 'react';
import { z } from 'zod';

import { mapError } from '../utils/map-errors';
import { type UseFormArgs } from '../types';

export const useForm = <T extends z.ZodType>({
  schema,
  defaultValues = null,
  onSubmit
}: UseFormArgs<T>) => {
  const [errors, submitAction, isPending] = useActionState(
    (_: unknown, formData: FormData) => {
      const values = Object.fromEntries(formData.entries());
      const result = schema.safeParse(values);

      if (!result.success) {
        return mapError<z.infer<typeof schema>>(result.error);
      }

      onSubmit(result);

      return null;
    },
    defaultValues
  );

  return {
    errors,
    isPending,
    submitAction
  };
};
