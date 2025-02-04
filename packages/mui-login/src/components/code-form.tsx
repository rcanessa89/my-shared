import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FormProvider, TextField, z } from '@rcanessa/mui-hook-form';

import { useCodeForm } from '../hooks/use-code-form';
import { useLoginContext } from '../hooks/user-login-context';
import { type FormCallBack } from '../types';

export interface CodeFormProps {
  passwordSchema: z.ZodString;
  onCode: FormCallBack<{
    code: string;
    password: string;
    confirm: string;
  }>;
}

export const CodeForm: FC<CodeFormProps> = ({ passwordSchema, onCode }) => {
  const { loading, form, handleSubmit } = useCodeForm({
    passwordSchema,
    onCode
  });
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
            id="code"
            label="Code"
            type="text"
            name="code"
          />
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
