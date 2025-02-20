'use client';

import {
  useForm as RHFuseForm,
  FieldValues,
  UseFormProps,
  UseFormReturn
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Schema } from 'zod';

export const useForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any // eslint-disable-line
>(
  props?: Omit<UseFormProps<TFieldValues, TContext>, 'schema'> & {
    schema: Schema;
  }
): UseFormReturn<TFieldValues, TContext> => {
  return RHFuseForm({
    ...props,
    ...(props && props.schema ? { resolver: zodResolver(props.schema) } : {})
  });
};
