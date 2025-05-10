'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { authClient } from '@/lib/auth/client';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = { email: '' };

export function ResetPasswordForm(): React.JSX.Element {
  const [isPending, setIsPending] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      const { error } = await authClient.resetPassword(values);

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }

      setSnackbarOpen(true);
      setIsPending(false);

      setTimeout(() => {
        window.location.href = '/auth/sign-in';
      }, 2000);
    },
    [setError]
  );

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Stack spacing={4}>
      <Typography variant="h5">Reset password</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={!!errors.email}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
              </FormControl>
            )}
          />
          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
          <Button disabled={isPending} type="submit" variant="contained">
            Send recovery link
          </Button>
        </Stack>
      </form>

      {/* Success Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          elevation={6}
          variant="filled"
          sx={{ width: '100%' }}
        >
          A reset link has been sent to your email.
        </MuiAlert>
      </Snackbar>
    </Stack>
  );
}
