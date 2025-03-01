import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Paper,
  Box,
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  DirectionsCar as CarIcon
} from '@mui/icons-material';
import { Vehicle } from '../types';
import { getVehicles, saveVehicles } from '../utils/storage';

export const VehiclesScreen: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [nickname, setNickname] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const loadedVehicles = getVehicles();
    setVehicles(loadedVehicles);
  }, []);

  const handleOpenDialog = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setNickname(vehicle.nickname);
      setLicensePlate(vehicle.licensePlate);
    } else {
      setEditingVehicle(null);
      setNickname('');
      setLicensePlate('');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingVehicle(null);
    setNickname('');
    setLicensePlate('');
  };

  const handleSaveVehicle = () => {
    if (!nickname.trim() || !licensePlate.trim()) {
      return;
    }

    const newVehicle: Vehicle = {
      id: editingVehicle?.id || Date.now().toString(),
      nickname: nickname.trim(),
      licensePlate: licensePlate.trim().toUpperCase(),
    };

    const updatedVehicles = editingVehicle
      ? vehicles.map(v => (v.id === editingVehicle.id ? newVehicle : v))
      : [...vehicles, newVehicle];

    saveVehicles(updatedVehicles);
    setVehicles(updatedVehicles);
    handleCloseDialog();
    
    // Show success message
    setSnackbarMessage(editingVehicle ? 'Vehículo actualizado' : 'Vehículo agregado');
    setSnackbarOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setVehicleToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (vehicleToDelete) {
      const updatedVehicles = vehicles.filter(v => v.id !== vehicleToDelete);
      saveVehicles(updatedVehicles);
      setVehicles(updatedVehicles);
      setConfirmDialogOpen(false);
      setVehicleToDelete(null);
      
      // Show success message
      setSnackbarMessage('Vehículo eliminado');
      setSnackbarOpen(true);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Generate a color based on the vehicle nickname for the avatar
  const getAvatarColor = (nickname: string) => {
    const colors = [
      '#007AFF', // Blue
      '#34C759', // Green
      '#FF9500', // Orange
      '#FF3B30', // Red
      '#5856D6', // Purple
      '#FF2D55', // Pink
    ];
    
    // Simple hash function to get a consistent color for the same nickname
    let hash = 0;
    for (let i = 0; i < nickname.length; i++) {
      hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Container maxWidth="sm" sx={{ 
      py: 2,
      px: isMobile ? 2 : 3,
      height: '100%'
    }}>
      <Card elevation={3} sx={{ 
        backgroundColor: 'white',
        borderRadius: 3,
        mb: 2
      }}>
        <CardContent sx={{ p: isMobile ? 2 : 3 }}>
          <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ mb: 2 }}>
            Mis Vehículos
          </Typography>

          <List sx={{ width: '100%' }}>
            {vehicles.length === 0 ? (
              <Box sx={{ 
                py: 4, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                opacity: 0.7
              }}>
                <CarIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary" align="center">
                  No hay vehículos registrados
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  Presione el botón + para agregar uno
                </Typography>
              </Box>
            ) : (
              vehicles.map((vehicle, index) => (
                <React.Fragment key={vehicle.id}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem
                    sx={{ 
                      py: 2,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      }
                    }}
                    secondaryAction={
                      <Box>
                        <IconButton 
                          edge="end" 
                          aria-label="edit" 
                          onClick={() => handleOpenDialog(vehicle)}
                          sx={{ 
                            color: theme.palette.primary.main,
                            mr: 1
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          aria-label="delete" 
                          onClick={() => handleDeleteClick(vehicle.id)}
                          sx={{ color: theme.palette.error.main }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: getAvatarColor(vehicle.nickname),
                        mr: 2,
                        width: 40,
                        height: 40
                      }}
                    >
                      {vehicle.nickname.charAt(0).toUpperCase()}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {vehicle.nickname}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {vehicle.licensePlate}
                        </Typography>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))
            )}
          </List>
        </CardContent>
      </Card>

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: isMobile ? 80 : 24, // Position higher on mobile to avoid bottom tabs
          right: 16,
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: '#0056b3',
          },
          // Make it larger for better one-handed use
          width: 64,
          height: 64,
        }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon sx={{ fontSize: 32 }} />
      </Fab>

      {/* Add/Edit Vehicle Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            px: 1
          }
        }}
      >
        <DialogTitle sx={{ pt: 3 }}>
          <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>
            {editingVehicle ? 'Editar Vehículo' : 'Agregar Vehículo'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="nickname"
            label="Apodo"
            type="text"
            fullWidth
            variant="outlined"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
          <TextField
            margin="dense"
            id="licensePlate"
            label="Matrícula"
            type="text"
            fullWidth
            variant="outlined"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            inputProps={{ 
              style: { textTransform: 'uppercase' },
              maxLength: 7
            }}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1,
              borderColor: theme.palette.error.main,
              color: theme.palette.error.main,
              '&:hover': {
                borderColor: theme.palette.error.dark,
                backgroundColor: 'rgba(255, 59, 48, 0.04)',
              }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveVehicle} 
            variant="contained" 
            color="primary"
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            px: 1
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" align="center" sx={{ fontWeight: 600, pt: 1 }}>
            Confirmar eliminación
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography align="center">
            ¿Está seguro que desea eliminar este vehículo?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
          <Button 
            onClick={() => setConfirmDialogOpen(false)}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 7 }} // Add margin to avoid overlap with bottom tabs
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}; 