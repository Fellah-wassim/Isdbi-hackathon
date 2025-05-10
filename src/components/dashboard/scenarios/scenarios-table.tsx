/* eslint-disable eslint-comments/require-description */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client';

import * as React from 'react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { Download } from '@phosphor-icons/react/dist/ssr/Download';
import { Trash } from '@phosphor-icons/react/dist/ssr/Trash';

import { useSelection } from '@/hooks/use-selection';

function noop(): void {
  // do nothing
}

export interface Scenario {
  id: string;
  reference: string;
  title: string;
  status: string;
  description: string;
  scenarioType: string;
  result?: string;
  date: string;
  fas: string;
}

export interface ScenarioTableProps {
  count?: number;
  page?: number;
  rows?: Scenario[];
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  onDelete?: (id: string) => void;
}

export function ScenariosTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 5,
  onPageChange = noop,
  onRowsPerPageChange = noop,
  onDelete = noop,
}: ScenarioTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => rows.map((scenario) => scenario.id), [rows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const statusStyles: Record<'in-review' | 'completed', { label: string; backgroundColor: string; color: string }> = {
    'in-review': {
      label: 'In Review',
      backgroundColor: '#FFF3CD',
      color: '#856404',
    },
    completed: {
      label: 'Completed',
      backgroundColor: '#D4EDDA',
      color: '#155724',
    },
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    onPageChange(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Scenario Ref</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);
              const chipStyle = statusStyles[row.status as keyof typeof statusStyles];

              return (
                <TableRowWithClick
                  key={row.id}
                  row={row}
                  isSelected={isSelected}
                  chipStyle={chipStyle}
                  selectOne={selectOne}
                  deselectOne={deselectOne}
                  onDelete={onDelete}
                />
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}

function TableRowWithClick({
  row,
  isSelected,
  chipStyle,
  selectOne,
  deselectOne,
  onDelete,
}: {
  row: Scenario;
  isSelected: boolean;
  chipStyle: { label: string; backgroundColor: string; color: string };
  selectOne: (id: string) => void;
  deselectOne: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const handleRowClick = (event: React.MouseEvent) => {
    // Check if the click was on a checkbox or delete button
    const isCheckboxClick = (event.target as HTMLElement).closest('input[type="checkbox"]');
    const isDeleteClick = (event.target as HTMLElement).closest('button[aria-label="delete"]');

    if (!isCheckboxClick && !isDeleteClick) {
      setOpen(true);
    }
  };

  return (
    <>
      <TableRow
        hover
        selected={isSelected}
        onClick={handleRowClick}
        sx={{ cursor: 'pointer', '&:hover': { backgroundColor: isSelected ? 'action.selected' : 'action.hover' } }}
      >
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isSelected}
            onChange={(event) => {
              if (event.target.checked) {
                selectOne(row.id);
              } else {
                deselectOne(row.id);
              }
            }}
          />
        </TableCell>
        <TableCell>{row.reference}</TableCell>
        <TableCell>{row.title}</TableCell>
        <TableCell>
          <Chip
            label={chipStyle?.label || row.status}
            size="small"
            sx={{
              backgroundColor: chipStyle?.backgroundColor || '#eee',
              color: chipStyle?.color || '#000',
              fontWeight: 500,
            }}
          />
        </TableCell>
        <TableCell align="center" onClick={(e) => e.stopPropagation()}>
          <IconButton color="error" onClick={() => onDelete(row.id)} aria-label="delete">
            <Trash />
          </IconButton>
        </TableCell>
      </TableRow>

      <ScenarioDialog open={open} onClose={() => setOpen(false)} scenario={row} />
    </>
  );
}

function ScenarioDialog({
  open,
  onClose,
  scenario,
}: {
  open: boolean;
  onClose: () => void;
  scenario: Scenario;
}): React.JSX.Element {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6" component="div">
            Scenario Details
          </Typography>
          <Chip
            label={scenario.status}
            color={
              scenario.status === 'completed' ? 'success' : scenario.status === 'in-review' ? 'warning' : 'default'
            }
            size="small"
          />
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Basic Information
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Reference
                    </Typography>
                    <Typography>{scenario.reference}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Title
                    </Typography>
                    <Typography>{scenario.title}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Type
                    </Typography>
                    <Typography textTransform="capitalize">{scenario.scenarioType}</Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    minHeight: '100px',
                    p: 1,
                    bgcolor: scenario.description ? 'transparent' : 'action.hover',
                    borderRadius: 1,
                  }}
                >
                  {scenario.description || 'No description provided'}
                </Typography>
              </Paper>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Analysis Results
              </Typography>
              <Divider sx={{ my: 1 }} />
              {scenario.result ? (
                <Typography
                  component="div"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    p: 1,
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                  }}
                >
                  {scenario.result}
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '200px',
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                  }}
                >
                  <Typography color="text.secondary">No analysis results available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          startIcon={<Download />}
          onClick={() => {
            // Download functionality would go here
            console.log('Download scenario:', scenario.id);
          }}
        >
          Export
        </Button>
        <Button variant="contained" onClick={onClose} sx={{ minWidth: '100px' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
