import * as React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

export function ScenariosFilters(): React.JSX.Element {
  return (
    <OutlinedInput
      defaultValue=""
      fullWidth
      size="small"
      placeholder="Search scenario"
      startAdornment={
        <InputAdornment position="start">
          <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
        </InputAdornment>
      }
    />
  );
}
