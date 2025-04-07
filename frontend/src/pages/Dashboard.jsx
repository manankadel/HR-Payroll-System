import { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Paper,
  Box,
  Container
} from '@mui/material';
import { employeeService, payrollService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    monthlyPayroll: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const employeesResponse = await employeeService.getAll();
        const payrollResponse = await payrollService.getHistory();
        
        setStats({
          totalEmployees: employeesResponse.data.length,
          monthlyPayroll: calculateTotalPayroll(employeesResponse.data),
          pendingApprovals: 0 // You can implement this based on your needs
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const calculateTotalPayroll = (employees) => {
    return employees.reduce((total, emp) => total + (emp.salary || 0), 0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.light',
              color: 'white'
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
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'secondary.light',
              color: 'white'
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
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.light',
              color: 'white'
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