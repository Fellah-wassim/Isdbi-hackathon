import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const components = {
  MuiButton: {
    styleOverrides: {
      contained: {
        backgroundColor: '#3BA935',
        textTransform: 'none',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#2C872B',
        },
      },
      outlined: {
        textTransform: 'none',
        color: '#3BA935',
        borderColor: '#3BA935',
        '&:hover': {
          color: '#2C872B',
          borderColor: '#2C872B',
          backgroundColor: 'transparent',
        },
      },
      text: {
        textTransform: 'none',
        color: '#3BA935',
        '&:hover': {
          color: '#2C872B',
          backgroundColor: 'transparent',
        },
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: {
        color: '#3BA935',
        '&:hover': {
          color: '#2C872B',
        },
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        color: '#3BA935',
        '&.Mui-selected': {
          color: '#2C872B',
        },
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: {
        '&.Mui-checked': {
          color: '#3BA935',
        },
        '&:hover': {
          backgroundColor: 'rgba(59, 169, 53, 0.08)',
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#3BA935',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#3BA935',
          borderWidth: '1px',
        },
      },
      notchedOutline: {
        borderColor: 'rgba(0, 0, 0, 0.23)',
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        '&.Mui-focused': {
          color: '#3BA935',
        },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      input: {
        color: '#333',
        '&::placeholder': {
          color: '#999',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        '&.MuiPaper-elevation': {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '&.MuiPaper-outlined': {
          borderColor: '#3BA935',
        },
        '&.MuiPaper-elevation:hover': {
          boxShadow: '0px 4px 8px rgba(59, 169, 53, 0.2)',
        },
      },
    },
  },
} satisfies Components<Theme>;
