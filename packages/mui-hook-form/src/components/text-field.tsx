import { type FC } from 'react';
import MuiTextField, {
  type TextFieldProps as MuiTextFieldProps
} from '@mui/material/TextField';
import {
  useFormContext,
  useFormState,
  type UseControllerProps,
  type FieldError
} from 'react-hook-form';

import { combineRefs } from '../utils/combine-refs';
import { getValueAtPath } from '../utils/get-value-path';

export type TextFieldProps = MuiTextFieldProps & UseControllerProps;

export const TextField: FC<TextFieldProps> = ({
  name,
  value,
  shouldUnregister = false,
  rules = {},
  inputRef,
  ...materialProperties
}) => {
  const { register, control } = useFormContext();
  const { errors } = useFormState({ control });
  const { ref, ...fields } = register(name, {
    ...rules,
    shouldUnregister,
    value
  });
  const id = `TextField-${name}`;
  const error = getValueAtPath(errors, name) as FieldError;
  const props = {
    id,
    inputRef: inputRef ? combineRefs(inputRef, ref) : ref,
    error: !!error,
    helperText: error?.message,
    ...fields,
    ...materialProperties
  };

  return <MuiTextField {...props} />;
};
