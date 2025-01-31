import { type FC, type PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export interface PageTitleProps {
  onBack?: () => void;
}

export const PageTitle: FC<PropsWithChildren<PageTitleProps>> = ({
  onBack,
  children
}) => (
  <Typography
    component="h2"
    variant="h5"
    sx={{
      letterSpacing: 1,
      lineHeight: 1.3,
      fontWeight: 'medium'
    }}
  >
    {onBack && (
      <IconButton onClick={onBack} sx={{ marginRight: 1 }}>
        <ArrowBackIcon />
      </IconButton>
    )}
    {children}
  </Typography>
);
