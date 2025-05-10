'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import { onAuthStateChanged, updatePassword, User } from 'firebase/auth';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { auth } from '@/lib/firebase';

const schema = zod
  .object({
    password: zod.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: zod.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type Values = zod.infer<typeof schema>;

export function UpdatePasswordForm(): React.JSX.Element {
  const [user, setUser] = React.useState<User | null>(null);
  const [isPending, setIsPending] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Values) => {
    if (!user) {
      setError('password', { type: 'manual', message: 'No user logged in.' });
      return;
    }

    setIsPending(true);

    try {
      await updatePassword(user, values.password);
      setSnackbarOpen(true);
      reset();
    } catch (err: any) {
      const message = err.message || 'Failed to update password';
      setError('password', { type: 'server', message });
    }

    setIsPending(false);
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.password}>
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput {...field} label="Password" type="password" />
                  {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                </FormControl>
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.confirmPassword}>
                  <InputLabel>Confirm password</InputLabel>
                  <OutlinedInput {...field} label="Confirm password" type="password" />
                  {errors.confirmPassword && <FormHelperText>{errors.confirmPassword.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" disabled={isPending || !user}>
            Update
          </Button>
        </CardActions>
      </Card>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <MuiAlert severity="success" elevation={6} variant="filled" onClose={handleCloseSnackbar}>
          Password updated successfully!
        </MuiAlert>
      </Snackbar>
    </form>
  );
}
