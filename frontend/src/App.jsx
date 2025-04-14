import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { Provider } from 'react-redux';
import { createContext, useState } from 'react';
import store from './store';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Payroll from './pages/Payroll';
import LandingPage from './pages/LandingPage';

export const ThemeContext = createContext();
export const NotificationContext = createContext();

const lightTheme = createTheme({
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
    dashboard: {
      employeeCard: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
      payrollCard: 'linear-gradient(135deg, #ff4081 0%, #c60055 100%)',
      leaveCard: 'linear-gradient(135deg, #ffa726 0%, #f57c00 100%)',
      salaryCard: 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 600, fontSize: '2.5rem' },
    h2: { fontWeight: 600, fontSize: '2rem' },
    h3: { fontWeight: 600, fontSize: '1.75rem' },
    h4: { fontWeight: 600, fontSize: '1.5rem' },
    h5: { fontWeight: 600, fontSize: '1.25rem' },
    h6: { fontWeight: 600, fontSize: '1rem' },
    button: { textTransform: 'none', fontWeight: 500 }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1200px !important',
          margin: '0 auto',
          padding: '24px',
          '@media (max-width: 600px)': {
            padding: '16px',
          },
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '0.875rem',
          borderRadius: '8px',
          padding: '8px 16px',
          '&.MuiButton-contained': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            },
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
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#2196f3',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8fafc',
          '& .MuiTableCell-root': {
            color: '#64748b',
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f1f5f9',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover fieldset': {
              borderColor: '#2196f3',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '12px',
          padding: '16px',
        },
      },
    },
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});

const darkTheme = createTheme({
  ...lightTheme,
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
    dashboard: {
      employeeCard: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
      payrollCard: 'linear-gradient(135deg, #c60055 0%, #880e4f 100%)',
      leaveCard: 'linear-gradient(135deg, #f57c00 0%, #e65100 100%)',
      salaryCard: 'linear-gradient(135deg, #43a047 0%, #2e7d32 100%)',
    }
  },
  components: {
    ...lightTheme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          color: '#90caf9',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const themeContextValue = {
    isDarkMode,
    toggleTheme: () => setIsDarkMode(prev => !prev)
  };

  const notificationContextValue = {
    notifications,
    addNotification: (notification) => {
      setNotifications(prev => [...prev, { ...notification, id: Date.now() }]);
    },
    removeNotification: (id) => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    },
    clearNotifications: () => {
      setNotifications([]);
    }
  };

  return (
    <Provider store={store}>
      <ThemeContext.Provider value={themeContextValue}>
        <NotificationContext.Provider value={notificationContextValue}>
          <ThemeProvider theme={theme}>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route element={<Layout />}>
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/employees"
                    element={
                      <ProtectedRoute>
                        <Employees />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/payroll"
                    element={
                      <ProtectedRoute>
                        <Payroll />
                      </ProtectedRoute>
                    }
                  />
                </Route>
              </Routes>
            </Router>
          </ThemeProvider>
        </NotificationContext.Provider>
      </ThemeContext.Provider>
    </Provider>
  );
}

export default App;