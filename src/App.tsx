import React, { useState } from 'react';
import { 
  CssBaseline, 
  Tabs, 
  Tab, 
  Box, 
  ThemeProvider, 
  createTheme,
  Paper,
  Container,
  useMediaQuery
} from '@mui/material';
import { 
  LocalParking as ParkingIcon, 
  DirectionsCar as CarIcon 
} from '@mui/icons-material';
import { ParkingScreen } from './components/ParkingScreen';
import { VehiclesScreen } from './components/VehiclesScreen';

// Create a theme with white background and improved design
const theme = createTheme({
  palette: {
    background: {
      default: 'white',
      paper: 'white',
    },
    primary: {
      main: '#007AFF',
    },
    secondary: {
      main: '#34C759',
    },
    error: {
      main: '#FF3B30',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h5: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: 'white',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 16px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 56,
          '&.Mui-selected': {
            fontWeight: 600,
          },
        },
      },
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      style={{ height: '100%' }}
    >
      {value === index && (
        <Box sx={{ height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        {/* Content area - takes most of the screen */}
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          pb: isMobile ? 8 : 2, // Add padding at bottom for mobile to account for tabs
          pt: 2
        }}>
          <TabPanel value={tabValue} index={0}>
            <ParkingScreen />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <VehiclesScreen />
          </TabPanel>
        </Box>
        
        {/* Bottom navigation - fixed at the bottom */}
        <Paper 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1100,
            borderRadius: 0,
            borderTop: '1px solid rgba(0, 0, 0, 0.1)'
          }} 
          elevation={3}
        >
          <Container maxWidth="sm" disableGutters>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              aria-label="navigation tabs"
            >
              <Tab 
                icon={<ParkingIcon />} 
                label="Estacionar" 
                sx={{ 
                  py: 1.5,
                  minHeight: 64,
                  // For one-handed use, make touch targets larger
                  '& .MuiTab-iconWrapper': {
                    fontSize: '1.5rem',
                  }
                }}
              />
              <Tab 
                icon={<CarIcon />} 
                label="Mis Vehículos" 
                sx={{ 
                  py: 1.5,
                  minHeight: 64,
                  // For one-handed use, make touch targets larger
                  '& .MuiTab-iconWrapper': {
                    fontSize: '1.5rem',
                  }
                }}
              />
            </Tabs>
          </Container>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;
