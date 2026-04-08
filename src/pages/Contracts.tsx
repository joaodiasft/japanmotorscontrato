import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  X,
  User,
  Car,
  DollarSign,
  ShieldCheck,
  Calendar as CalendarIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { storage } from '../services/storage';
import { Contract, Client, Vehicle, ContractTemplate } from '../types';

export default function Contracts() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newContract, setNewContract] = useState<Partial<Contract>>({
    clientId: '',
    vehicleId: '',
    templateId: '',
    type: 'sale',
    totalValue: 0,
    downPayment: 0,
    balance: 0,
    paymentMethod: '',
    warrantyDays: 90,
    clauses: [],
    date: new Date().toISOString(),
    status: 'active'
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [ct, cl, vh, settings] = await Promise.all([
          storage.getContracts(),
          storage.getClients(),
          storage.getVehicles(),
          storage.getSettings(),
        ]);
        if (cancelled) return;
        setContracts(ct);
        setClients(cl);
        setVehicles(vh);
        setTemplates(settings.contractTemplates);
        if (settings.contractTemplates.length > 0) {
          setNewContract((prev) => ({
            ...prev,
            templateId: settings.contractTemplates[0].id,
          }));
        }

        const vehicleId = searchParams.get('vehicleId');
        const clientId = searchParams.get('clientId');
        if (vehicleId || clientId) {
          setNewContract((prev) => ({
            ...prev,
            vehicleId: vehicleId || prev.vehicleId,
            clientId: clientId || prev.clientId,
          }));
          setIsModalOpen(true);
        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const handleSave = async () => {
    if (newContract.clientId && newContract.vehicleId) {
      const client = clients.find((c) => c.id === newContract.clientId);
      const vehicle = vehicles.find((v) => v.id === newContract.vehicleId);

      await storage.saveContract({
        ...(newContract as Omit<Contract, 'id' | 'clientName' | 'vehicleName'>),
        clientName: client?.name || '',
        vehicleName: `${vehicle?.brand} ${vehicle?.model}` || '',
      });

      setContracts(await storage.getContracts());
      setIsModalOpen(false);
      const settings = await storage.getSettings();
      setNewContract({
        clientId: '',
        vehicleId: '',
        templateId: settings.contractTemplates[0]?.id || '',
        type: 'sale',
        totalValue: 0,
        downPayment: 0,
        balance: 0,
        paymentMethod: '',
        warrantyDays: 90,
        clauses: [],
        date: new Date().toISOString(),
        status: 'active',
      });
    }
  };

  const filteredContracts = contracts.filter(c => 
    (c.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.vehicleName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Contratos</h1>
          <p className="text-gray-500 mt-1">Gerencie todos os contratos de compra e venda da loja.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus className="w-5 h-5" />
          Novo Contrato
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
              className="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-full"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Novo Contrato</h2>
                  <p className="text-sm text-gray-500">Gere um novo contrato de compra ou venda de veículo.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {/* Step 1: Parties */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                      <User className="w-4 h-4" />
                      1. Partes e Modelo
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="label">Modelo de Contrato</label>
                        <select 
                          className="input-field appearance-none"
                          value={newContract.templateId}
                          onChange={e => setNewContract({...newContract, templateId: e.target.value})}
                        >
                          {templates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="label">Tipo de Contrato</label>
                        <select 
                          className="input-field appearance-none"
                          value={newContract.type}
                          onChange={e => setNewContract({...newContract, type: e.target.value as 'sale' | 'purchase'})}
                        >
                          <option value="sale">Venda (Loja para Cliente)</option>
                          <option value="purchase">Compra (Cliente para Loja)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="label">Selecionar Cliente</label>
                        <select 
                          className="input-field appearance-none"
                          value={newContract.clientId}
                          onChange={e => setNewContract({...newContract, clientId: e.target.value})}
                        >
                          <option value="">Selecione um cliente...</option>
                          {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="label">Selecionar Veículo</label>
                        <select 
                          className="input-field appearance-none"
                          value={newContract.vehicleId}
                          onChange={e => setNewContract({...newContract, vehicleId: e.target.value})}
                        >
                          <option value="">Selecione um veículo...</option>
                          {vehicles.map(v => (
                            <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plate})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Financials */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      2. Condições Comerciais
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="label">Valor Total</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                          <input 
                            type="number" 
                            className="input-field pl-12" 
                            placeholder="0,00"
                            value={newContract.totalValue}
                            onChange={e => {
                              const val = parseFloat(e.target.value) || 0;
                              setNewContract({...newContract, totalValue: val, balance: val - (newContract.downPayment || 0)});
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="label">Valor de Entrada</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                          <input 
                            type="number" 
                            className="input-field pl-12" 
                            placeholder="0,00" 
                            value={newContract.downPayment}
                            onChange={e => {
                              const val = parseFloat(e.target.value) || 0;
                              setNewContract({...newContract, downPayment: val, balance: (newContract.totalValue || 0) - val});
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="label">Forma de Pagamento</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          placeholder="Ex: Financiamento 48x" 
                          value={newContract.paymentMethod}
                          onChange={e => setNewContract({...newContract, paymentMethod: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Terms */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      3. Termos e Garantia
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="label">Prazo de Garantia (Dias)</label>
                        <input 
                          type="number" 
                          className="input-field" 
                          value={newContract.warrantyDays}
                          onChange={e => setNewContract({...newContract, warrantyDays: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="label">Data do Contrato</label>
                        <input 
                          type="date" 
                          className="input-field" 
                          value={newContract.date?.split('T')[0]}
                          onChange={e => setNewContract({...newContract, date: new Date(e.target.value).toISOString()})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="label">Cláusulas Adicionais</label>
                        <textarea 
                          className="input-field min-h-[80px] resize-none" 
                          placeholder="Observações específicas do contrato..." 
                          value={newContract.clauses?.join('\n')}
                          onChange={e => setNewContract({...newContract, clauses: e.target.value.split('\n')})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-red-900">Pré-visualização do Documento</h4>
                    <p className="text-sm text-red-700">O sistema irá gerar um PDF formatado com todas as cláusulas legais da Japan Motors.</p>
                  </div>
                  <button className="btn-secondary border-red-200 text-red-600 hover:bg-red-100">
                    Ver Rascunho
                  </button>
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
                  Gerar Contrato
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">Total de Contratos</p>
            <p className="text-2xl font-bold text-gray-900">{contracts.length}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">Concluídos</p>
            <p className="text-2xl font-bold text-gray-900">{contracts.filter(c => c.status === 'completed').length}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">Em Andamento</p>
            <p className="text-2xl font-bold text-gray-900">{contracts.filter(c => c.status === 'active').length}</p>
          </div>
        </div>
      </div>

      {/* Search & Table */}
      <div className="space-y-4">
        <div className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por número do contrato, cliente ou veículo..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-red-600 outline-none transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="card p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contrato</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Veículo</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <FileText className="w-10 h-10" />
                      <p className="font-medium text-gray-500">Nenhum contrato encontrado</p>
                      <p className="text-sm">{searchTerm ? 'Tente outro termo de busca.' : 'Crie o primeiro contrato clicando em "Novo Contrato".'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    onClick={() => navigate(`/contratos/${contract.id}`)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-bold text-gray-900">{contract.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                        contract.type === 'sale' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                      )}>
                        {contract.type === 'sale' ? 'Venda' : 'Compra'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{contract.clientName}</td>
                    <td className="px-6 py-4 text-gray-600">{contract.vehicleName}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contract.totalValue)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {format(new Date(contract.date), "dd/MM/yyyy", { locale: ptBR })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {contract.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-500" />
                        )}
                        <span className={cn(
                          "text-xs font-medium",
                          contract.status === 'completed' ? "text-emerald-700" : "text-amber-700"
                        )}>
                          {contract.status === 'completed' ? 'Finalizado' : 'Em Aberto'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 transition-all"
                          title="Imprimir"
                          onClick={(e) => { e.stopPropagation(); navigate(`/contratos/${contract.id}`); }}
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 transition-all"
                          title="Download PDF"
                          onClick={(e) => { e.stopPropagation(); navigate(`/contratos/${contract.id}`); }}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-all"
                          onClick={(e) => { e.stopPropagation(); navigate(`/contratos/${contract.id}`); }}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
