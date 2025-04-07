import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AIFeatures from '../components/features/AIFeatures';
import ContactForm from '../components/contact/ContactForm';
import {
  Box,
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  CheckCircle,
  Speed,
  Security,
  Assessment,
  CloudQueue,
} from '@mui/icons-material';
import { authService } from '../services/api';
import { loginSuccess, loginFailure } from '../store/slices/authSlice';

const LandingPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.login(formData);
      dispatch(loginSuccess(response.data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Speed color="primary" />,
      title: 'Streamlined Payroll Processing',
      description: 'Automate your payroll calculations, tax deductions, and salary disbursements.'
    },
    {
      icon: <Security color="primary" />,
      title: 'Secure & Compliant',
      description: 'Built-in compliance with labor laws and data security regulations.'
    },
    {
      icon: <Assessment color="primary" />,
      title: 'Advanced Analytics',
      description: 'Comprehensive reporting and insights for better decision-making.'
    },
    {
      icon: <CloudQueue color="primary" />,
      title: 'Cloud-Based Solution',
      description: 'Access your HR system anywhere, anytime with cloud technology.'
    },
  ];

  const benefits = [
    'Reduce payroll processing time by 60%',
    'Eliminate manual calculation errors',
    'Ensure tax compliance and accurate deductions',
    'Improve employee satisfaction with timely payments',
    'Generate instant reports and analytics',
    'Secure data management and backup',
  ];

  return (
    <Box sx={{ bgcolor: '#f5f5f5' }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            py: { xs: 8, md: 12 },
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 700,
                    mb: 2
                  }}
                >
                  Transform Your HR & Payroll Management
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                  Streamline your HR operations with our comprehensive payroll and employee management solution
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'grey.100',
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Request Demo
                </Button>
              </Grid>
              <Grid item xs={12} md={5}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 4,
                      bgcolor: 'white',
                      borderRadius: 2,
                      boxShadow: theme.shadows[8]
                    }}
                  >
                    <Typography variant="h5" sx={{ mb: 3 }}>
                      Login to Your Account
                    </Typography>
                    {error && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                      </Alert>
                    )}
                    <form onSubmit={handleSubmit}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        margin="normal"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                      <TextField
                        fullWidth
                        label="Password"
                        margin="normal"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        sx={{ 
                          mt: 3,
                          height: 48,
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                          }
                        }}
                      >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </form>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Container sx={{ py: 8 }}>
          <Typography 
            variant="h2" 
            align="center" 
            sx={{ mb: 6 }}
          >
            Powerful Features for Modern HR
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    sx={{ 
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[8]
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {feature.title}
                      </Typography>
                      <Typography color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
          <Container>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h3" sx={{ mb: 4 }}>
                  Why Choose Our HR Payroll System?
                </Typography>
                <List>
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={benefit} />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Box 
                    component="img"
                    src="/path-to-your-image.png" // Add your image
                    alt="HR System Benefits"
                    sx={{ 
                      width: '100%',
                      borderRadius: 2,
                      boxShadow: 3
                    }}
                  />
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </motion.div>

      {/* AI Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <AIFeatures />
      </motion.div>

      {/* Contact Form Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <ContactForm />
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
          <Container>
            <Typography 
              variant="h3" 
              align="center"
              sx={{ mb: 3 }}
            >
              Ready to Transform Your HR Operations?
            </Typography>
            <Typography 
              align="center"
              sx={{ mb: 4 }}
            >
              Join thousands of companies using our HR Payroll System
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Get Started Now
              </Button>
            </Box>
          </Container>
        </Box>
      </motion.div>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 4 }}>
        <Container>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} HR Payroll System. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;