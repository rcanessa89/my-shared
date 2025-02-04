import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FormProvider, TextField } from '@rcanessa/mui-hook-form';

import { useForgotPass } from '../hooks/use-forgot-pass-form';
import { useLoginContext } from '../hooks/user-login-context';
import { type FormCallBack } from '../types';

export interface ForgotPassFormProps {
  onForgotPass: FormCallBack<{ username: string }>;
}

export const ForgotPassForm: FC<ForgotPassFormProps> = ({ onForgotPass }) => {
  const { loading, form, handleSubmit } = useForgotPass({ onForgotPass });
  const { setFormView } = useLoginContext();
  const showSignIn = () => setFormView('signIn', true);

  return (
    <>
      <FormProvider {...form}>
        <Box noValidate component="form" onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="normal"
            required
            fullWidth
            id="username"
            label="Email"
            name="username"
            autoComplete="email"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            loading={loading}
            disabled={loading}
          >
            Send
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
