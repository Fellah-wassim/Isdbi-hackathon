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

import { ScenariosFilters } from '@/components/dashboard/scenarios/scenarios-filters';
import { ScenariosTable } from '@/components/dashboard/scenarios/scenarios-table';
import type { Scenario } from '@/components/dashboard/scenarios/scenarios-table';

const initialScenarios = [
  {
    id: 'REF-001',
    reference: 'REF-001',
    title: 'Ijarah MBT Contract with Super Generators',
    status: 'in-review',
    description: `On 1 January 2019, Alpha Islamic Bank entered into an Ijarah Muntahia Bittamleek (IMBT) agreement with Super Generators for the lease of a heavy-duty generator. The purchase cost was USD 450,000, with additional import tax and freight charges. The lease is for 2 years, with annual rent of USD 300,000 and a likely transfer of ownership at the end.`,
    scenarioType: 'full',
    result: `
      **FAS Detection:** Ijarah Muntahia Bittamleek  
      **Accounting Entry:**  
      - Right of Use Asset: USD 492,000  
      - Lease Liability: USD 600,000  
      - Depreciation: USD 246,000/year  
      **Suggested Enhancement:** Include tax impact of ownership transfer.
    `.trim(),
    date: '2024-05-01',
    fas: 'FAS Ijarah MBT',
  },
  {
    id: 'REF-002',
    reference: 'REF-002',
    title: 'Murabaha Investment by ABC Company',
    status: 'completed',
    description: `ABC Company wants to invest $10,000 using /**product Murabaha Investment-Short Term*/. The investment is structured as a deferred payment sale with a markup of 8%.`,
    scenarioType: 'product',
    result: `
      **FAS Detection:** Murabaha  
      **Accounting Entry:**  
      - Investment Asset (Murabaha Receivable): $10,800  
      - Revenue Recognition over tenure  
      **Suggested Enhancement:** Add risk disclosure and payment terms.
    `.trim(),
    date: '2024-04-18',
    fas: 'FAS Murabaha',
  },
  {
    id: 'REF-003',
    reference: 'REF-003',
    title: 'Salam Financing Scenario - Wheat Purchase',
    status: 'completed',
    description: `On March 1, 2024, DEF Bank entered into a Salam contract with a local farmer to purchase 100 tons of wheat, paying $50,000 upfront. Delivery is expected in 6 months.`,
    scenarioType: 'full',
    result: `
      **FAS Detection:** Salam  
      **Accounting Entry:**  
      - Salam Asset: $50,000  
      - Upon Delivery: Inventory Recognition or Cost of Goods Sold  
      **Suggested Enhancement:** Add delivery risk mitigation.
    `.trim(),
    date: '2024-03-01',
    fas: 'FAS Salam',
  },
  {
    id: 'REF-004',
    reference: 'REF-004',
    title: 'Istisna for Construction Project',
    status: 'completed',
    description: `GHI Bank agreed to finance the construction of a school under Istisna'a. Total cost agreed is $150,000. Payments are made in 3 milestones over 12 months.`,
    scenarioType: 'full',
    result: `
      **FAS Detection:** Istisna'a  
      **Accounting Entry:**  
      - Istisna Asset: As per project milestones  
      - Revenue and Expense Recognition: Percentage of Completion  
      **Suggested Enhancement:** Include penalty clause for delay.
    `.trim(),
    date: '2024-02-15',
    fas: 'FAS Istisna’a',
  },
] satisfies Scenario[];

interface Product {
  id: string;
  reference: string;
  name: string;
  type: string;
  terms: Array<{ value: string; unit: string; description: string }>;
  status: string;
}

export default function Page(): React.JSX.Element {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newScenario, setNewScenario] = useState<Partial<Scenario>>({
    title: '',
    description: '',
    scenarioType: 'full',
    subType: 'accounting',
    result: '',
    selectedProduct: '',
  });
  const [currentView, setCurrentView] = useState<'list' | 'create'>('list');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [scenarioToDelete, setScenarioToDelete] = useState<string | null>(null);

  useEffect(() => {
    const savedScenarios = localStorage.getItem('scenarios');
    if (savedScenarios) {
      setScenarios(JSON.parse(savedScenarios));
    } else {
      setScenarios(initialScenarios);
      localStorage.setItem('scenarios', JSON.stringify(initialScenarios));
    }

    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        setProducts(Array.isArray(parsedProducts) ? parsedProducts : []);
      } catch (error) {
        console.error('Error parsing products:', error);
        setProducts([]);
      }
    }
  }, []);

  const page = 0;
  const rowsPerPage = 25;

  const paginatedScenarios = applyPagination(scenarios, page, rowsPerPage);

  const handleDeleteClick = (id: string) => {
    setScenarioToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (scenarioToDelete) {
      const updatedScenarios = scenarios.filter((scenario) => scenario.id !== scenarioToDelete);
      setScenarios(updatedScenarios);
      localStorage.setItem('scenarios', JSON.stringify(updatedScenarios));
      setDeleteConfirmOpen(false);
      setScenarioToDelete(null);
    }
  };

  const handleAddScenario = () => {
    setCurrentView('create');
    setOpenDialog(true);
  };

  const generateResult = (scenario: Partial<Scenario>): string => {
    if (scenario.scenarioType === 'product' && scenario.selectedProduct) {
      const product = products.find((p) => p.id === scenario.selectedProduct);
      return (
        `Product Scenario for ${product?.name || 'selected product'} (${product?.type || 'product type'})\n\n` +
        `Product Terms:\n${product?.terms.map((term) => `- ${term.value} ${term.unit}: ${term.description}`).join('\n') || 'No terms specified'}`
      );
    }

    switch (scenario.subType) {
      case 'accounting':
        return `Accounting Entry Details:\n${scenario.description || ''}`;
      case 'fas':
        return `**FAS Detection:** Parallel Salam  
      **Accounting Entry:**  
      - Liability (Deferred Revenue): $75,000  
      - Revenue Recognized Upon Delivery  
      **Suggested Enhancement:** Monitor hedging for price fluctuation risk.`;
      case 'enhancement':
        return 'Suggested Enhancements:\n1. Add detailed payment schedule\n2. Include tax implications\n3. Add disclosure requirements';
      default:
        return 'Results will appear here based on scenario type';
    }
  };

  const handleGenerateResult = () => {
    const result = generateResult(newScenario);
    setNewScenario({ ...newScenario, result });
  };

  const handleSaveScenario = () => {
    const scenarioToAdd: Scenario = {
      id: `REF-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`,
      reference: `REF-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`,
      title: newScenario.title || 'New Scenario',
      status: 'in-review',
      description: newScenario.description || '',
      scenarioType: newScenario.scenarioType || 'full',
      result: newScenario.result || generateResult(newScenario),
    };

    const updatedScenarios = [...scenarios, scenarioToAdd];
    setScenarios(updatedScenarios);
    localStorage.setItem('scenarios', JSON.stringify(updatedScenarios));
    setOpenDialog(false);
    setNewScenario({
      title: '',
      description: '',
      scenarioType: 'full',
      subType: 'accounting',
      result: '',
      selectedProduct: '',
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
          <Typography variant="h4">Scenarios</Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            sx={{
              borderRadius: '8px',
              backgroundColor: '#3BA935',
            }}
            onClick={handleAddScenario}
          >
            Create Scenario
          </Button>
          <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
            Upload
          </Button>
        </Stack>
      </Stack>
      <ScenariosFilters />
      <ScenariosTable
        count={paginatedScenarios.length}
        page={page}
        rows={paginatedScenarios}
        rowsPerPage={rowsPerPage}
        onDelete={handleDeleteClick}
      />

      {/* Create Scenario Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="lg">
        {currentView === 'create' ? (
          <>
            <DialogTitle>
              <Typography variant="h6">Create New Scenario</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Scenario Title"
                    value={newScenario.title}
                    onChange={(e) => setNewScenario({ ...newScenario, title: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={3}>
                    <FormControl fullWidth>
                      <InputLabel>Scenario Type</InputLabel>
                      <Select
                        value={newScenario.scenarioType}
                        label="Scenario Type"
                        onChange={(e) =>
                          setNewScenario({
                            ...newScenario,
                            scenarioType: e.target.value as 'full' | 'product',
                            subType: e.target.value === 'full' ? 'accounting' : undefined,
                            selectedProduct: e.target.value === 'product' ? '' : undefined,
                          })
                        }
                      >
                        <MenuItem value="full">Full Scenario</MenuItem>
                        <MenuItem value="product">Product Scenario</MenuItem>
                      </Select>
                    </FormControl>

                    {newScenario.scenarioType === 'full' && (
                      <FormControl fullWidth>
                        <InputLabel>Scenario Sub-Type</InputLabel>
                        <Select
                          value={newScenario.subType}
                          label="Scenario Sub-Type"
                          onChange={(e) => setNewScenario({ ...newScenario, subType: e.target.value as any })}
                        >
                          <MenuItem value="accounting">Accounting Entry</MenuItem>
                          <MenuItem value="fas">FAS Detection</MenuItem>
                          <MenuItem value="enhancement">Enhancement</MenuItem>
                        </Select>
                      </FormControl>
                    )}

                    {newScenario.scenarioType === 'product' && (
                      <FormControl fullWidth>
                        <InputLabel>Select Product</InputLabel>
                        <Select
                          value={newScenario.selectedProduct}
                          label="Select Product"
                          onChange={(e) => setNewScenario({ ...newScenario, selectedProduct: e.target.value })}
                        >
                          {products.map((product) => (
                            <MenuItem key={product.id} value={product.id}>
                              {product.name} ({product.type})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}

                    <TextField
                      placeholder={
                        newScenario.scenarioType === 'full'
                          ? newScenario.subType === 'accounting'
                            ? 'Enter accounting entry details...'
                            : newScenario.subType === 'fas'
                              ? 'Ask which FAS this scenario applies to...'
                              : 'Request enhancements for this scenario...'
                          : 'Describe the product scenario...'
                      }
                      multiline
                      rows={6}
                      value={newScenario.description}
                      onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
                      fullWidth
                    />
                    <Button variant="contained" onClick={handleGenerateResult}>
                      Generate Results
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2, height: '100%', minHeight: '400px' }}>
                    <Typography variant="h6" gutterBottom>
                      Results
                    </Typography>
                    {newScenario.result ? (
                      <Typography component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                        {newScenario.result}
                      </Typography>
                    ) : (
                      <Typography color="text.secondary">Results will appear here after generation</Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={handleDownload} startIcon={<DownloadIcon />}>
                Download Report
              </Button>
              <Button onClick={handleSaveScenario} variant="contained" color="primary">
                Save Scenario
              </Button>
            </DialogActions>
          </>
        ) : null}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this scenario?</Typography>
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

function applyPagination(rows: Scenario[], page: number, rowsPerPage: number): Scenario[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
