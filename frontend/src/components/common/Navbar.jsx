import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Payment,
  Logout,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "../../store/slices/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pages = [
    { title: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { title: 'Employees', path: '/employees', icon: <People /> },
    { title: 'Payroll', path: '/payroll', icon: <Payment /> },
  ];

  const userMenuItems = [
    { title: 'Logout', icon: <Logout />, action: handleLogout },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  async function handleLogout() {
    try {
      await dispatch(logout());
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {pages.map((page) => (
          <ListItem
            button
            key={page.title}
            onClick={() => {
              navigate(page.path);
              setMobileOpen(false);
            }}
          >
            <ListItemIcon>{page.icon}</ListItemIcon>
            <ListItemText primary={page.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="fixed" 
      sx={{
        width: '240px',
        height: '100vh',
        backgroundColor: '#2196f3',
        boxShadow: 'none',
        left: 0, // Ensure it's on the left
    right: 'auto', 
      }}
    >
      <Container 
        sx={{ 
          height: '100%',
          padding: '16px 0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar 
          disableGutters 
          sx={{ 
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%',
            height: 'auto',
          }}
        >
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mb: 4,
              fontWeight: 700,
              color: 'white',
              cursor: 'pointer',
              pl: 2
            }}
            onClick={() => navigate('/dashboard')}
          >
            HR PAYROLL
          </Typography>

          {/* Navigation Items */}
          <Box sx={{ width: '100%', mb: 2 }}>
            {isAuthenticated && pages.map((page) => (
              <Button
                key={page.title}
                onClick={() => navigate(page.path)}
                sx={{
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  width: '100%',
                  justifyContent: 'flex-start',
                  py: 1.5,
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {page.icon}
                {page.title}
              </Button>
            ))}
          </Box>

          {/* Mobile menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              variant="temporary"
              anchor="left"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
            >
              {drawer}
            </Drawer>
          </Box>

          {/* User menu at bottom */}
          {isAuthenticated ? (
            <Box sx={{ mt: 'auto', width: '100%' }}>
              <Button
                onClick={handleLogout}
                sx={{
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  width: '100%',
                  justifyContent: 'flex-start',
                  py: 1.5,
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Logout />
                Logout
              </Button>
            </Box>
          ) : (
            <Button
              color="inherit"
              onClick={() => navigate('/')}
              sx={{ mt: 'auto' }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;