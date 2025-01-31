import { type FC, type ReactNode, type PropsWithChildren } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import { PageTitle } from './page-title';
import { PageSubtitle } from './page-subtitle';

export interface PageLayoutProps extends PropsWithChildren {
  title?: string;
  subtitle?: string;
  paper?: boolean;
  right?: ReactNode;
  onBack?: () => void;
}

export const PageLayout: FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  paper,
  right = null,
  onBack
}) => {
  const content = paper ? <Paper sx={{ p: 2 }}>{children}</Paper> : children;

  return (
    <Grid container>
      <Grid item xs={12}>
        {(title || subtitle || right) && (
          <Box mb={3} display="flex" justifyContent="space-between">
            <Box
              display="flex"
              justifyContent="flex-end"
              flexDirection="column"
            >
              {title && <PageTitle onBack={onBack}>{title}</PageTitle>}
              {subtitle && <PageSubtitle>{subtitle}</PageSubtitle>}
            </Box>
            {right}
          </Box>
        )}
        {content}
      </Grid>
    </Grid>
  );
};

export default PageLayout;
