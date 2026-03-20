import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { prisma } from './db';
import {
  toClient,
  toContract,
  toSystemSettings,
  toUser,
  toVehicle,
} from './mappers';
import {
  getDefaultSystemSettings,
  seedClients,
  seedContracts,
  seedUsers,
  seedVehicles,
} from './seed-data';
import type { Client, Contract, SystemSettings, User, Vehicle } from '../src/types';

const app = express();
const PORT = Number(process.env.API_PORT) || https://japanmotorscontrato.vercel.app;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/vehicles', async (_req, res) => {
  const rows = await prisma.vehicle.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(rows.map(toVehicle));
});

app.get('/api/vehicles/:id', async (req, res) => {
  const row = await prisma.vehicle.findUnique({ where: { id: req.params.id } });
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(toVehicle(row));
});

app.post('/api/vehicles', async (req, res) => {
  try {
    const body = req.body as Partial<Vehicle> & { id?: string };
    const id =
      body.id ||
      `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
    const createdAt = body.createdAt ? new Date(body.createdAt) : new Date();
    const row = await prisma.vehicle.upsert({
      where: { id },
      create: {
        id,
        type: body.type || 'car',
        brand: body.brand || '',
        model: body.model || '',
        year: body.year ?? new Date().getFullYear(),
        color: body.color || '',
        plate: body.plate || '',
        vin: body.vin || '',
        renavam: body.renavam || '',
        mileage: body.mileage ?? 0,
        fuel: body.fuel || 'Flex',
        acquisitionPrice: body.acquisitionPrice ?? 0,
        salePrice: body.salePrice ?? null,
        status: body.status || 'available',
        images: (body.images || []) as object,
        inspectionNotes: body.inspectionNotes ?? null,
        createdAt,
      },
      update: {
        type: body.type || 'car',
        brand: body.brand || '',
        model: body.model || '',
        year: body.year ?? new Date().getFullYear(),
        color: body.color || '',
        plate: body.plate || '',
        vin: body.vin || '',
        renavam: body.renavam || '',
        mileage: body.mileage ?? 0,
        fuel: body.fuel || 'Flex',
        acquisitionPrice: body.acquisitionPrice ?? 0,
        salePrice: body.salePrice ?? null,
        status: body.status || 'available',
        images: (body.images || []) as object,
        inspectionNotes: body.inspectionNotes ?? null,
      },
    });
    res.json(toVehicle(row));
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: String(e) });
  }
});

app.delete('/api/vehicles/:id', async (req, res) => {
  await prisma.vehicle.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

app.get('/api/clients', async (_req, res) => {
  const rows = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(rows.map(toClient));
});

app.get('/api/clients/:id', async (req, res) => {
  const row = await prisma.client.findUnique({ where: { id: req.params.id } });
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(toClient(row));
});

app.post('/api/clients', async (req, res) => {
  try {
    const body = req.body as Partial<Client> & { id?: string };
    const id =
      body.id ||
      `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
    const createdAt = body.createdAt ? new Date(body.createdAt) : new Date();
    const row = await prisma.client.upsert({
      where: { id },
      create: {
        id,
        name: body.name || '',
        status: body.status || 'active',
        birthDate: body.birthDate || '',
        gender: body.gender ?? null,
        cpf: body.cpf || '',
        rg: body.rg || '',
        email: body.email || '',
        phone: body.phone || '',
        whatsapp: body.whatsapp || '',
        address: (body.address || {}) as object,
        totalSpent: body.totalSpent ?? null,
        lastPurchase: body.lastPurchase ?? null,
        assignedVehicles: (body.assignedVehicles ?? null) as object | null,
        notes: body.notes ?? null,
        createdAt,
      },
      update: {
        name: body.name || '',
        status: body.status || 'active',
        birthDate: body.birthDate || '',
        gender: body.gender ?? null,
        cpf: body.cpf || '',
        rg: body.rg || '',
        email: body.email || '',
        phone: body.phone || '',
        whatsapp: body.whatsapp || '',
        address: (body.address || {}) as object,
        totalSpent: body.totalSpent ?? null,
        lastPurchase: body.lastPurchase ?? null,
        assignedVehicles: (body.assignedVehicles ?? null) as object | null,
        notes: body.notes ?? null,
      },
    });
    res.json(toClient(row));
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: String(e) });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  await prisma.client.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

app.get('/api/contracts', async (_req, res) => {
  const rows = await prisma.contract.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(rows.map(toContract));
});

app.get('/api/contracts/:id', async (req, res) => {
  const row = await prisma.contract.findUnique({ where: { id: req.params.id } });
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(toContract(row));
});

app.post('/api/contracts', async (req, res) => {
  try {
    const body = req.body as Partial<Contract> & { id?: string };
    const id =
      body.id ||
      `CTR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const createdAt = body.createdAt ? new Date(body.createdAt) : new Date();
    const row = await prisma.contract.upsert({
      where: { id },
      create: {
        id,
        type: body.type || 'sale',
        clientId: body.clientId || '',
        vehicleId: body.vehicleId || '',
        clientName: body.clientName || '',
        vehicleName: body.vehicleName || '',
        date: body.date || new Date().toISOString(),
        totalValue: body.totalValue ?? 0,
        downPayment: body.downPayment ?? 0,
        balance: body.balance ?? 0,
        paymentMethod: body.paymentMethod || '',
        warrantyDays: body.warrantyDays ?? 90,
        clauses: (body.clauses || []) as object,
        templateId: body.templateId ?? null,
        status: body.status || 'active',
        createdAt,
      },
      update: {
        type: body.type || 'sale',
        clientId: body.clientId || '',
        vehicleId: body.vehicleId || '',
        clientName: body.clientName || '',
        vehicleName: body.vehicleName || '',
        date: body.date || new Date().toISOString(),
        totalValue: body.totalValue ?? 0,
        downPayment: body.downPayment ?? 0,
        balance: body.balance ?? 0,
        paymentMethod: body.paymentMethod || '',
        warrantyDays: body.warrantyDays ?? 90,
        clauses: (body.clauses || []) as object,
        templateId: body.templateId ?? null,
        status: body.status || 'active',
      },
    });
    res.json(toContract(row));
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: String(e) });
  }
});

app.get('/api/users', async (_req, res) => {
  const rows = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
  res.json(rows.map(toUser));
});

app.post('/api/users', async (req, res) => {
  try {
    const body = req.body as User;
    const id = body.id || `u_${Math.random().toString(36).slice(2, 11)}`;
    const createdAt = body.createdAt ? new Date(body.createdAt) : new Date();
    const row = await prisma.user.upsert({
      where: { id },
      create: {
        id,
        name: body.name,
        email: body.email,
        role: body.role,
        avatar: body.avatar ?? null,
        createdAt,
      },
      update: {
        name: body.name,
        email: body.email,
        role: body.role,
        avatar: body.avatar ?? null,
      },
    });
    res.json(toUser(row));
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: String(e) });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

app.get('/api/settings', async (_req, res) => {
  const row = await prisma.systemSettings.findUnique({ where: { id: 1 } });
  if (!row) {
    const defaults = getDefaultSystemSettings();
    const created = await prisma.systemSettings.create({
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
    return res.json(toSystemSettings(created));
  }
  res.json(toSystemSettings(row));
});

app.put('/api/settings', async (req, res) => {
  const body = req.body as SystemSettings;
  const row = await prisma.systemSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      companyName: body.companyName,
      cnpj: body.cnpj,
      address: body.address,
      phone: body.phone,
      email: body.email,
      contractTemplates: body.contractTemplates as object,
    },
    update: {
      companyName: body.companyName,
      cnpj: body.cnpj,
      address: body.address,
      phone: body.phone,
      email: body.email,
      contractTemplates: body.contractTemplates as object,
    },
  });
  res.json(toSystemSettings(row));
});

app.post('/api/settings/reset-templates', async (_req, res) => {
  const current = await prisma.systemSettings.findUnique({ where: { id: 1 } });
  const defaults = getDefaultSystemSettings();
  const merged: SystemSettings = {
    companyName: current?.companyName ?? defaults.companyName,
    cnpj: current?.cnpj ?? defaults.cnpj,
    address: current?.address ?? defaults.address,
    phone: current?.phone ?? defaults.phone,
    email: current?.email ?? defaults.email,
    contractTemplates: defaults.contractTemplates,
  };
  const row = await prisma.systemSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      companyName: merged.companyName,
      cnpj: merged.cnpj,
      address: merged.address,
      phone: merged.phone,
      email: merged.email,
      contractTemplates: merged.contractTemplates as object,
    },
    update: {
      contractTemplates: merged.contractTemplates as object,
    },
  });
  res.json(toSystemSettings(row));
});

app.get('/api/stats', async (_req, res) => {
  const contracts = await prisma.contract.findMany();
  const vehicles = await prisma.vehicle.findMany();
  const clients = await prisma.client.findMany();

  const totalRevenue = contracts
    .filter((c) => c.status === 'completed' && c.type === 'sale')
    .reduce((acc, c) => acc + c.totalValue, 0);

  const availableVehicles = vehicles.filter((v) => v.status === 'available');

  res.json({
    totalRevenue,
    activeClients: clients.length,
    inventoryCount: availableVehicles.length,
    carCount: availableVehicles.filter((v) => v.type === 'car').length,
    motorcycleCount: availableVehicles.filter((v) => v.type === 'motorcycle').length,
    activeContracts: contracts.filter((c) => c.status === 'active').length,
    salesVelocity: 12.5,
  });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`API http://localhost:${PORT}`);
});
