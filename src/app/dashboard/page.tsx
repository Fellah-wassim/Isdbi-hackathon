'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Product {
  id: string;
  name: string;
  type: string;
  terms: { value: string; unit: string; description: string }[];
}

interface Scenario {
  id: string;
  scenarioType: string;
  status: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00C49F', '#FFBB28'];

export default function LocalStatsWidget() {
  const [products, setProducts] = useState<Product[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  useEffect(() => {
    try {
      const productsRaw = localStorage.getItem('products');
      const scenariosRaw = localStorage.getItem('scenarios');
      setProducts(productsRaw ? JSON.parse(productsRaw) : []);
      setScenarios(scenariosRaw ? JSON.parse(scenariosRaw) : []);
    } catch (e) {
      console.error('Failed to parse localStorage data:', e);
    }
  }, []);

  const productTypeCounts = products.reduce((acc: Record<string, number>, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {});
  const productTypeData = Object.entries(productTypeCounts).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  const scenarioTypeCounts = scenarios.reduce((acc: Record<string, number>, s) => {
    acc[s.scenarioType] = (acc[s.scenarioType] || 0) + 1;
    return acc;
  }, {});
  const scenarioTypeData = Object.entries(scenarioTypeCounts).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  const scenarioStatusCounts = scenarios.reduce((acc: Record<string, number>, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, []);
  const scenarioStatusData = Object.entries(scenarioStatusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const unitCounts: Record<string, number> = {};
  products.forEach((product) => {
    product.terms.forEach((term) => {
      unitCounts[term.unit] = (unitCounts[term.unit] || 0) + 1;
    });
  });
  const unitData = Object.entries(unitCounts).map(([unit, count]) => ({
    name: unit,
    value: count,
  }));

  const avgTerms =
    products.length > 0 ? (products.reduce((acc, p) => acc + p.terms.length, 0) / products.length).toFixed(2) : '0';

  return (
    <Grid container spacing={3}>
      {/* Summary cards */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h6">Total Products</Typography>
            <Typography variant="h4" color="primary">
              {products.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h6">Total Scenarios</Typography>
            <Typography variant="h4" color="secondary">
              {scenarios.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h6">Avg Terms/Product</Typography>
            <Typography variant="h4" color="text.secondary">
              {avgTerms}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h6">Units Used</Typography>
            <Typography variant="h4" color="text.secondary">
              {Object.keys(unitCounts).length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Product Types Distribution
            </Typography>
            {productTypeData.length === 0 ? (
              <Typography>No data</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={productTypeData} dataKey="value" outerRadius={80} label>
                    {productTypeData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Scenario Types Distribution
            </Typography>
            {scenarioTypeData.length === 0 ? (
              <Typography>No data</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={scenarioTypeData} dataKey="value" outerRadius={80} label>
                    {scenarioTypeData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Scenario Status
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={scenarioStatusData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Units Usage in Product Terms
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={unitData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
