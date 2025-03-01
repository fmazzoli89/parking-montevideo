import React, { useState, useEffect } from 'react';
import { 
  Container, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Box, 
  Typography,
  SelectChangeEvent,
  Paper,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Card,
  CardContent
} from '@mui/material';
import { Vehicle } from '../types';
import { getVehicles } from '../utils/storage';
import { sendParkingEmail } from '../utils/email';

// Key for storing last used vehicle in localStorage
const LAST_USED_VEHICLE_KEY = 'last_used_vehicle';

export const ParkingScreen: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [selectedMinutes, setSelectedMinutes] = useState<number>(30);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const loadVehiclesAndSetDefault = async () => {
      const loadedVehicles = getVehicles();
      setVehicles(loadedVehicles);
      
      // Get last used vehicle from localStorage
      const lastUsedVehicleId = localStorage.getItem(LAST_USED_VEHICLE_KEY);
      
      if (lastUsedVehicleId && loadedVehicles.some(v => v.id === lastUsedVehicleId)) {
        setSelectedVehicle(lastUsedVehicleId);
      } else if (loadedVehicles.length > 0) {
        // If no last used vehicle or it doesn't exist anymore, select the first one
        setSelectedVehicle(loadedVehicles[0].id);
      }
    };
    
    loadVehiclesAndSetDefault();
  }, []);

  const handleVehicleChange = (event: SelectChangeEvent) => {
    setSelectedVehicle(event.target.value);
    // Reset confirmation when vehicle changes
    setConfirmationStep(false);
  };

  const handleTimeChange = (event: SelectChangeEvent) => {
    setSelectedMinutes(Number(event.target.value));
    // Reset confirmation when time changes
    setConfirmationStep(false);
  };

  const getTimeOptions = () => {
    const options = [];
    for (let i = 30; i <= 180; i += 30) {
      const date = new Date();
      date.setMinutes(date.getMinutes() + i);
      const timeString = date.toLocaleTimeString('es-UY', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      options.push({
        label: `Hasta las ${timeString}`,
        value: i,
      });
    }
    return options;
  };

  const handleParkingRequest = () => {
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    if (!vehicle) return;

    // If this is the first click, show confirmation
    if (!confirmationStep) {
      setConfirmationStep(true);
      setShowConfirmation(true);
      
      // Auto-hide confirmation after 5 seconds
      setTimeout(() => {
        setShowConfirmation(false);
      }, 5000);
      
      return;
    }
    
    // This is the second click, proceed with sending email
    try {
      // Save this vehicle as the last used one
      localStorage.setItem(LAST_USED_VEHICLE_KEY, vehicle.id);
      
      sendParkingEmail({
        licensePlate: vehicle.licensePlate,
        minutes: selectedMinutes,
      });
      
      // Show success message
      setSnackbarMessage('Solicitud de estacionamiento enviada');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Reset confirmation state
      setConfirmationStep(false);
    } catch (error) {
      console.error('Error sending email:', error);
      setSnackbarMessage('Error al enviar la solicitud. Intente nuevamente.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm" sx={{ 
      py: 2,
      px: isMobile ? 2 : 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <Card elevation={3} sx={{ 
        backgroundColor: 'white',
        borderRadius: 3,
        overflow: 'visible'
      }}>
        <CardContent sx={{ p: isMobile ? 3 : 4 }}>
          <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
            Estacionar
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="vehicle-select-label">Seleccionar Vehículo</InputLabel>
              <Select
                labelId="vehicle-select-label"
                id="vehicle-select"
                value={selectedVehicle}
                label="Seleccionar Vehículo"
                onChange={handleVehicleChange}
                sx={{ 
                  borderRadius: 2,
                  '& .MuiSelect-select': {
                    padding: '14px 16px',
                  }
                }}
              >
                {vehicles.map((vehicle) => (
                  <MenuItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.nickname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="time-select-label">Seleccionar Duración</InputLabel>
              <Select
                labelId="time-select-label"
                id="time-select"
                value={selectedMinutes.toString()}
                label="Seleccionar Duración"
                onChange={handleTimeChange}
                sx={{ 
                  borderRadius: 2,
                  '& .MuiSelect-select': {
                    padding: '14px 16px',
                  }
                }}
              >
                {getTimeOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Button
            variant="contained"
            color={confirmationStep ? "secondary" : "primary"}
            fullWidth
            size="large"
            onClick={handleParkingRequest}
            disabled={!selectedVehicle || !selectedMinutes}
            sx={{ 
              py: 1.8, 
              fontSize: '1.1rem',
              fontWeight: 'bold',
              backgroundColor: confirmationStep ? '#34C759' : '#007AFF',
              '&:hover': {
                backgroundColor: confirmationStep ? '#2eb350' : '#0056b3',
              },
              '&.Mui-disabled': {
                backgroundColor: '#cccccc',
              }
            }}
          >
            {confirmationStep ? 'Confirmar Estacionamiento' : 'Obtener Estacionamiento'}
          </Button>
          
          {showConfirmation && confirmationStep && (
            <Typography 
              variant="body2" 
              align="center" 
              sx={{ 
                mt: 2, 
                color: 'text.secondary',
                animation: 'fadeIn 0.3s ease-in-out',
                '@keyframes fadeIn': {
                  '0%': {
                    opacity: 0,
                  },
                  '100%': {
                    opacity: 1,
                  },
                },
              }}
            >
              Presione nuevamente para confirmar
            </Typography>
          )}
        </CardContent>
      </Card>
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 7 }} // Add margin to avoid overlap with bottom tabs
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}; 