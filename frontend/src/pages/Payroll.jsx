import { useState, useEffect } from 'react';
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
  MenuItem,
  Alert
} from '@mui/material';
import { employeeService, payrollService } from '../services/api';

const Payroll = () => {
  const [employees, setEmployees] = useState([]);
  const [payrollData, setPayrollData] = useState({
    employee: '',
    month: '',
    year: new Date().getFullYear(),
    basicSalary: '',
    allowances: '',
    deductions: ''
  });
  const [calculationResult, setCalculationResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      setEmployees(response.data);
    } catch (err) {
      setError('Error fetching employees');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await payrollService.calculate(payrollData);
      setCalculationResult(response.data);
      setError('');
    } catch (err) {
      setError('Error calculating payroll');
      setCalculationResult(null);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Payroll Calculator
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
                  {employees.map((emp) => (
                    <MenuItem key={emp._id} value={emp._id}>
                      {`${emp.firstName} ${emp.lastName}`}
                    </MenuItem>
                  ))}
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

        {calculationResult && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Calculation Result
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography>Basic Salary:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>${calculationResult.basicSalary?.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Allowances:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>${calculationResult.allowances?.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Deductions:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>${calculationResult.deductions?.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">Net Salary:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">${calculationResult.netSalary?.toLocaleString()}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default Payroll;