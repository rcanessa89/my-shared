import { type FC, type ReactNode, useId } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { Menu } from '../menu/menu';
import { useMenu } from '../../hooks/use-menu';

export interface TopMenuProps {
  children: (props: { onClose: () => void }) => ReactNode;
}

export const TopMenu: FC<TopMenuProps> = ({ children }) => {
  const { anchorId, setAnchorId, onClose } = useMenu();
  const id = useId();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <IconButton id={id} onClick={() => setAnchorId(id)}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorId={anchorId} onClose={onClose}>
        {children({ onClose })}
      </Menu>
    </Box>
  );
};
