import { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { employeeService, payrollService } from '../services/api';

const Payroll = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const response = await employeeService.getAll();
      setEmployees(response.data);
      setError('');
    } catch (err) {
      setError('Error fetching employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const calculatedPayroll = {
        employeeId: payrollData.employee,
        month: parseInt(payrollData.month),
        year: parseInt(payrollData.year),
        basicSalary: parseFloat(payrollData.basicSalary),
        allowances: parseFloat(payrollData.allowances) || 0,
        deductions: parseFloat(payrollData.deductions) || 0
      };

      const response = await payrollService.calculate(calculatedPayroll);
      setCalculationResult(response.data);
      setError('');
    } catch (err) {
      setError('Error calculating payroll. Please check all fields and try again.');
      console.error('Payroll calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !calculationResult) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3,
          fontWeight: 500,
          color: '#1a1a1a'
        }}
      >
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
              <TextField
                select
                fullWidth
                label="Select Employee"
                value={payrollData.employee}
                onChange={(e) => setPayrollData({ ...payrollData, employee: e.target.value })}
                required
              >
                {employees.map((emp) => (
                  <MenuItem key={emp._id} value={emp._id}>
                    {`${emp.firstName} ${emp.lastName}`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Month"
                value={payrollData.month}
                onChange={(e) => setPayrollData({ ...payrollData, month: e.target.value })}
                required
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {new Date(2024, i, 1).toLocaleString('default', { month: 'long' })}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={payrollData.year}
                onChange={(e) => setPayrollData({ ...payrollData, year: e.target.value })}
                required
                InputProps={{ inputProps: { min: 2000, max: 2100 } }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Basic Salary"
                type="number"
                value={payrollData.basicSalary}
                onChange={(e) => setPayrollData({ ...payrollData, basicSalary: e.target.value })}
                required
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Allowances"
                type="number"
                value={payrollData.allowances}
                onChange={(e) => setPayrollData({ ...payrollData, allowances: e.target.value })}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Deductions"
                type="number"
                value={payrollData.deductions}
                onChange={(e) => setPayrollData({ ...payrollData, deductions: e.target.value })}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  disabled={loading}
                >
                  {loading ? 'Calculating...' : 'Calculate Payroll'}
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
                  <Typography variant="h6" color="primary.main">
                    ${calculationResult.netSalary?.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Payroll;