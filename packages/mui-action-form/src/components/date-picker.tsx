import { type ComponentProps, type FC } from 'react';
import TextField from '@mui/material/TextField';
import {
  DatePicker as MuiDatePicker,
  type DatePickerProps as MuiDatePickerProps
} from '@mui/x-date-pickers/DatePicker';

import { useFormContext } from '../hooks/use-form-context';
import { getValueAtPath } from '../utils/get-value-path';

export type DatePickerProps = MuiDatePickerProps<Date> &
  Omit<ComponentProps<'input'>, 'name'> & {
    name: string;
  };

export const DatePicker: FC<DatePickerProps> = ({
  name,
  defaultValue,
  inputRef,
  ...materialProperties
}) => {
  const id = `DatePicker-${name}`;
  const { errors } = useFormContext();
  const error = errors ? getValueAtPath(errors, name) : null;

  return (
    <MuiDatePicker
      defaultValue={defaultValue}
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
