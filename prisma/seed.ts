import { PrismaClient } from '@prisma/client';
import {
  getDefaultSystemSettings,
  seedClients,
  seedContracts,
  seedUsers,
  seedVehicles,
} from '../server/seed-data.js';

const prisma = new PrismaClient();

async function main() {
  const defaults = getDefaultSystemSettings();

  const existingSettings = await prisma.systemSettings.findUnique({ where: { id: 1 } });
  if (!existingSettings) {
    await prisma.systemSettings.create({
      data: {
        id: 1,
        companyName: defaults.companyName,
        cnpj: defaults.cnpj,
        address: defaults.address,
        phone: defaults.phone,
        email: defaults.email,
        contractTemplates: defaults.contractTemplates as object,
      },
    });
  }

  for (const v of seedVehicles) {
    await prisma.vehicle.upsert({
      where: { id: v.id },
      create: {
        id: v.id,
        type: v.type,
        brand: v.brand,
        model: v.model,
        year: v.year,
        color: v.color,
        plate: v.plate,
        vin: v.vin,
        renavam: v.renavam,
        mileage: v.mileage,
        fuel: v.fuel,
        acquisitionPrice: v.acquisitionPrice,
        salePrice: v.salePrice ?? null,
        status: v.status,
        images: v.images as object,
        inspectionNotes: v.inspectionNotes ?? null,
        createdAt: new Date(v.createdAt),
      },
      update: {
        type: v.type,
        brand: v.brand,
        model: v.model,
        year: v.year,
        color: v.color,
        plate: v.plate,
        vin: v.vin,
        renavam: v.renavam,
        mileage: v.mileage,
        fuel: v.fuel,
        acquisitionPrice: v.acquisitionPrice,
        salePrice: v.salePrice ?? null,
        status: v.status,
        images: v.images as object,
        inspectionNotes: v.inspectionNotes ?? null,
      },
    });
  }

  for (const c of seedClients) {
    await prisma.client.upsert({
      where: { id: c.id },
      create: {
        id: c.id,
        name: c.name,
        status: c.status,
        birthDate: c.birthDate,
        gender: c.gender ?? null,
        cpf: c.cpf,
        rg: c.rg,
        email: c.email,
        phone: c.phone,
        whatsapp: c.whatsapp,
        address: c.address as object,
        totalSpent: c.totalSpent ?? null,
        lastPurchase: c.lastPurchase ?? null,
        assignedVehicles: (c.assignedVehicles ?? null) as object | null,
        notes: c.notes ?? null,
        createdAt: new Date(c.createdAt),
      },
      update: {
        name: c.name,
        status: c.status,
        birthDate: c.birthDate,
        gender: c.gender ?? null,
        cpf: c.cpf,
        rg: c.rg,
        email: c.email,
        phone: c.phone,
        whatsapp: c.whatsapp,
        address: c.address as object,
        totalSpent: c.totalSpent ?? null,
        lastPurchase: c.lastPurchase ?? null,
        assignedVehicles: (c.assignedVehicles ?? null) as object | null,
        notes: c.notes ?? null,
      },
    });
  }

  for (const ct of seedContracts) {
    await prisma.contract.upsert({
      where: { id: ct.id },
      create: {
        id: ct.id,
        type: ct.type,
        clientId: ct.clientId,
        vehicleId: ct.vehicleId,
        clientName: ct.clientName,
        vehicleName: ct.vehicleName,
        date: ct.date,
        totalValue: ct.totalValue,
        downPayment: ct.downPayment,
        balance: ct.balance,
        paymentMethod: ct.paymentMethod,
        warrantyDays: ct.warrantyDays,
        clauses: ct.clauses as object,
        templateId: ct.templateId ?? null,
        status: ct.status,
        createdAt: new Date(ct.createdAt),
      },
      update: {
        type: ct.type,
        clientId: ct.clientId,
        vehicleId: ct.vehicleId,
        clientName: ct.clientName,
        vehicleName: ct.vehicleName,
        date: ct.date,
        totalValue: ct.totalValue,
        downPayment: ct.downPayment,
        balance: ct.balance,
        paymentMethod: ct.paymentMethod,
        warrantyDays: ct.warrantyDays,
        clauses: ct.clauses as object,
        templateId: ct.templateId ?? null,
        status: ct.status,
      },
    });
  }

  for (const u of seedUsers) {
    await prisma.user.upsert({
      where: { id: u.id },
      create: {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar ?? null,
        createdAt: new Date(u.createdAt),
      },
      update: {
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar ?? null,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
