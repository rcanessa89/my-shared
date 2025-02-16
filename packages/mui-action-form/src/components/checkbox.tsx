import { type ComponentProps, type FC } from 'react';
import MuiCheckbox, {
  type CheckboxProps as MuiCheckboxProps
} from '@mui/material/Checkbox';

export type CheckboxProps = MuiCheckboxProps &
  Omit<ComponentProps<'input'>, 'name'> & {
    name: string;
  };

export const Checkbox: FC<CheckboxProps> = ({
  name,
  defaultChecked = false,
  ...materialProperties
}) => {
  const props = {
    id: `Checkbox-${name}`,
    defaultChecked,
    ...materialProperties
  };

  return <MuiCheckbox {...props} />;
};
