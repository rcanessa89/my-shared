'use client';

import { type FC } from 'react';
import {
  useFormContext,
  useWatch,
  type UseControllerProps
} from 'react-hook-form';
import MuiCheckbox, {
  type CheckboxProps as MuiCheckboxProps
} from '@mui/material/Checkbox';

export type CheckboxProps = MuiCheckboxProps & UseControllerProps;

export const Checkbox: FC<CheckboxProps> = ({
  name,
  value,
  defaultChecked = false,
  shouldUnregister = false,
  rules = {},
  ...materialProperties
}) => {
  const { control, register } = useFormContext();
  const { ref, ...fields } = register(name, {
    ...rules,
    shouldUnregister,
    value
  });
  const checked = useWatch({
    name,
    control,
    defaultValue: !!defaultChecked
  });
  const props = {
    id: `Checkbox-${name}`,
    inputRef: ref,
    checked,
    ...fields,
    ...materialProperties
  };

  return <MuiCheckbox {...props} />;
};
