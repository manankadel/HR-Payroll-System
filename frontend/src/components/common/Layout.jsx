import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex',
        minHeight: '100vh',
        width: 'calc(100%)',
        position: 'relative'
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          ml: '240px', // Match navbar width
          p: 3,
          bgcolor: '#f5f5f5'
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;