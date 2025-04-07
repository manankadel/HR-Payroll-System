import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Tooltip
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: { xs: '0 16px', sm: '0 24px' }
          }}
        >
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            HR Payroll System
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button 
              color="primary" 
              component={Link} 
              to="/"
              sx={{ fontWeight: 500 }}
            >
              Dashboard
            </Button>
            <Button 
              color="primary" 
              component={Link} 
              to="/employees"
              sx={{ fontWeight: 500 }}
            >
              Employees
            </Button>
            <Button 
              color="primary" 
              component={Link} 
              to="/payroll"
              sx={{ fontWeight: 500 }}
            >
              Payroll
            </Button>
            <Tooltip title="Logout">
              <IconButton 
                onClick={handleLogout}
                sx={{ 
                  ml: 1,
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'primary.dark'
                  }
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;