import { type FC, type PropsWithChildren } from 'react';
import MuiMenu, { MenuProps as MuiMenuProps } from '@mui/material/Menu';

export interface MenuProps
  extends Omit<MuiMenuProps, 'anchorId' | 'open' | 'anchorEl'> {
  anchorId: string;
  onClose: () => void;
}

export const Menu: FC<PropsWithChildren<MenuProps>> = ({
  anchorId,
  onClose,
  children,
  ...props
}) => (
  <MuiMenu
    anchorEl={document.getElementById(anchorId || '')}
    open={Boolean(anchorId)}
    onClose={onClose}
    {...props}
  >
    {children}
  </MuiMenu>
);
