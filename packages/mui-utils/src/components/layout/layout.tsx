import { useState, type FC, type ReactElement } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Divider from '@mui/material/Divider';

import { Bar } from './bar';
import { Drawer } from './drawer';
import { Content } from './content';
import { DrawerList } from './drawer-list';
import { type DrawerItem } from './types';
import { isMobile } from '../../utils/is-mobile';

export interface LayoutProps {
  children?: ReactElement;
  drawerItems: DrawerItem[];
  logged: boolean;
}

export const Layout: FC<LayoutProps> = ({ children = null, drawerItems }) => {
  const [open, setOpen] = useState(!isMobile());
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Bar open={open}>
        <Toolbar
          sx={{
            pr: '24px'
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' })
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Invoice Processor
          </Typography>
        </Toolbar>
      </Bar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1]
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <DrawerList drawerItems={drawerItems} />
      </Drawer>
      <Content>{children}</Content>
    </Box>
  );
};

export default Layout;
