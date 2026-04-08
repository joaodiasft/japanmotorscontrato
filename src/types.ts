export type VehicleStatus = 'available' | 'sold' | 'maintenance' | 'reserved';
export type ContractType = 'purchase' | 'sale';

export type VehicleType = 'car' | 'motorcycle';

export interface Vehicle {
  id: string;
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  color: string;
  plate: string;
  vin: string;
  renavam: string;
  mileage: number;
  fuel: string;
  acquisitionPrice: number;
  salePrice?: number;
  status: VehicleStatus;
  images: string[];
  inspectionNotes?: string;
  createdAt: string;
}

export type ClientStatus = 'active' | 'inactive' | 'lead' | 'vip';

export interface Client {
  id: string;
  name: string;
  status: ClientStatus;
  birthDate: string;
  gender?: 'male' | 'female' | 'other';
  cpf: string;
  rg: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  totalSpent?: number;
  lastPurchase?: string;
  assignedVehicles?: string[]; // Array of vehicle IDs
  notes?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'vendedor';
  avatar?: string;
  createdAt: string;
}

export interface SystemSettings {
  companyName: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  contractTemplates: ContractTemplate[];
}

export interface ContractTemplate {
  id: string;
  name: string;
  content: string;
}

export interface Contract {
  id: string;
  type: ContractType;
  clientId: string;
  clientName: string;
  vehicleId: string;
  vehicleName: string;
  date: string;
  totalValue: number;
  downPayment: number;
  balance: number;
  paymentMethod: string;
  warrantyDays: number;
  clauses: string[];
  templateId?: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  activeClients: number;
  inventoryCount: number;
  carCount: number;
  motorcycleCount: number;
  activeContracts: number;
  salesVelocity: number;
}
