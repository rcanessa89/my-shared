import { type ReactNode, type ReactElement } from 'react';
import { type AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { type ExtendButtonBase } from '@mui/material/ButtonBase/ButtonBase';
import { type ListItemButtonTypeMap } from '@mui/material/ListItemButton/ListItemButton';

export interface BarProps extends MuiAppBarProps {
  open: boolean;
}

export interface DrawerItemProps
  extends Exclude<ExtendButtonBase<ListItemButtonTypeMap>, 'component'> {
  component: ReactNode;
}

export interface DrawerItem {
  text: string;
  icon: ReactNode;
  props: Parameters<ExtendButtonBase<ListItemButtonTypeMap<object>>>[0];
}

export interface DrawerListProps {
  drawerItems: DrawerItem[];
}
