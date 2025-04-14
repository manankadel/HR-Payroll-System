import { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Paper,
  Box,
  Container,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import {
  People as PeopleIcon,
  AccountBalance as PayrollIcon,
  EventBusy as LeaveIcon,
  Payment as SalaryIcon,
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { employeeService, payrollService } from '../services/api';

const Dashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    monthlyPayroll: 0,
    leavesTaken: 0,
    salaryDisbursed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [departmentDistribution, setDepartmentDistribution] = useState([]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch employees data
        const employeesResponse = await employeeService.getAll();
        
        // Fetch payroll history
        let payrollData = [];
        try {
          const payrollResponse = await payrollService.getHistory();
          if (payrollResponse.data && payrollResponse.data.length > 0) {
            payrollData = payrollResponse.data.map(p => ({
              month: new Date(p.processedDate).toLocaleString('default', { month: 'short' }),
              amount: p.netSalary
            })).slice(-6); // Get last 6 months
          }
        } catch (err) {
          console.error('Payroll fetch error:', err);
        }

        // Fetch department stats
        let deptData = [];
        try {
          const deptResponse = await employeeService.getDepartmentStats();
          if (deptResponse.data) {
            deptData = deptResponse.data;
          }
        } catch (err) {
          console.error('Department stats fetch error:', err);
        }

        // Calculate total salary
        const totalSalary = employeesResponse.data.reduce((sum, emp) => 
          sum + (Number(emp.salary) || 0), 0
        );

        setStats({
          totalEmployees: employeesResponse.data.length,
          monthlyPayroll: totalSalary,
          leavesTaken: 0, // Will be implemented later
          salaryDisbursed: totalSalary,
        });

        setPayrollHistory(payrollData);
        setDepartmentDistribution(deptData);

      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        setError('Unable to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  // KPI Card Component
  const StatsCard = ({ title, value, icon, color }) => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        height: 140,
        bgcolor: color,
        color: 'white',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: (theme) => theme.shadows[10]
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        {icon}
      </Box>
      <Typography variant="h3">{value}</Typography>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {`${getGreeting()}!`}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {getCurrentDate()}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={<PeopleIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Monthly Payroll"
            value={`$${stats.monthlyPayroll.toLocaleString()}`}
            icon={<PayrollIcon />}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Leaves Taken"
            value={stats.leavesTaken}
            icon={<LeaveIcon />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Salary Disbursed"
            value={`$${stats.salaryDisbursed.toLocaleString()}`}
            icon={<SalaryIcon />}
            color={theme.palette.success.main}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Payroll Trend
            </Typography>
            {payrollHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={payrollHistory}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke={theme.palette.primary.main} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Typography color="text.secondary">
                  No payroll data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Department Distribution
            </Typography>
            {departmentDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={departmentDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {departmentDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={theme.palette.primary[`${(index + 3) * 100}`]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Typography color="text.secondary">
                  No department data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;