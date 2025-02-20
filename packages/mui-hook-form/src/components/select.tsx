'use client';

import { type FC } from 'react';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MuiSelect, {
  type SelectProps as MuiSelectProps
} from '@mui/material/Select';
import {
  useFormContext,
  useFormState,
  useWatch,
  type FieldError,
  type UseControllerProps,
  type RegisterOptions
} from 'react-hook-form';

import { getValueAtPath } from '../utils/get-value-path';

export type SelectProps = UseControllerProps &
  MuiSelectProps & {
    name: string;
    rules?: RegisterOptions;
  };

export const Select: FC<SelectProps> = ({
  children,
  name,
  label,
  rules,
  fullWidth,
  defaultValue = '',
  ...materialProperties
}) => {
  const { control, register } = useFormContext();
  const { errors } = useFormState({ control });
  const value = (useWatch({
    name,
    control
  }) || defaultValue) as string;
  const { ref, ...fields } = register(name, { ...rules, value });
  const error = getValueAtPath(errors, name) as FieldError;
  const helperText: string = error?.message || '';

  return (
    <FormControl error={!!error} fullWidth={fullWidth}>
      <InputLabel id={`Select-label-${name}`}>{label}</InputLabel>
      <MuiSelect
        ref={ref}
        id={`Select-${name}`}
        label={label}
        labelId={`Select-label-${name}`}
        value={value}
        fullWidth
        {...fields}
        {...materialProperties}
      >
        {children}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
