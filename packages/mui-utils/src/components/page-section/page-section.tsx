import { type FC, type PropsWithChildren } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export interface PageSectionProps extends PropsWithChildren {
  title?: string;
}

export const PageSection: FC<PageSectionProps> = ({ children, title }) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      {title && (
        <Typography
          variant="h3"
          sx={{
            fontSize: 'h6.fontSize',
            fontWeight: 'Medium',
            mb: 2
          }}
        >
          {title}
        </Typography>
      )}
      {children}
    </Paper>
  );
};

export default PageSection;
