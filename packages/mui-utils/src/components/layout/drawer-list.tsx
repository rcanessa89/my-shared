import { type FC, memo } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { type DrawerListProps } from './types';

export const DrawerList: FC<DrawerListProps> = memo(({ drawerItems }) => (
  <List>
    {drawerItems.map(({ text, icon, props }) => (
      <ListItemButton key={text} {...props}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    ))}
  </List>
));
