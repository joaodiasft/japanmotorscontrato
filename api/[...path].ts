import { prisma } from '../server/db';
import { getDefaultSystemSettings } from '../server/seed-data';
import {
  toClient,
  toContract,
  toSystemSettings,
  toUser,
  toVehicle,
} from '../server/mappers';
import { jsonResponse, readJsonBody } from './utils';
import type { Client, Contract, SystemSettings, User, Vehicle } from '../src/types';

export default async function handler(req: any, res: any) {
  try {
    const rawPath = req.query?.path;
    const segments = Array.isArray(rawPath)
      ? rawPath.map(String)
      : rawPath
        ? String(rawPath).split('/').filter(Boolean)
        : [];

    const [resource, maybeId, ...rest] = segments;
    const tail = [maybeId, ...rest].filter(Boolean);

    if (!resource) {
      return jsonResponse(res, 404, { error: 'Not found' });
    }

    // Health/status
    if (resource === 'health') {
      if (req.method !== 'GET') return jsonResponse(res, 405, { error: 'Method not allowed' });
      return jsonResponse(res, 200, { ok: true });
    }

    // Stats
    if (resource === 'stats') {
      if (req.method !== 'GET') return jsonResponse(res, 405, { error: 'Method not allowed' });
      const contracts = await prisma.contract.findMany();
      const vehicles = await prisma.vehicle.findMany();
      const clients = await prisma.client.findMany();

      const totalRevenue = contracts
        .filter((c: any) => c.status === 'completed' && c.type === 'sale')
        .reduce((acc: number, c: any) => acc + c.totalValue, 0);

      const availableVehicles = vehicles.filter((v: any) => v.status === 'available');

      return jsonResponse(res, 200, {
        totalRevenue,
        activeClients: clients.length,
        inventoryCount: availableVehicles.length,
        carCount: availableVehicles.filter((v: any) => v.type === 'car').length,
        motorcycleCount: availableVehicles.filter((v: any) => v.type === 'motorcycle').length,
        activeContracts: contracts.filter((c: any) => c.status === 'active').length,
        salesVelocity: 12.5,
      });
    }

    // Settings
    if (resource === 'settings') {
      const sub = tail[0];
      if (!sub) {
        if (req.method === 'GET') {
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
                contractTemplates: defaults.contractTemplates as any,
              },
            });
            return jsonResponse(res, 200, toSystemSettings(created));
          }
          return jsonResponse(res, 200, toSystemSettings(row));
        }

        if (req.method === 'PUT') {
          const body = readJsonBody(req) as Partial<SystemSettings> & { contractTemplates?: any };
          const updated = await prisma.systemSettings.upsert({
            where: { id: 1 },
            create: {
              id: 1,
              companyName: body.companyName,
              cnpj: body.cnpj,
              address: body.address as any,
              phone: body.phone,
              email: body.email,
              contractTemplates: body.contractTemplates as any,
            },
            update: {
              companyName: body.companyName,
              cnpj: body.cnpj,
              address: body.address as any,
              phone: body.phone,
              email: body.email,
              contractTemplates: body.contractTemplates as any,
            },
          });
          return jsonResponse(res, 200, toSystemSettings(updated));
        }

        return jsonResponse(res, 405, { error: 'Method not allowed' });
      }

      if (sub === 'reset-templates') {
        if (req.method !== 'POST') return jsonResponse(res, 405, { error: 'Method not allowed' });

        const current = await prisma.systemSettings.findUnique({ where: { id: 1 } });
        const defaults = getDefaultSystemSettings();

        const merged = {
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
            address: merged.address as any,
            phone: merged.phone,
            email: merged.email,
            contractTemplates: merged.contractTemplates as any,
          },
          update: {
            contractTemplates: merged.contractTemplates as any,
          },
        });

        return jsonResponse(res, 200, toSystemSettings(row));
      }

      return jsonResponse(res, 404, { error: 'Not found' });
    }

    // Vehicles
    if (resource === 'vehicles') {
      const id = maybeId;
      if (!id) {
        if (req.method === 'GET') {
          const rows = await prisma.vehicle.findMany({ orderBy: { createdAt: 'desc' } });
          return jsonResponse(res, 200, rows.map(toVehicle));
        }
        if (req.method === 'POST') {
          const body = readJsonBody(req) as Partial<Vehicle> & { id?: string };
          const vid = body.id || `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
          const createdAt = body.createdAt ? new Date(body.createdAt as any) : new Date();

          const row = await prisma.vehicle.upsert({
            where: { id: vid },
            create: {
              id: vid,
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
              images: (body.images || []) as any,
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
              images: (body.images || []) as any,
              inspectionNotes: body.inspectionNotes ?? null,
            },
          });

          return jsonResponse(res, 200, toVehicle(row));
        }
        return jsonResponse(res, 405, { error: 'Method not allowed' });
      }

      const vehicleId = String(id);
      if (req.method === 'GET') {
        const row = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
        if (!row) return jsonResponse(res, 404, { error: 'Not found' });
        return jsonResponse(res, 200, toVehicle(row));
      }

      if (req.method === 'DELETE') {
        await prisma.vehicle.delete({ where: { id: vehicleId } });
        return jsonResponse(res, 204, {});
      }

      if (req.method === 'PUT') {
        const body = readJsonBody(req) as Partial<Vehicle>;
        const updated = await prisma.vehicle.upsert({
          where: { id: vehicleId },
          create: {
            id: vehicleId,
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
            images: (body.images || []) as any,
            inspectionNotes: body.inspectionNotes ?? null,
            createdAt: body.createdAt ? new Date(body.createdAt as any) : new Date(),
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
            images: (body.images || []) as any,
            inspectionNotes: body.inspectionNotes ?? null,
          },
        });
        return jsonResponse(res, 200, toVehicle(updated));
      }

      return jsonResponse(res, 405, { error: 'Method not allowed' });
    }

    // Clients
    if (resource === 'clients') {
      const id = maybeId;
      if (!id) {
        if (req.method === 'GET') {
          const rows = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
          return jsonResponse(res, 200, rows.map(toClient));
        }
        if (req.method === 'POST') {
          const body = readJsonBody(req) as Partial<Client> & { id?: string };
          const cid = body.id || `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
          const createdAt = body.createdAt ? new Date(body.createdAt as any) : new Date();

          const row = await prisma.client.upsert({
            where: { id: cid },
            create: {
              id: cid,
              name: body.name || '',
              status: body.status || 'active',
              birthDate: body.birthDate || '',
              gender: body.gender ?? null,
              cpf: body.cpf || '',
              rg: body.rg || '',
              email: body.email || '',
              phone: body.phone || '',
              whatsapp: body.whatsapp || '',
              address: (body.address || {}) as any,
              totalSpent: body.totalSpent ?? null,
              lastPurchase: body.lastPurchase ?? null,
              assignedVehicles: (body.assignedVehicles ?? null) as any,
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
              address: (body.address || {}) as any,
              totalSpent: body.totalSpent ?? null,
              lastPurchase: body.lastPurchase ?? null,
              assignedVehicles: (body.assignedVehicles ?? null) as any,
              notes: body.notes ?? null,
            },
          });

          return jsonResponse(res, 200, toClient(row));
        }
        return jsonResponse(res, 405, { error: 'Method not allowed' });
      }

      const clientId = String(id);
      if (req.method === 'GET') {
        const row = await prisma.client.findUnique({ where: { id: clientId } });
        if (!row) return jsonResponse(res, 404, { error: 'Not found' });
        return jsonResponse(res, 200, toClient(row));
      }

      if (req.method === 'DELETE') {
        await prisma.client.delete({ where: { id: clientId } });
        return jsonResponse(res, 204, {});
      }

      if (req.method === 'PUT') {
        const body = readJsonBody(req) as Partial<Client>;
        const updated = await prisma.client.upsert({
          where: { id: clientId },
          create: {
            id: clientId,
            name: body.name || '',
            status: body.status || 'active',
            birthDate: body.birthDate || '',
            gender: body.gender ?? null,
            cpf: body.cpf || '',
            rg: body.rg || '',
            email: body.email || '',
            phone: body.phone || '',
            whatsapp: body.whatsapp || '',
            address: (body.address || {}) as any,
            totalSpent: body.totalSpent ?? null,
            lastPurchase: body.lastPurchase ?? null,
            assignedVehicles: (body.assignedVehicles ?? null) as any,
            notes: body.notes ?? null,
            createdAt: body.createdAt ? new Date(body.createdAt as any) : new Date(),
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
            address: (body.address || {}) as any,
            totalSpent: body.totalSpent ?? null,
            lastPurchase: body.lastPurchase ?? null,
            assignedVehicles: (body.assignedVehicles ?? null) as any,
            notes: body.notes ?? null,
          },
        });
        return jsonResponse(res, 200, toClient(updated));
      }

      return jsonResponse(res, 405, { error: 'Method not allowed' });
    }

    // Contracts
    if (resource === 'contracts') {
      const id = maybeId;
      if (!id) {
        if (req.method === 'GET') {
          const rows = await prisma.contract.findMany({ orderBy: { createdAt: 'desc' } });
          return jsonResponse(res, 200, rows.map(toContract));
        }
        if (req.method === 'POST') {
          const body = readJsonBody(req) as Partial<Contract> & { id?: string };
          const cid = body.id || `CTR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
          const createdAt = body.createdAt ? new Date(body.createdAt as any) : new Date();

          const row = await prisma.contract.upsert({
            where: { id: cid },
            create: {
              id: cid,
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
              clauses: (body.clauses || []) as any,
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
              clauses: (body.clauses || []) as any,
              templateId: body.templateId ?? null,
              status: body.status || 'active',
            },
          });
          return jsonResponse(res, 200, toContract(row));
        }
        return jsonResponse(res, 405, { error: 'Method not allowed' });
      }

      const contractId = String(id);
      if (req.method !== 'GET') return jsonResponse(res, 405, { error: 'Method not allowed' });
      const row = await prisma.contract.findUnique({ where: { id: contractId } });
      if (!row) return jsonResponse(res, 404, { error: 'Not found' });
      return jsonResponse(res, 200, toContract(row));
    }

    // Users
    if (resource === 'users') {
      const id = maybeId;
      if (!id) {
        if (req.method === 'GET') {
          const rows = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
          return jsonResponse(res, 200, rows.map(toUser));
        }
        if (req.method === 'POST') {
          const body = readJsonBody(req) as User;
          const uid = body.id || `u_${Math.random().toString(36).slice(2, 11)}`;
          const createdAt = body.createdAt ? new Date(body.createdAt as any) : new Date();

          const row = await prisma.user.upsert({
            where: { id: uid },
            create: {
              id: uid,
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

          return jsonResponse(res, 200, toUser(row));
        }
        return jsonResponse(res, 405, { error: 'Method not allowed' });
      }

      const userId = String(id);
      if (req.method !== 'DELETE') return jsonResponse(res, 405, { error: 'Method not allowed' });
      await prisma.user.delete({ where: { id: userId } });
      return jsonResponse(res, 204, {});
    }

    return jsonResponse(res, 404, { error: 'Not found' });
  } catch (e) {
    return jsonResponse(res, 500, { error: String(e) });
  }
}

