import { ParkingRequest } from '../types';

export const sendParkingEmail = (request: ParkingRequest): boolean => {
  try {
    const subject = 'Solicitud de Estacionamiento';
    const body = `Matrícula: ${request.licensePlate}\nDuración: ${request.minutes} minutos`;
    const email = 'fmazzoli89@gmail.com';
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Using window.open instead of window.location.href to ensure it works in more browsers
    // and doesn't navigate away from the app
    const newWindow = window.open(mailtoUrl, '_blank');
    
    // If window.open returns null, it means the popup was blocked
    if (!newWindow) {
      console.warn('Popup blocked or not supported. Falling back to location.href');
      window.location.href = mailtoUrl;
    }
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}; 