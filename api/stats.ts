import { prisma } from '../server/db';
import type { DashboardStats } from '../src/types';
import { jsonResponse } from './utils';

export default async function handler(_req: any, res: any) {
  try {
    const contracts = await prisma.contract.findMany();
    const vehicles = await prisma.vehicle.findMany();
    const clients = await prisma.client.findMany();

    const totalRevenue = contracts
      .filter((c) => c.status === 'completed' && c.type === 'sale')
      .reduce((acc, c) => acc + c.totalValue, 0);

    const availableVehicles = vehicles.filter((v) => v.status === 'available');

    const stats: DashboardStats = {
      totalRevenue,
      activeClients: clients.length,
      inventoryCount: availableVehicles.length,
      carCount: availableVehicles.filter((v) => v.type === 'car').length,
      motorcycleCount: availableVehicles.filter((v) => v.type === 'motorcycle').length,
      activeContracts: contracts.filter((c) => c.status === 'active').length,
      salesVelocity: 12.5,
    };

    return jsonResponse(res, 200, stats);
  } catch (e) {
    return jsonResponse(res, 500, { error: String(e) });
  }
}

