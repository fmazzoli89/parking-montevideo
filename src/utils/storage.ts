import { Vehicle } from '../types';

const VEHICLES_KEY = 'parking_vehicles';

export const saveVehicles = (vehicles: Vehicle[]): void => {
  try {
    localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
  } catch (error) {
    console.error('Error saving vehicles:', error);
  }
};

export const getVehicles = (): Vehicle[] => {
  try {
    const vehicles = localStorage.getItem(VEHICLES_KEY);
    return vehicles ? JSON.parse(vehicles) : [];
  } catch (error) {
    console.error('Error getting vehicles:', error);
    return [];
  }
}; 