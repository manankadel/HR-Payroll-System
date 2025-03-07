import { useState } from 'react';
import {
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const Payroll = () => {
  const [payrollData, setPayrollData] = useState({
    employee: '',
    month: '',
    year: new Date().getFullYear(),
    basicSalary: '',
    allowances: '',
    deductions: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payroll calculation:', payrollData);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Payroll Calculator
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Employee</InputLabel>
                <Select
                  value={payrollData.employee}
                  onChange={(e) => setPayrollData({ ...payrollData, employee: e.target.value })}
                >
                  <MenuItem value="1">John Doe</MenuItem>
                  <MenuItem value="2">Jane Smith</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Month</InputLabel>
                <Select
                  value={payrollData.month}
                  onChange={(e) => setPayrollData({ ...payrollData, month: e.target.value })}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {new Date(2024, i, 1).toLocaleString('default', { month: 'long' })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={payrollData.year}
                onChange={(e) => setPayrollData({ ...payrollData, year: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Basic Salary"
                type="number"
                value={payrollData.basicSalary}
                onChange={(e) => setPayrollData({ ...payrollData, basicSalary: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Allowances"
                type="number"
                value={payrollData.allowances}
                onChange={(e) => setPayrollData({ ...payrollData, allowances: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Deductions"
                type="number"
                value={payrollData.deductions}
                onChange={(e) => setPayrollData({ ...payrollData, deductions: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" size="large">
                  Calculate Payroll
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default Payroll;