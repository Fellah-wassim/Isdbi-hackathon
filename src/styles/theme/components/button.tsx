import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiButton = {
  styleOverrides: {
    root: {
      borderRadius: '8px',
      textTransform: 'none',
      backgroundColor: '#3BA935',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#2C872B',
      },
      '&:disabled': {
        backgroundColor: '#B0D8A3',
        color: '#fff',
      },
    },

    sizeSmall: { padding: '6px 16px' },
    sizeMedium: { padding: '8px 20px' },
    sizeLarge: { padding: '11px 24px' },
    textSizeSmall: { padding: '7px 12px' },
    textSizeMedium: { padding: '9px 16px' },
    textSizeLarge: { padding: '12px 16px' },
  },
} satisfies Components<Theme>['MuiButton'];
