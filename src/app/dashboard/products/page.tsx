'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';

import { ProductsFilters } from '@/components/dashboard/products/ProductFilters';
import { ProductsTable } from '@/components/dashboard/products/ProductsTable';

interface Term {
  value: string;
  unit: string;
  description: string;
}

interface Product {
  id: string;
  reference: string;
  name: string;
  type: string;
  terms: Term[];
  status: 'active' | 'inactive';
}

const initialProducts = [
  {
    id: 'PROD-001',
    reference: 'PROD-001',
    name: 'Murabaha Finance',
    type: 'Murabaha and Murabaha to the Purchase Orderer',
    status: 'active',
    terms: [
      { value: '12', unit: 'mo', description: 'Financing period' },
      { value: '5.5', unit: '%', description: 'Profit rate' },
    ],
  },
  {
    id: 'PROD-002',
    reference: 'PROD-002',
    name: 'Ijarah Vehicle',
    type: 'Ijarah and Ijarah Muntahia Bittamleek',
    status: 'active',
    terms: [
      { value: '36', unit: 'mo', description: 'Lease term' },
      { value: '1000', unit: 'USD', description: 'Monthly payment' },
    ],
  },
  {
    id: 'PROD-003',
    reference: 'PROD-003',
    name: 'Salam Cotton Prepayment',
    type: 'Salam and Parallel Salam',
    status: 'draft',
    terms: [
      { value: '6', unit: 'mo', description: 'Delivery period' },
      { value: '50000', unit: 'USD', description: 'Advance payment' },
      { value: '100', unit: '#', description: 'Quantity of cotton bales' },
    ],
  },
  {
    id: 'PROD-004',
    reference: 'PROD-004',
    name: 'Istisna School Project',
    type: "Istisna'a and Parallel Istisna'a",
    status: 'active',
    terms: [
      { value: '12', unit: 'mo', description: 'Construction duration' },
      { value: '150000', unit: 'USD', description: 'Total project cost' },
      { value: '3', unit: '#', description: 'Payment milestones' },
    ],
  },
  {
    id: 'PROD-005',
    reference: 'PROD-005',
    name: 'Murabaha Short-Term Trade',
    type: 'Murabaha and Other Deferred Payment Sales',
    status: 'active',
    terms: [
      { value: '4', unit: 'mo', description: 'Tenure' },
      { value: '7', unit: '%', description: 'Markup rate' },
      { value: '20000', unit: 'USD', description: 'Principal amount' },
    ],
  },
  {
    id: 'PROD-006',
    reference: 'PROD-006',
    name: 'Parallel Salam - Rice Export',
    type: 'Salam and Parallel Salam',
    status: 'active',
    terms: [
      { value: '180', unit: 'd', description: 'Delivery time' },
      { value: '70000', unit: 'USD', description: 'Upfront payment received' },
      { value: '150', unit: '#', description: 'Tons of rice to deliver' },
    ],
  },
] satisfies Product[];

const productTypes = [
  'Murabaha and Murabaha to the Purchase Orderer',
  'Salam and Parallel Salam',
  "Istisna'a and Parallel Istisna'a",
  'Murabaha and Other Deferred Payment Sales',
  'Ijarah and Ijarah Muntahia Bittamleek',
];

const unitTypes = [
  { value: 'd', label: 'Days (d)' },
  { value: 'wk', label: 'Weeks (wk)' },
  { value: 'mo', label: 'Months (mo)' },
  { value: 'yr', label: 'Years (yr)' },
  { value: 'DZD', label: 'DZD' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: '%', label: '%' },
  { value: '#', label: 'Amount (Number of Unit)' },
];

export default function Page(): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    type: '',
    terms: [{ value: '', unit: 'mo', description: '' }],
  });
  const [currentView, setCurrentView] = useState<'list' | 'create'>('list');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ search: string; status: string; type: string }>({
    search: '',
    status: 'all',
    type: 'all',
  });

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
  }, []);

  useEffect(() => {
    let result = [...products];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) || product.reference.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status !== 'all') {
      result = result.filter((product) => product.status === filters.status);
    }

    if (filters.type !== 'all') {
      result = result.filter((product) => product.type === filters.type);
    }

    setFilteredProducts(result);
  }, [products, filters]);

  const page = 0;
  const rowsPerPage = 25;

  const paginatedProducts = applyPagination(filteredProducts, page, rowsPerPage);

  const handleFiltersChange = (newFilters: { search: string; status: string; type: string }) => {
    setFilters(newFilters);
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      const updatedProducts = products.filter((product) => product.id !== productToDelete);
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const handleAddProduct = () => {
    setCurrentView('create');
    setOpenDialog(true);
  };

  const handleAddTerm = () => {
    setNewProduct({
      ...newProduct,
      terms: [...(newProduct.terms || []), { value: '', unit: 'mo', description: '' }],
    });
  };

  const handleRemoveTerm = (index: number) => {
    const updatedTerms = [...(newProduct.terms || [])];
    updatedTerms.splice(index, 1);
    setNewProduct({ ...newProduct, terms: updatedTerms });
  };

  const handleTermChange = (index: number, field: keyof Term, value: string) => {
    const updatedTerms = [...(newProduct.terms || [])];
    updatedTerms[index] = { ...updatedTerms[index], [field]: value };
    setNewProduct({ ...newProduct, terms: updatedTerms });
  };

  const handleSaveProduct = () => {
    const productToAdd: Product = {
      id: `PROD-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`,
      reference: `PROD-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`,
      name: newProduct.name || 'New Product',
      type: newProduct.type || '',
      terms: newProduct.terms || [],
      status: 'active',
    };

    const updatedProducts = [...products, productToAdd];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setOpenDialog(false);
    setNewProduct({
      name: '',
      type: '',
      terms: [{ value: '', unit: 'mo', description: '' }],
    });
    setCurrentView('list');
  };

  const handleDownload = () => {
    alert('Download functionality would be implemented here');
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Products</Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            sx={{
              borderRadius: '8px',
              backgroundColor: '#3BA935',
            }}
            onClick={handleAddProduct}
          >
            Create Product
          </Button>
          <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
            Upload
          </Button>
        </Stack>
      </Stack>
      <ProductsFilters onFiltersChange={handleFiltersChange} />
      <ProductsTable
        count={filteredProducts.length}
        page={page}
        rows={paginatedProducts}
        rowsPerPage={rowsPerPage}
        onDelete={handleDeleteClick}
      />

      {/* Create Product Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="lg">
        {currentView === 'create' ? (
          <>
            <DialogTitle>
              <Typography variant="h6">Create New Product</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={3}>
                    <TextField
                      label="Product Name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      fullWidth
                    />

                    <FormControl fullWidth>
                      <InputLabel>Product Type</InputLabel>
                      <Select
                        value={newProduct.type}
                        label="Product Type"
                        onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                      >
                        {productTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                      Terms
                    </Typography>
                    <Stack spacing={2}>
                      {(newProduct.terms || []).map((term, index) => (
                        <Paper
                          key={index}
                          variant="outlined"
                          sx={{
                            p: 3,
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                            backgroundColor: 'background.paper',
                            transition: 'box-shadow 0.2s ease-in-out',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            },
                          }}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={4}>
                              <TextField
                                label="Value"
                                value={term.value}
                                onChange={(e) => handleTermChange(index, 'value', e.target.value)}
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    backgroundColor: '#f5f5f5',
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FormControl fullWidth>
                                <InputLabel>Unit</InputLabel>
                                <Select
                                  value={term.unit}
                                  label="Unit"
                                  onChange={(e) => handleTermChange(index, 'unit', e.target.value)}
                                  size="small"
                                  sx={{
                                    borderRadius: '8px',
                                    backgroundColor: '#f5f5f5',
                                  }}
                                >
                                  {unitTypes.map((unit) => (
                                    <MenuItem key={unit.value} value={unit.value}>
                                      {unit.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <TextField
                                label="Description"
                                value={term.description}
                                onChange={(e) => handleTermChange(index, 'description', e.target.value)}
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    backgroundColor: '#f5f5f5',
                                  },
                                }}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={1}
                              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            >
                              <IconButton
                                onClick={() => handleRemoveTerm(index)}
                                sx={{
                                  color: 'error.main',
                                  '&:hover': {
                                    backgroundColor: 'error.light',
                                    color: 'error.contrastText',
                                  },
                                  borderRadius: '50%',
                                }}
                              >
                                <TrashIcon fontSize="var(--icon-fontSize-md)" />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                      <Button
                        onClick={handleAddTerm}
                        startIcon={<PlusIcon />}
                        variant="outlined"
                        sx={{
                          mt: 1,
                          borderRadius: '8px',
                        }}
                      >
                        Add Term
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Product Summary
                    </Typography>
                    {newProduct.name || newProduct.type || (newProduct.terms && newProduct.terms.length > 0) ? (
                      <Stack spacing={2}>
                        <div>
                          <Typography variant="subtitle2">Name:</Typography>
                          <Typography>{newProduct.name || 'Not specified'}</Typography>
                        </div>
                        <div>
                          <Typography variant="subtitle2">Type:</Typography>
                          <Typography>{newProduct.type || 'Not specified'}</Typography>
                        </div>
                        <div>
                          <Typography variant="subtitle2">Terms:</Typography>
                          {newProduct.terms && newProduct.terms.length > 0 ? (
                            <ul>
                              {newProduct.terms.map((term, index) => (
                                <li key={index}>
                                  {term.value} {term.unit} - {term.description}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <Typography>No terms specified</Typography>
                          )}
                        </div>
                      </Stack>
                    ) : (
                      <Typography color="text.secondary">Product details will appear here</Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={handleDownload} startIcon={<DownloadIcon />}>
                Download Template
              </Button>
              <Button onClick={handleSaveProduct} variant="contained" color="primary">
                Save Product
              </Button>
            </DialogActions>
          </>
        ) : null}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" startIcon={<TrashIcon />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

function applyPagination(rows: Product[], page: number, rowsPerPage: number): Product[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
