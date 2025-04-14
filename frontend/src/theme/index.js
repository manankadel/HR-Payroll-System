import { createTheme } from '@mui/material';

// Common theme settings
const themeSettings = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.375rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '8px 16px',
          fontSize: '0.875rem',
          borderRadius: '8px',
          '&:hover': {
            transform: 'translateY(-1px)',
            transition: 'transform 0.2s ease-in-out',
          },
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '12px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          '&:hover': {
            transform: 'translateY(-4px)',
            transition: 'transform 0.3s ease-in-out',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          margin: '4px 8px',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(33, 150, 243, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(33, 150, 243, 0.12)',
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontWeight: 600,
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
        },
      },
    },
  },
};

// Light theme
const lightTheme = createTheme({
  ...themeSettings,
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff79b0',
      dark: '#c60055',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
    // Custom colors for dashboard cards
    dashboard: {
      employeeCard: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
      payrollCard: 'linear-gradient(135deg, #ff4081 0%, #c60055 100%)',
      leaveCard: 'linear-gradient(135deg, #ffa726 0%, #f57c00 100%)',
      salaryCard: 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)',
    },
  },
});

// Dark theme
const darkTheme = createTheme({
  ...themeSettings,
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: '#000',
    },
    secondary: {
      main: '#f48fb1',
      light: '#fce4ec',
      dark: '#ec407a',
      contrastText: '#000',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    // Custom colors for dashboard cards in dark mode
    dashboard: {
      employeeCard: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
      payrollCard: 'linear-gradient(135deg, #c60055 0%, #880e4f 100%)',
      leaveCard: 'linear-gradient(135deg, #f57c00 0%, #e65100 100%)',
      salaryCard: 'linear-gradient(135deg, #43a047 0%, #2e7d32 100%)',
    },
  },
});

// Export both themes
export { lightTheme, darkTheme };

// Default theme
export default lightTheme;