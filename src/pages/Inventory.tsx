import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Car, 
  Bike,
  Calendar, 
  Hash, 
  Palette,
  Eye,
  Edit2,
  Trash2,
  X,
  Upload,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  DollarSign,
  Gauge,
  FileCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { storage } from '../services/storage';
import { Vehicle } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Inventory() {
  const navigate = useNavigate();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState<'all' | 'car' | 'motorcycle'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    type: 'car',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    plate: '',
    vin: '',
    renavam: '',
    mileage: 0,
    fuel: 'Flex',
    acquisitionPrice: 0,
    salePrice: 0,
    status: 'available',
    images: []
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await storage.getVehicles();
        if (!cancelled) setVehicles(list);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    if (newVehicle.brand && newVehicle.model && newVehicle.plate) {
      await storage.saveVehicle(newVehicle as Omit<Vehicle, 'id'>);
      setVehicles(await storage.getVehicles());
      setIsModalOpen(false);
      setNewVehicle({
        type: 'car',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        plate: '',
        vin: '',
        renavam: '',
        mileage: 0,
        fuel: 'Flex',
        acquisitionPrice: 0,
        salePrice: 0,
        status: 'available',
        images: []
      });
    }
  };

  const handleDelete = async (id: string) => {
    await storage.deleteVehicle(id);
    setVehicles(await storage.getVehicles());
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = (v.model || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.plate || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.vin || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || v.type === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Estoque</h1>
          <p className="text-gray-500 font-medium mt-1">Gerencie os veículos disponíveis e registrados no sistema.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary shadow-lg shadow-neutral-900/15 px-8">
          <Plus className="w-5 h-5" />
          Novo Veículo
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
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Entrada de Veículo</h2>
                  <p className="text-sm text-gray-500 font-medium">Preencha os dados técnicos e financeiros do veículo.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Form Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Technical Data */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest flex items-center gap-2">
                      {newVehicle.type === 'motorcycle' ? <Bike className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                      Dados Técnicos
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-1">
                        <label className="label">Tipo de Veículo</label>
                        <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                          <button
                            type="button"
                            onClick={() => setNewVehicle({ ...newVehicle, type: 'car' })}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all",
                              newVehicle.type === 'car' ? "bg-white shadow-sm text-neutral-800" : "text-gray-500 hover:text-gray-900"
                            )}
                          >
                            <Car className="w-4 h-4" />
                            Carro
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewVehicle({ ...newVehicle, type: 'motorcycle' })}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all",
                              newVehicle.type === 'motorcycle' ? "bg-white shadow-sm text-neutral-800" : "text-gray-500 hover:text-gray-900"
                            )}
                          >
                            <Bike className="w-4 h-4" />
                            Moto
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="label">Marca</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          placeholder="Ex: Honda"
                          value={newVehicle.brand}
                          onChange={e => setNewVehicle({...newVehicle, brand: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="label">Modelo</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          placeholder="Ex: Civic"
                          value={newVehicle.model}
                          onChange={e => setNewVehicle({...newVehicle, model: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="label">Ano</label>
                        <input 
                          type="number" 
                          className="input-field" 
                          placeholder="2024"
                          value={newVehicle.year}
                          onChange={e => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="label">Cor</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          placeholder="Ex: Prata"
                          value={newVehicle.color}
                          onChange={e => setNewVehicle({...newVehicle, color: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="label">Placa</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          placeholder="ABC-1234"
                          value={newVehicle.plate}
                          onChange={e => setNewVehicle({...newVehicle, plate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="label">Quilometragem</label>
                        <input 
                          type="number" 
                          className="input-field" 
                          placeholder="0" 
                          value={newVehicle.mileage}
                          onChange={e => setNewVehicle({...newVehicle, mileage: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="label">Renavam</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          placeholder="Número do Renavam"
                          value={newVehicle.renavam}
                          onChange={e => setNewVehicle({...newVehicle, renavam: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="label">Combustível</label>
                        <select 
                          className="input-field"
                          value={newVehicle.fuel}
                          onChange={e => setNewVehicle({...newVehicle, fuel: e.target.value})}
                        >
                          <option value="Flex">Flex</option>
                          <option value="Gasolina">Gasolina</option>
                          <option value="Etanol">Etanol</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Híbrido">Híbrido</option>
                          <option value="Elétrico">Elétrico</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="label">Chassi (VIN)</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="9BR..."
                        value={newVehicle.vin}
                        onChange={e => setNewVehicle({...newVehicle, vin: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Financial & Photos */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Financeiro & Fotos
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="label">Preço de Aquisição</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                          <input 
                            type="number" 
                            className="input-field pl-12" 
                            placeholder="0,00" 
                            value={newVehicle.acquisitionPrice}
                            onChange={e => setNewVehicle({...newVehicle, acquisitionPrice: parseFloat(e.target.value)})}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="label">Preço de Venda Sugerido</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                          <input 
                            type="number" 
                            className="input-field pl-12" 
                            placeholder="0,00"
                            value={newVehicle.salePrice}
                            onChange={e => setNewVehicle({...newVehicle, salePrice: parseFloat(e.target.value)})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="label">Fotos do Veículo</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 hover:border-gray-200 hover:bg-gray-100/30 transition-all cursor-pointer">
                          <Upload className="w-8 h-8 text-gray-300" />
                          <p className="text-sm font-medium text-gray-500">Clique ou arraste fotos aqui</p>
                          <p className="text-xs text-gray-400">PNG, JPG até 10MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inspection Notes */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Observações de Vistoria</h3>
                  <textarea 
                    className="input-field min-h-[100px] resize-none" 
                    placeholder="Descreva o estado geral do veículo, avarias ou itens a serem revisados..."
                    value={newVehicle.inspectionNotes}
                    onChange={e => setNewVehicle({...newVehicle, inspectionNotes: e.target.value})}
                  />
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className="btn-primary px-8"
                >
                  Salvar Veículo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto">
          <button 
            onClick={() => setActiveCategory('all')}
            className={cn(
              "flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
              activeCategory === 'all' ? "bg-white shadow-sm text-neutral-800" : "text-gray-500 hover:text-gray-900"
            )}
          >
            Todos
          </button>
          <button 
            onClick={() => setActiveCategory('car')}
            className={cn(
              "flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
              activeCategory === 'car' ? "bg-white shadow-sm text-neutral-800" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <Car className="w-4 h-4" />
            Carros
          </button>
          <button 
            onClick={() => setActiveCategory('motorcycle')}
            className={cn(
              "flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
              activeCategory === 'motorcycle' ? "bg-white shadow-sm text-neutral-800" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <Bike className="w-4 h-4" />
            Motos
          </button>
        </div>
        
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por modelo, placa ou chassi..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-neutral-800 outline-none transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="btn-secondary flex-1 md:flex-none">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setView('grid')}
              className={cn(
                "p-2 rounded-lg transition-all",
                view === 'grid' ? "bg-white shadow-sm text-neutral-800" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn(
                "p-2 rounded-lg transition-all",
                view === 'list' ? "bg-white shadow-sm text-neutral-800" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="card p-0 overflow-hidden group hover:border-gray-200 transition-all flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img 
                  src={vehicle.images?.[0] || `https://picsum.photos/seed/${vehicle.id}/400/300`} 
                  alt={vehicle.model} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg",
                    vehicle.status === 'available' ? "bg-emerald-500 text-white" :
                    vehicle.status === 'sold' ? "bg-gray-500 text-white" :
                    "bg-amber-500 text-white"
                  )}>
                    {vehicle.status === 'available' ? 'Disponível' :
                     vehicle.status === 'sold' ? 'Vendido' : 'Reservado'}
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-4 flex-1 flex flex-col">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {vehicle.type === 'motorcycle' ? <Bike className="w-3 h-3 text-neutral-800" /> : <Car className="w-3 h-3 text-neutral-800" />}
                      <span className="text-[10px] font-black text-neutral-800 uppercase tracking-widest">{vehicle.brand}</span>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight truncate">{vehicle.model}</h3>
                </div>

                <div className="grid grid-cols-2 gap-y-3 text-sm flex-1">
                  <div className="flex items-center gap-2 text-gray-500 font-medium">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {vehicle.year}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 font-medium">
                    <Palette className="w-4 h-4 text-gray-400" />
                    {vehicle.color}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 font-medium">
                    <Hash className="w-4 h-4 text-gray-400" />
                    {vehicle.plate}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 font-medium">
                    <Gauge className="w-4 h-4 text-gray-400" />
                    {vehicle.mileage.toLocaleString()} km
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xl font-black text-gray-900 tracking-tighter">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vehicle.salePrice || 0)}
                  </span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => navigate(`/contratos?vehicleId=${vehicle.id}`)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-neutral-800 hover:text-neutral-800 transition-all flex items-center gap-1 text-xs font-bold"
                      title="Vender este veículo"
                    >
                      <FileCode className="w-4 h-4" />
                      Vender
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(vehicle.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-neutral-800 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Veículo</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ano/Cor</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Placa</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Preço</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                          src={vehicle.images?.[0] || `https://picsum.photos/seed/${vehicle.id}/100/100`} 
                          alt={vehicle.model}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          {vehicle.type === 'motorcycle' ? <Bike className="w-3 h-3 text-gray-400" /> : <Car className="w-3 h-3 text-gray-400" />}
                          <p className="text-sm font-black text-gray-900">{vehicle.brand} {vehicle.model}</p>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{vehicle.vin.substring(0, 10)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-600">{vehicle.year}</p>
                    <p className="text-xs text-gray-400">{vehicle.color}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-black text-gray-600 uppercase tracking-widest">
                      {vehicle.plate}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-gray-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vehicle.salePrice || 0)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                      vehicle.status === 'available' ? "bg-emerald-50 text-emerald-600" :
                      vehicle.status === 'sold' ? "bg-gray-50 text-gray-600" :
                      "bg-amber-50 text-amber-600"
                    )}>
                      {vehicle.status === 'available' ? 'Disponível' :
                       vehicle.status === 'sold' ? 'Vendido' : 'Reservado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/contratos?vehicleId=${vehicle.id}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-neutral-800 hover:text-neutral-800 transition-all flex items-center gap-1 text-xs font-bold"
                        title="Vender este veículo"
                      >
                        <FileCode className="w-4 h-4" />
                        Vender
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-neutral-800 transition-all" onClick={() => handleDelete(vehicle.id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
