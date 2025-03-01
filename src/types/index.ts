export interface Vehicle {
  id: string;
  nickname: string;
  licensePlate: string;
}

export interface ParkingRequest {
  licensePlate: string;
  minutes: number;
} 