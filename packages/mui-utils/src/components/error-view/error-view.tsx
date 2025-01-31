import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export interface ErrorViewProps {
  title?: string;
  message?: string;
  redirect?: string;
  onClick?: () => void;
  onClickText?: string;
}

export const ErrorView: FC<ErrorViewProps> = ({
  title,
  message,
  redirect = '/',
  onClick = null,
  onClickText = ''
}) => (
  <Box
    py={16}
    px={2}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <ErrorOutlineIcon sx={{ fontSize: 128 }} />
    {title && (
      <Typography fontSize={32} marginY={2}>
        {title}
      </Typography>
    )}
    {message && (
      <Typography fontSize={38} marginY={2}>
        {message}
      </Typography>
    )}
    {onClick ? (
      <Button onClick={onClick} variant="contained">
        {onClickText}
      </Button>
    ) : (
      <Button href={redirect} variant="contained">
        Redirect
      </Button>
    )}
  </Box>
);
