import { type ComponentProps, type FC } from 'react';
import MuiTextField, {
  type TextFieldProps as MuiTextFieldProps
} from '@mui/material/TextField';

import { useFormContext } from '../hooks/use-form-context';
import { getValueAtPath } from '../utils/get-value-path';

export type TextFieldProps = MuiTextFieldProps &
  Omit<ComponentProps<'input'>, 'name'> & {
    name: string;
  };

export const TextField: FC<TextFieldProps> = ({
  name,
  defaultValue,
  ...rest
}) => {
  const { errors } = useFormContext();
  const error = errors ? getValueAtPath(errors, name) : null;
  const id = `TextField-${name}`;
  const props = {
    id,
    error: !!error,
    helperText: error,
    defaultValue,
    ...rest
  };

  return <MuiTextField {...props} />;
};
