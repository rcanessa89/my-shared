'use client';

import { type FC } from 'react';
import TextField from '@mui/material/TextField';
import {
  DatePicker as MuiDatePicker,
  type DatePickerProps as MuiDatePickerProps
} from '@mui/x-date-pickers/DatePicker';
import {
  useFormContext,
  useFormState,
  useWatch,
  type UseControllerProps,
  type FieldError
} from 'react-hook-form';

import { getValueAtPath } from '../utils/get-value-path';
import { combineRefs } from '../utils/combine-refs';

export type DatePickerProps = MuiDatePickerProps<Date> & UseControllerProps;

export const DatePicker: FC<DatePickerProps> = ({
  name,
  rules,
  shouldUnregister,
  defaultValue,
  inputRef,
  ...materialProperties
}) => {
  const { register, control, setValue } = useFormContext();
  const { errors } = useFormState({ control });
  const { ref } = register(name, { ...rules, shouldUnregister });
  const value = useWatch({
    name,
    control,
    defaultValue
  });
  const id = `DatePicker-${name}`;
  const error = getValueAtPath(errors, name) as FieldError;

  return (
    <MuiDatePicker
      onChange={(date) => setValue(name, date, { shouldValidate: true })}
      inputRef={inputRef ? combineRefs(inputRef, ref) : ref}
      value={value}
      {...materialProperties}
      slotProps={{
        textField: {
          id,
          error: !error
        }
      }}
      slots={{
        textField: TextField
      }}
    />
  );
};
