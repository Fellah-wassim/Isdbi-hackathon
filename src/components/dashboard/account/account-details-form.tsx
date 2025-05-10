'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Unstable_Grid2';
import { updateProfile } from 'firebase/auth';

import { auth } from '@/lib/firebase';

export function AccountDetailsForm(): React.JSX.Element {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info',
  });

  React.useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      setFormData({
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        email: user.email || '',
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if form data has actually changed
    const user = auth.currentUser;
    if (!user) {
      setSnackbar({
        open: true,
        message: 'User not authenticated',
        severity: 'error',
      });
      return;
    }

    const currentFirstName = user.displayName?.split(' ')[0] || '';
    const currentLastName = user.displayName?.split(' ')[1] || '';

    if (formData.firstName === currentFirstName && formData.lastName === currentLastName) {
      setSnackbar({
        open: true,
        message: 'No changes detected',
        severity: 'info',
      });
      return;
    }

    setLoading(true);

    try {
      // Update display name in Firebase Auth only
      const displayName = `${formData.firstName} ${formData.lastName}`;
      await updateProfile(user, { displayName });

      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);

      let errorMessage = 'Failed to update profile';
      if (error.code) {
        switch (error.code) {
          case 'auth/requires-recent-login':
            errorMessage = 'Please sign in again to update your profile';
            break;
          default:
            errorMessage = error.message || error.code;
        }
      } else {
        errorMessage = error.message || 'An unknown error occurred';
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>First name</InputLabel>
                <OutlinedInput label="First name" name="firstName" value={formData.firstName} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput label="Last name" name="lastName" value={formData.lastName} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput
                  label="Email address"
                  name="email"
                  type="email"
                  value={formData.email}
                  readOnly
                  disabled
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit" disabled={loading || !formData.firstName || !formData.lastName}>
            {loading ? 'Saving...' : 'Save details'}
          </Button>
        </CardActions>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </form>
  );
}
