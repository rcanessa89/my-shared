import { type ComponentProps, type FC } from 'react';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MuiSelect, {
  type SelectProps as MuiSelectProps
} from '@mui/material/Select';

import { useFormContext } from '../hooks/use-form-context';
import { getValueAtPath } from '../utils/get-value-path';

export type SelectProps = MuiSelectProps &
  Omit<ComponentProps<'select'>, 'name'> & {
    name: string;
  };

export const Select: FC<SelectProps> = ({
  children,
  name,
  label,
  fullWidth,
  defaultValue,
  ...materialProperties
}) => {
  const { errors } = useFormContext();
  const error = errors ? getValueAtPath(errors, name) : null;
  const helperText: string = error?.message || '';

  return (
    <FormControl error={!!error} fullWidth={fullWidth}>
      <InputLabel id={`Select-label-${name}`}>{label}</InputLabel>
      <MuiSelect
        id={`Select-${name}`}
        label={label}
        labelId={`Select-label-${name}`}
        fullWidth
        defaultValue={defaultValue}
        {...materialProperties}
      >
        {children}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
