import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Car, 
  Bike,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { storage } from '../services/storage';
import { Client, DashboardStats, Contract, Vehicle } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentContracts, setRecentContracts] = useState<Contract[]>([]);
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [st, allContracts, allVehicles, allClients] = await Promise.all([
          storage.getStats(),
          storage.getContracts(),
          storage.getVehicles(),
          storage.getClients(),
        ]);
        if (cancelled) return;
        setStats(st);
        setRecentContracts(allContracts.slice(0, 5));
        setFeaturedVehicles(allVehicles.slice(0, 4));
        setClients(allClients);
        setVehicles(allVehicles);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!stats) return null;

  const statCards = [
    { label: 'Receita Total', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalRevenue), change: '+12.5%', icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Clientes Ativos', value: stats.activeClients.toString(), change: '+4.2%', icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Carros em Estoque', value: stats.carCount.toString(), change: '-2.1%', icon: Car, color: 'bg-orange-50 text-orange-600' },
    { label: 'Motos em Estoque', value: stats.motorcycleCount.toString(), change: '+5.4%', icon: Bike, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">Bem-vindo de volta! Aqui está o resumo da <span className="text-red-600 font-bold">Japan Motors</span> hoje.</p>
        </div>
        <div className="text-right hidden md:block bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data de Hoje</p>
          <p className="text-lg font-black text-gray-900">{format(new Date(), "dd 'de' MMMM, yyyy", { locale: ptBR })}</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-default relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className={cn("p-4 rounded-2xl shadow-sm", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-black px-2 py-1 rounded-lg",
                  stat.change.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                  {stat.change}
                  {stat.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</h3>
                <p className="text-3xl font-black text-gray-900 mt-1 tracking-tight">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-gray-900">Transações Recentes</h2>
            <button 
              onClick={() => navigate('/contratos')}
              className="text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              Ver todas <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Cliente</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Veículo</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Valor</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentContracts.map((contract) => {
                  const client = clients.find((c) => c.id === contract.clientId);
                  const vehicle = vehicles.find((v) => v.id === contract.vehicleId);
                  return (
                    <tr key={contract.id} className="hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => navigate(`/contratos/${contract.id}`)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-xs">
                            {(client?.name || 'C').charAt(0)}
                          </div>
                          <div className="font-bold text-gray-900">{client?.name || 'Cliente não encontrado'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-600">
                          {vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Veículo não encontrado'}
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {vehicle?.plate}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contract.totalValue)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                          contract.status === 'completed' ? "bg-emerald-50 text-emerald-600" : 
                          contract.status === 'active' ? "bg-blue-50 text-blue-600" :
                          "bg-amber-50 text-amber-600"
                        )}>
                          {contract.status === 'completed' ? 'Concluído' : 
                           contract.status === 'active' ? 'Ativo' : 'Pendente'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Featured Inventory & Quick Actions */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold text-gray-900">Destaques</h2>
              <button 
                onClick={() => navigate('/estoque')}
                className="text-sm font-bold text-red-600 hover:text-red-700"
              >
                Ver estoque
              </button>
            </div>
            <div className="space-y-4">
              {featuredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white p-3 rounded-2xl border border-gray-100 flex gap-4 hover:border-red-200 transition-all cursor-pointer group" onClick={() => navigate('/estoque')}>
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={vehicle.images[0] || `https://picsum.photos/seed/${vehicle.id}/200/200`} 
                      alt={vehicle.model} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col justify-between py-1 min-w-0">
                    <div>
                      <h4 className="font-bold text-gray-900 truncate">{vehicle.brand} {vehicle.model}</h4>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{vehicle.year} • {vehicle.color}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-red-600 font-bold text-sm">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vehicle.salePrice || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats / Goals */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900">Metas do Mês</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-gray-400 uppercase tracking-widest">Vendas Concluídas</span>
                  <span className="text-gray-900">12 / 15</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-gray-400 uppercase tracking-widest">Capacidade Pátio</span>
                  <span className="text-gray-900">85%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-50 flex items-center gap-3 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
              <p className="text-xs font-bold uppercase tracking-widest">Sincronização OK</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
