import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FormProvider, TextField, z } from '@rcanessa/mui-hook-form';

import { useSignInForm } from '../hooks/use-sign-in-form';
import { useLoginContext } from '../hooks/user-login-context';
import { type FormCallBack } from '../types';

export interface SignInFormProps {
  passwordSchema: z.ZodString;
  onSignIn: FormCallBack<{
    username: string;
    password: string;
  }>;
}

export const SignInForm: FC<SignInFormProps> = ({
  passwordSchema,
  onSignIn
}) => {
  const { loading, form, handleSubmit } = useSignInForm({
    passwordSchema,
    onSignIn
  });
  const { setFormView } = useLoginContext();
  const showForgotPass = () => setFormView('forgotPass', true);

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
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            loading={loading}
            disabled={loading}
          >
            Sign In
          </Button>
        </Box>
      </FormProvider>
      <Typography textAlign="center" component={Box}>
        <Button onClick={showForgotPass} disabled={loading}>
          Forgot password?
        </Button>
      </Typography>
    </>
  );
};
