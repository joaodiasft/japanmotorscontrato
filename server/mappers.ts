import type { Prisma } from '@prisma/client';
import type { Client, Contract, User, Vehicle, SystemSettings, ContractTemplate } from '../src/types';

export function toVehicle(row: {
  id: string;
  type: string;
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
  salePrice: number | null;
  status: string;
  images: Prisma.JsonValue;
  inspectionNotes: string | null;
  createdAt: Date;
}): Vehicle {
  const images = Array.isArray(row.images) ? (row.images as string[]) : [];
  return {
    id: row.id,
    type: (row.type === 'motorcycle' ? 'motorcycle' : 'car') as Vehicle['type'],
    brand: row.brand,
    model: row.model,
    year: row.year,
    color: row.color,
    plate: row.plate,
    vin: row.vin,
    renavam: row.renavam,
    mileage: row.mileage,
    fuel: row.fuel,
    acquisitionPrice: row.acquisitionPrice,
    salePrice: row.salePrice ?? undefined,
    status: row.status as Vehicle['status'],
    images,
    inspectionNotes: row.inspectionNotes ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toClient(row: {
  id: string;
  name: string;
  status: string;
  birthDate: string;
  gender: string | null;
  cpf: string;
  rg: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: Prisma.JsonValue;
  totalSpent: number | null;
  lastPurchase: string | null;
  assignedVehicles: Prisma.JsonValue;
  notes: string | null;
  createdAt: Date;
}): Client {
  const address = (row.address || {}) as Client['address'];
  const assigned = Array.isArray(row.assignedVehicles)
    ? (row.assignedVehicles as string[])
    : undefined;
  return {
    id: row.id,
    name: row.name,
    status: row.status as Client['status'],
    birthDate: row.birthDate,
    gender: (row.gender as Client['gender']) ?? undefined,
    cpf: row.cpf,
    rg: row.rg,
    email: row.email,
    phone: row.phone,
    whatsapp: row.whatsapp,
    address,
    totalSpent: row.totalSpent ?? undefined,
    lastPurchase: row.lastPurchase ?? undefined,
    assignedVehicles: assigned,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toContract(row: {
  id: string;
  type: string;
  clientId: string;
  vehicleId: string;
  clientName: string;
  vehicleName: string;
  date: string;
  totalValue: number;
  downPayment: number;
  balance: number;
  paymentMethod: string;
  warrantyDays: number;
  clauses: Prisma.JsonValue;
  templateId: string | null;
  status: string;
  createdAt: Date;
}): Contract {
  const clauses = Array.isArray(row.clauses) ? (row.clauses as string[]) : [];
  return {
    id: row.id,
    type: row.type as Contract['type'],
    clientId: row.clientId,
    vehicleId: row.vehicleId,
    clientName: row.clientName,
    vehicleName: row.vehicleName,
    date: row.date,
    totalValue: row.totalValue,
    downPayment: row.downPayment,
    balance: row.balance,
    paymentMethod: row.paymentMethod,
    warrantyDays: row.warrantyDays,
    clauses,
    templateId: row.templateId ?? undefined,
    status: row.status as Contract['status'],
    createdAt: row.createdAt.toISOString(),
  };
}

export function toUser(row: {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  createdAt: Date;
}): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as User['role'],
    avatar: row.avatar ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toSystemSettings(row: {
  companyName: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  contractTemplates: Prisma.JsonValue;
}): SystemSettings {
  const templates = Array.isArray(row.contractTemplates)
    ? (row.contractTemplates as unknown as ContractTemplate[])
    : [];
  return {
    companyName: row.companyName,
    cnpj: row.cnpj,
    address: row.address,
    phone: row.phone,
    email: row.email,
    contractTemplates: templates,
  };
}
