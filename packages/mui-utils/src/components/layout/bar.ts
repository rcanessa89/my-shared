import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';

import { type BarProps } from './types';
import { DRAWER_WIDTH } from './constants';

export const Bar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<BarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));
