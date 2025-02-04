import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FormProvider, TextField, z } from '@rcanessa/mui-hook-form';

import { useNewPassForm } from '../hooks/use-new-pass-form';
import { useLoginContext } from '../hooks/user-login-context';
import { type FormCallBack } from '../types';

export interface NewPassFormProps {
  passwordSchema: z.ZodString;
  onNewPass: FormCallBack<{
    password: string;
    confirm: string;
  }>;
}

export const NewPassForm: FC<NewPassFormProps> = ({
  passwordSchema,
  onNewPass
}) => {
  const { loading, form, handleSubmit } = useNewPassForm({
    passwordSchema,
    onNewPass
  });
  const { setFormView } = useLoginContext();
  const showSignIn = () => setFormView('signIn', true);

  return (
    <>
      <FormProvider {...form}>
        <Box noValidate component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            margin="normal"
            required
            fullWidth
            id="password"
            label="New password"
            type="password"
            name="password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirm"
            label="Confirm password"
            type="password"
            id="confirm"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            loading={loading}
            disabled={loading}
          >
            Change Password
          </Button>
        </Box>
      </FormProvider>
      <Typography textAlign="center" component={Box}>
        <Button onClick={showSignIn} disabled={loading}>
          Login
        </Button>
      </Typography>
    </>
  );
};
