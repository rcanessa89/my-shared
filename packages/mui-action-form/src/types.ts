import { z } from 'zod';

export type ZodInferSchema<T extends z.ZodType> = z.infer<T>;

export interface UseFormArgs<T extends z.ZodType> {
  schema: T;
  defaultValues?: ZodInferSchema<T> | null;
  onSubmit: (data: ZodInferSchema<T>) => void;
}

export interface FormContextType {
  errors: Record<string, string> | null;
  isPending: boolean;
}
