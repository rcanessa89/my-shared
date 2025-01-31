import { type FC, type PropsWithChildren } from 'react';

import Typography from '@mui/material/Typography';

export const PageSubtitle: FC<PropsWithChildren> = ({ children }) => (
  <Typography
    component="h3"
    variant="h6"
    sx={{
      letterSpacing: 1,
      lineHeight: 1.3,
      fontWeight: 'regular'
    }}
  >
    {children}
  </Typography>
);
