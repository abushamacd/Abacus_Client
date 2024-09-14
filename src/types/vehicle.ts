export interface IVehicle {
  id: string;
  vNumber: string;
  route: string;
  runningRoute: string | null;
  oil: number;
  income: number;
  expense: number;
  savings: number;
  welfare: number;
  servicing: number;
  comment: string | null;
  driverId: string;
  supervisorId: string;
  createdAt: string;
}
