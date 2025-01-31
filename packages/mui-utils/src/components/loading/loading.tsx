import { type FC } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Portal from '@mui/material/Portal';

export interface LoadingProps {
  show: boolean;
}

export const Loading: FC<LoadingProps> = ({ show }) =>
  show ? (
    <Portal container={document.body}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={show}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Portal>
  ) : null;

export default Loading;
