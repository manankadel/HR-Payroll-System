import { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Paper,
  Box,
  Container,
  CircularProgress,
  Alert
} from '@mui/material';
import { employeeService, payrollService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    monthlyPayroll: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch data in parallel for better performance
        const [employeesResponse, payrollResponse] = await Promise.all([
          employeeService.getAll(),
          payrollService.getHistory()
        ]);
        
        setStats({
          totalEmployees: employeesResponse.data.length,
          monthlyPayroll: calculateTotalPayroll(employeesResponse.data),
          pendingApprovals: payrollResponse.data.filter(p => p.status === 'pending').length || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const calculateTotalPayroll = (employees) => {
    return employees.reduce((total, emp) => {
      const salary = Number(emp.salary) || 0;
      return total + salary;
    }, 0);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.light',
              color: 'white',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: (theme) => theme.shadows[10]
              }
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Employees
            </Typography>
            <Typography variant="h3">
              {stats.totalEmployees}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'secondary.light',
              color: 'white',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: (theme) => theme.shadows[10]
              }
            }}
          >
            <Typography variant="h6" gutterBottom>
              Monthly Payroll
            </Typography>
            <Typography variant="h3">
              ${stats.monthlyPayroll.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.light',
              color: 'white',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: (theme) => theme.shadows[10]
              }
            }}
          >
            <Typography variant="h6" gutterBottom>
              Pending Approvals
            </Typography>
            <Typography variant="h3">
              {stats.pendingApprovals}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;