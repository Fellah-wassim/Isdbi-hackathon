'use client';

import * as React from 'react';
import { Chip } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';

export interface Term {
  value: string;
  unit: string;
  description: string;
}

export interface Product {
  id: string;
  reference: string;
  name: string;
  type: string;
  terms: Term[];
  status: 'active' | 'inactive';
}

interface ProductsTableProps {
  count?: number;
  page?: number;
  rows?: Product[];
  rowsPerPage?: number;
  onDelete?: (id: string) => void;
}

export function ProductsTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 50,
  onDelete,
}: ProductsTableProps): React.JSX.Element {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleRowClick = (product: Product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Paper sx={{ overflow: 'hidden', backgroundColor: 'background.paper' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reference</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Terms</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow hover key={row.id} onClick={() => handleRowClick(row)} sx={{ cursor: 'pointer' }}>
                  <TableCell>
                    <Typography variant="subtitle2">{row.reference}</Typography>
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {row.type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {row.terms.map((term, index) => (
                        <div key={index}>
                          <Typography variant="body2">
                            {term.value} {term.unit} - {term.description}
                          </Typography>
                        </div>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={row.status === 'active' ? 'success' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      onClick={() => {
                        onDelete?.(row.id);
                      }}
                      color="error"
                    >
                      <TrashIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={count}
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* Enhanced Review Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        {selectedProduct ? (
          <>
            <DialogTitle
              sx={{
                py: 2,
                px: 3,
                borderTopLeftRadius: 'inherit',
                borderTopRightRadius: 'inherit',
              }}
            >
              <Typography variant="h6" fontWeight="600">
                Product Details
              </Typography>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* Information Grid */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                        Reference
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedProduct.reference}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                        Status
                      </Typography>
                      <Chip
                        label={selectedProduct.status}
                        color={selectedProduct.status === 'active' ? 'success' : 'error'}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          px: 1,
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                        Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedProduct.name}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                        Type
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedProduct.type}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 1 }} />

                {/* Terms Section */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Terms & Conditions
                  </Typography>

                  <Stack spacing={2}>
                    {selectedProduct.terms.map((term, index) => (
                      <Paper
                        key={index}
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          borderColor: 'divider',
                          backgroundColor: 'background.paper',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: 'primary.main',
                            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 700,
                              color: '#3BA935',
                              mr: 1,
                            }}
                          >
                            {term.value} {term.unit}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {term.description}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions
              sx={{
                px: 3,
                py: 2,
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  px: 3,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                sx={{
                  px: 3,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: 'none',
                }}
                onClick={() => {
                  // Add action for primary button if needed
                  handleClose();
                }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
    </div>
  );
}
