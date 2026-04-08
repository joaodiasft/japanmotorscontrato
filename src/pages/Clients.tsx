import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  MapPin, 
  MoreVertical,
  ExternalLink,
  MessageCircle,
  X,
  User,
  Calendar,
  Hash,
  Map as MapIcon,
  Car,
  CheckCircle2,
  FileCode,
  FileText,
  StickyNote,
  UserCircle,
  Shield,
  Star,
  Trash2,
  Edit2,
  DollarSign,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { storage } from '../services/storage';
import { Client, Vehicle } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Clients() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  /** Disponíveis para atribuição no formulário */
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  /** Todos os veículos (lookup nos cards) */
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'lead' | 'vip'>('all');
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    status: 'active',
    email: '',
    phone: '',
    whatsapp: '',
    birthDate: '',
    gender: 'male',
    cpf: '',
    rg: '',
    notes: '',
    assignedVehicles: [],
    address: {
      zipCode: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      complement: ''
    }
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cl, vh] = await Promise.all([
          storage.getClients(),
          storage.getVehicles(),
        ]);
        if (cancelled) return;
        setClients(cl);
        setAllVehicles(vh);
        setVehicles(vh.filter((v) => v.status === 'available'));
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    if (newClient.name && newClient.email && newClient.cpf) {
      await storage.saveClient(newClient as Omit<Client, 'id'>);
      const cl = await storage.getClients();
      setClients(cl);
      const vh = await storage.getVehicles();
      setAllVehicles(vh);
      setVehicles(vh.filter((v) => v.status === 'available'));
      setIsModalOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setNewClient({
      name: '',
      status: 'active',
      email: '',
      phone: '',
      whatsapp: '',
      birthDate: '',
      gender: 'male',
      cpf: '',
      rg: '',
      notes: '',
      assignedVehicles: [],
      address: {
        zipCode: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        complement: ''
      }
    });
    setSelectedClient(null);
  };

  const handleEdit = (client: Client) => {
    setNewClient(client);
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      await storage.deleteClient(id);
      setClients(await storage.getClients());
    }
  };

  const toggleVehicleAssignment = (vehicleId: string) => {
    const currentAssigned = newClient.assignedVehicles || [];
    if (currentAssigned.includes(vehicleId)) {
      setNewClient({
        ...newClient,
        assignedVehicles: currentAssigned.filter(id => id !== vehicleId)
      });
    } else {
      setNewClient({
        ...newClient,
        assignedVehicles: [...currentAssigned, vehicleId]
      });
    }
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.cpf || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || c.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip': return 'bg-amber-500 text-white';
      case 'active': return 'bg-emerald-500 text-white';
      case 'lead': return 'bg-blue-500 text-white';
      case 'inactive': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'vip': return 'VIP';
      case 'active': return 'Ativo';
      case 'lead': return 'Lead';
      case 'inactive': return 'Inativo';
      default: return status;
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Clientes</h1>
          <p className="text-gray-500 mt-1">Gerencie sua base de clientes e histórico de compras.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus className="w-5 h-5" />
          Novo Cliente
        </button>
      </header>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-full"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                    {selectedClient ? 'Editar Cliente' : 'Cadastro de Cliente'}
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">Registre os dados pessoais e de contato do cliente.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Personal Info */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Dados Pessoais
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="label">Status do Cliente</label>
                          <select 
                            className="input-field"
                            value={newClient.status}
                            onChange={e => setNewClient({...newClient, status: e.target.value as any})}
                          >
                            <option value="active">Ativo</option>
                            <option value="lead">Lead (Interessado)</option>
                            <option value="vip">VIP</option>
                            <option value="inactive">Inativo</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="label">Gênero</label>
                          <select 
                            className="input-field"
                            value={newClient.gender}
                            onChange={e => setNewClient({...newClient, gender: e.target.value as any})}
                          >
                            <option value="male">Masculino</option>
                            <option value="female">Feminino</option>
                            <option value="other">Outro</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="label">Nome Completo</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          placeholder="Ex: Ricardo Silva"
                          value={newClient.name}
                          onChange={e => setNewClient({...newClient, name: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="label">CPF</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            placeholder="000.000.000-00" 
                            value={newClient.cpf}
                            onChange={e => setNewClient({...newClient, cpf: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="label">RG</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            placeholder="00.000.000-0" 
                            value={newClient.rg}
                            onChange={e => setNewClient({...newClient, rg: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="label">Data de Nascimento</label>
                          <input 
                            type="date" 
                            className="input-field" 
                            value={newClient.birthDate}
                            onChange={e => setNewClient({...newClient, birthDate: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="label">WhatsApp</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            placeholder="(00) 00000-0000"
                            value={newClient.whatsapp}
                            onChange={e => setNewClient({...newClient, whatsapp: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="label">Email</label>
                        <input 
                          type="email" 
                          className="input-field" 
                          placeholder="email@exemplo.com"
                          value={newClient.email}
                          onChange={e => setNewClient({...newClient, email: e.target.value})}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="label">Observações / Notas</label>
                        <textarea 
                          className="input-field min-h-[100px] resize-none" 
                          placeholder="Informações adicionais sobre o cliente, preferências, etc..."
                          value={newClient.notes}
                          onChange={e => setNewClient({...newClient, notes: e.target.value})}
                        />
                      </div>

                      {/* Vehicle Assignment */}
                      <div className="space-y-4 pt-4">
                        <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest flex items-center gap-2">
                          <Car className="w-4 h-4" />
                          Atribuir Veículo (Opcional)
                        </h3>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2">
                          {vehicles.map(vehicle => (
                            <button
                              key={vehicle.id}
                              type="button"
                              onClick={() => toggleVehicleAssignment(vehicle.id)}
                              className={cn(
                                "flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                                newClient.assignedVehicles?.includes(vehicle.id)
                                  ? "border-neutral-800 bg-gray-100"
                                  : "border-gray-100 hover:border-gray-200"
                              )}
                            >
                              <div>
                                <p className="text-sm font-bold text-gray-900">{vehicle.brand} {vehicle.model}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{vehicle.plate} • {vehicle.year}</p>
                              </div>
                              {newClient.assignedVehicles?.includes(vehicle.id) && (
                                <div className="w-5 h-5 bg-neutral-900 rounded-full flex items-center justify-center">
                                  <CheckCircle2 className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </button>
                          ))}
                          {vehicles.length === 0 && (
                            <p className="text-sm text-gray-400 italic">Nenhum veículo disponível no momento.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest flex items-center gap-2">
                      <MapIcon className="w-4 h-4" />
                      Endereço
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="label">CEP</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            placeholder="00000-000" 
                            value={newClient.address?.zipCode}
                            onChange={e => setNewClient({...newClient, address: { ...newClient.address!, zipCode: e.target.value }})}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="label">Cidade</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            placeholder="São Paulo"
                            value={newClient.address?.city}
                            onChange={e => setNewClient({...newClient, address: { ...newClient.address!, city: e.target.value }})}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="label">Logradouro</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          placeholder="Rua, Avenida, etc." 
                          value={newClient.address?.street}
                          onChange={e => setNewClient({...newClient, address: { ...newClient.address!, street: e.target.value }})}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="label">Número</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            placeholder="123" 
                            value={newClient.address?.number}
                            onChange={e => setNewClient({...newClient, address: { ...newClient.address!, number: e.target.value }})}
                          />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <label className="label">Bairro</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            placeholder="Centro" 
                            value={newClient.address?.neighborhood}
                            onChange={e => setNewClient({...newClient, address: { ...newClient.address!, neighborhood: e.target.value }})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="label">Estado</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            placeholder="SP"
                            value={newClient.address?.state}
                            onChange={e => setNewClient({...newClient, address: { ...newClient.address!, state: e.target.value }})}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="label">Complemento</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            placeholder="Apto, Bloco, etc."
                            value={newClient.address?.complement}
                            onChange={e => setNewClient({...newClient, address: { ...newClient.address!, complement: e.target.value }})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className="btn-primary px-8"
                >
                  {selectedClient ? 'Salvar Alterações' : 'Cadastrar Cliente'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto">
          <button 
            onClick={() => setActiveFilter('all')}
            className={cn(
              "flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all",
              activeFilter === 'all' ? "bg-white shadow-sm text-neutral-800" : "text-gray-500 hover:text-gray-900"
            )}
          >
            Todos
          </button>
          <button 
            onClick={() => setActiveFilter('active')}
            className={cn(
              "flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all",
              activeFilter === 'active' ? "bg-white shadow-sm text-neutral-800" : "text-gray-500 hover:text-gray-900"
            )}
          >
            Ativos
          </button>
          <button 
            onClick={() => setActiveFilter('lead')}
            className={cn(
              "flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all",
              activeFilter === 'lead' ? "bg-white shadow-sm text-neutral-800" : "text-gray-500 hover:text-gray-900"
            )}
          >
            Leads
          </button>
          <button 
            onClick={() => setActiveFilter('vip')}
            className={cn(
              "flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all",
              activeFilter === 'vip' ? "bg-white shadow-sm text-neutral-800" : "text-gray-500 hover:text-gray-900"
            )}
          >
            VIP
          </button>
        </div>
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome, email, CPF ou telefone..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-neutral-800 outline-none transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="card p-0 overflow-hidden group hover:border-gray-200 transition-all flex flex-col"
          >
            {/* Card Header with Status */}
            <div className="p-6 pb-4 border-b border-gray-50 relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                  getStatusColor(client.status)
                )}>
                  {getStatusLabel(client.status)}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center font-black text-2xl border border-gray-100 group-hover:bg-gray-100 group-hover:text-neutral-800 transition-colors">
                  {client.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-gray-900 text-xl tracking-tight truncate">{client.name}</h3>
                  <div className="flex items-center gap-1 text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                    <MapPin className="w-3 h-3" />
                    {client.address.city}, {client.address.state}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6 flex-1">
              {/* Contact Info */}
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 text-gray-600 group/link cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover/link:bg-gray-100 group-hover/link:text-neutral-800 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 group/link cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover/link:bg-emerald-50 group-hover/link:text-emerald-600 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{client.whatsapp || client.phone}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Gasto</p>
                  <p className="text-lg font-black text-gray-900 tracking-tighter">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.totalSpent || 0)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Última Compra</p>
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {client.lastPurchase ? new Date(client.lastPurchase).toLocaleDateString('pt-BR') : 'Nenhuma'}
                  </p>
                </div>
              </div>

              {/* Notes Preview */}
              {client.notes && (
                <div className="flex gap-2 items-start p-3 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                  <StickyNote className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700 line-clamp-2 italic leading-relaxed">
                    "{client.notes}"
                  </p>
                </div>
              )}

              {/* Assigned Vehicles */}
              {client.assignedVehicles && client.assignedVehicles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Interesses</p>
                  <div className="flex flex-wrap gap-1">
                    {client.assignedVehicles.slice(0, 2).map(vId => {
                      const vehicle = allVehicles.find(v => v.id === vId);
                      if (!vehicle) return null;
                      return (
                        <span key={vId} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-100 text-gray-600 rounded-lg text-[10px] font-bold shadow-sm">
                          <Car className="w-3 h-3 text-neutral-800" />
                          {vehicle.brand} {vehicle.model}
                        </span>
                      );
                    })}
                    {client.assignedVehicles.length > 2 && (
                      <span className="text-[10px] font-bold text-gray-400 ml-1">+{client.assignedVehicles.length - 2} mais</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 flex flex-col gap-2">
              <div className="flex gap-2">
                <button 
                  onClick={() => navigate(`/contratos?clientId=${client.id}`)}
                  className="flex-1 h-10 bg-neutral-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-900/15 flex items-center justify-center gap-2"
                >
                  <FileCode className="w-4 h-4" />
                  Vender
                </button>
                <button 
                  onClick={() => {
                    setViewingClient(client);
                    setIsDetailsOpen(true);
                  }}
                  className="flex-1 h-10 bg-white border border-gray-200 text-gray-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <UserCircle className="w-4 h-4" />
                  Perfil
                </button>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const phone = (client.whatsapp || client.phone || '').replace(/\D/g, '');
                    window.open(`https://wa.me/55${phone}`, '_blank');
                  }}
                  className="flex-1 h-10 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(client)}
                    className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all flex items-center justify-center border border-gray-100"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(client.id)}
                    className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 hover:text-neutral-800 transition-all flex items-center justify-center border border-gray-100"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Client Details Modal */}
      <AnimatePresence>
        {isDetailsOpen && viewingClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-neutral-900/15">
                    {viewingClient.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{viewingClient.name}</h2>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      getStatusColor(viewingClient.status)
                    )}>
                      {getStatusLabel(viewingClient.status)}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDetailsOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto flex-1 space-y-8">
                {/* Personal Info */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-neutral-800 uppercase tracking-widest flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Dados Pessoais
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CPF</p>
                        <p className="text-sm font-bold text-gray-900">{viewingClient.cpf}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">RG</p>
                        <p className="text-sm font-bold text-gray-900">{viewingClient.rg || 'Não informado'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nascimento</p>
                        <p className="text-sm font-bold text-gray-900">
                          {viewingClient.birthDate ? new Date(viewingClient.birthDate).toLocaleDateString('pt-BR') : 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gênero</p>
                        <p className="text-sm font-bold text-gray-900 capitalize">
                          {viewingClient.gender === 'male' ? 'Masculino' : viewingClient.gender === 'female' ? 'Feminino' : 'Outro'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-neutral-800 uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Endereço
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logradouro</p>
                        <p className="text-sm font-bold text-gray-900">
                          {viewingClient.address.street}, {viewingClient.address.number}
                          {viewingClient.address.complement && ` - ${viewingClient.address.complement}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bairro</p>
                        <p className="text-sm font-bold text-gray-900">{viewingClient.address.neighborhood}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cidade/Estado</p>
                        <p className="text-sm font-bold text-gray-900">{viewingClient.address.city} - {viewingClient.address.state}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CEP</p>
                        <p className="text-sm font-bold text-gray-900">{viewingClient.address.zipCode}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial & Interests */}
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-neutral-800 uppercase tracking-widest flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Histórico Financeiro
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Investido</p>
                        <p className="text-2xl font-black text-gray-900 tracking-tighter">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(viewingClient.totalSpent || 0)}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Última Compra</p>
                        <p className="text-lg font-bold text-gray-900">
                          {viewingClient.lastPurchase ? new Date(viewingClient.lastPurchase).toLocaleDateString('pt-BR') : 'Nenhuma compra registrada'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-neutral-800 uppercase tracking-widest flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      Veículos de Interesse
                    </h3>
                    <div className="space-y-2">
                      {viewingClient.assignedVehicles && viewingClient.assignedVehicles.length > 0 ? (
                        viewingClient.assignedVehicles.map(vId => {
                          const vehicle = allVehicles.find(v => v.id === vId);
                          if (!vehicle) return null;
                          return (
                            <div key={vId} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-neutral-800">
                                  <Car className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-900">{vehicle.brand} {vehicle.model}</p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase">{vehicle.year} • {vehicle.color}</p>
                                </div>
                              </div>
                              <span className="text-xs font-black text-neutral-800">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vehicle.salePrice)}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-gray-400 italic">Nenhum veículo de interesse associado.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {viewingClient.notes && (
                  <div className="space-y-4 pt-8 border-t border-gray-100">
                    <h3 className="text-xs font-black text-neutral-800 uppercase tracking-widest flex items-center gap-2">
                      <StickyNote className="w-4 h-4" />
                      Observações Internas
                    </h3>
                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                      <p className="text-sm text-amber-900 leading-relaxed italic">
                        "{viewingClient.notes}"
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                <button 
                  onClick={() => setIsDetailsOpen(false)}
                  className="btn-primary px-12"
                >
                  Fechar Perfil
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
