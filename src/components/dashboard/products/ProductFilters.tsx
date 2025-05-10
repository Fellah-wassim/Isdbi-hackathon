'use client';

import * as React from 'react';
import { Button, InputAdornment, OutlinedInput, Stack } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

interface ProductsFiltersProps {
  onFiltersChange?: (filters: { search: string; status: string; type: string }) => void;
}

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'Murabaha and Murabaha to the Purchase Orderer', label: 'Murabaha' },
  { value: 'Salam and Parallel Salam', label: 'Salam' },
  { value: "Istisna'a and Parallel Istisna'a", label: "Istisna'a" },
  { value: 'Ijarah and Ijarah Muntahia Bittamleek', label: 'Ijarah' },
];

export function ProductsFilters({ onFiltersChange }: ProductsFiltersProps): React.JSX.Element {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [type, setType] = React.useState('all');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setSearch(value);
    onFiltersChange?.({ search: value, status, type });
  };

  const handleStatusChange = (event: any): void => {
    const value = event.target.value;
    setStatus(value);
    onFiltersChange?.({ search, status: value, type });
  };

  const handleTypeChange = (event: any): void => {
    const value = event.target.value;
    setType(value);
    onFiltersChange?.({ search, status, type: value });
  };

  const handleReset = (): void => {
    setSearch('');
    setStatus('all');
    setType('all');
    onFiltersChange?.({ search: '', status: 'all', type: 'all' });
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ borderRadius: '8px' }}>
      <OutlinedInput
        value={search}
        onChange={handleSearchChange}
        placeholder="Search by name or reference..."
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        size="small"
        sx={{ width: '300px', borderRadius: '8px' }}
      />

      <FormControl sx={{ width: '200px' }} size="small">
        <InputLabel>Status</InputLabel>
        <Select value={status} label="Status" onChange={handleStatusChange}>
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: '250px' }} size="small">
        <InputLabel>Type</InputLabel>
        <Select value={type} label="Type" onChange={handleTypeChange}>
          {typeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="outlined" onClick={handleReset} sx={{ height: '40px' }}>
        Reset
      </Button>
    </Stack>
  );
}
