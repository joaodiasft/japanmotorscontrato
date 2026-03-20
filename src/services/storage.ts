import type {
  Client,
  Contract,
  DashboardStats,
  SystemSettings,
  User,
  Vehicle,
} from '../types';

const API_BASE = `${import.meta.env.VITE_API_BASE ?? ''}/api`;

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const storage = {
  getVehicles: (): Promise<Vehicle[]> => fetchJson('/vehicles'),

  getVehicleById: async (id: string): Promise<Vehicle | undefined> => {
    try {
      return await fetchJson<Vehicle>(`/vehicles/${encodeURIComponent(id)}`);
    } catch {
      return undefined;
    }
  },

  saveVehicle: (
    vehicle: Omit<Vehicle, 'id' | 'createdAt'> & { id?: string; createdAt?: string },
  ): Promise<Vehicle> =>
    fetchJson('/vehicles', { method: 'POST', body: JSON.stringify(vehicle) }),

  deleteVehicle: (id: string): Promise<void> =>
    fetchJson(`/vehicles/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  getClients: (): Promise<Client[]> => fetchJson('/clients'),

  getClientById: async (id: string): Promise<Client | undefined> => {
    try {
      return await fetchJson<Client>(`/clients/${encodeURIComponent(id)}`);
    } catch {
      return undefined;
    }
  },

  saveClient: (
    client: Omit<Client, 'id' | 'createdAt'> & { id?: string; createdAt?: string },
  ): Promise<Client> =>
    fetchJson('/clients', { method: 'POST', body: JSON.stringify(client) }),

  deleteClient: (id: string): Promise<void> =>
    fetchJson(`/clients/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  getContracts: (): Promise<Contract[]> => fetchJson('/contracts'),

  getContractById: async (id: string): Promise<Contract | undefined> => {
    try {
      return await fetchJson<Contract>(`/contracts/${encodeURIComponent(id)}`);
    } catch {
      return undefined;
    }
  },

  saveContract: (
    contract: Omit<Contract, 'id' | 'createdAt'> & { id?: string; createdAt?: string },
  ): Promise<Contract> =>
    fetchJson('/contracts', { method: 'POST', body: JSON.stringify(contract) }),

  getStats: (): Promise<DashboardStats> => fetchJson('/stats'),

  getUsers: (): Promise<User[]> => fetchJson('/users'),

  saveUser: (user: User): Promise<User> =>
    fetchJson('/users', { method: 'POST', body: JSON.stringify(user) }),

  deleteUser: (id: string): Promise<void> =>
    fetchJson(`/users/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  getSettings: (): Promise<SystemSettings> => fetchJson('/settings'),

  saveSettings: (settings: SystemSettings): Promise<SystemSettings> =>
    fetchJson('/settings', { method: 'PUT', body: JSON.stringify(settings) }),

  resetTemplates: (): Promise<SystemSettings> =>
    fetchJson('/settings/reset-templates', { method: 'POST' }),
};
