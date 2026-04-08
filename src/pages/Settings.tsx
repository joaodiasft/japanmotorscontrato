import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  Users, 
  FileText, 
  Save, 
  Plus, 
  Trash2, 
  Shield, 
  Building2,
  Mail,
  Phone,
  MapPin,
  FileCode,
  RefreshCw
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { storage } from '../services/storage';
import { User, SystemSettings, ContractTemplate } from '../types';

const Quill = ReactQuill as any;

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'templates'>('general');
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, u] = await Promise.all([storage.getSettings(), storage.getUsers()]);
        if (cancelled) return;
        setSettings(s);
        setUsers(u);
        setLoadError(null);
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Erro ao carregar');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User>>({});
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<ContractTemplate>>({});
  const quillRef = React.useRef<any>(null);

  const AVAILABLE_VARIABLES = [
    { label: 'Nome do Cliente', value: '{{clientName}}' },
    { label: 'CPF do Cliente', value: '{{clientCpf}}' },
    { label: 'RG do Cliente', value: '{{clientRg}}' },
    { label: 'Endereço do Cliente', value: '{{clientAddress}}' },
    { label: 'Logradouro / Nº (linha)', value: '{{clientStreetLine}}' },
    { label: 'Bairro do Cliente', value: '{{clientNeighborhood}}' },
    { label: 'Cidade - UF', value: '{{clientCityState}}' },
    { label: 'CEP do Cliente', value: '{{clientZipCode}}' },
    { label: 'Telefone do Cliente', value: '{{clientPhone}}' },
    { label: 'E-mail do Cliente', value: '{{clientEmail}}' },
    { label: 'Marca do Veículo', value: '{{vehicleBrand}}' },
    { label: 'Modelo do Veículo', value: '{{vehicleModel}}' },
    { label: 'Ano do Veículo', value: '{{vehicleYear}}' },
    { label: 'Ano Fab./Mod. (2 dígitos)', value: '{{vehicleYearFabMod}}' },
    { label: 'Cor do Veículo', value: '{{vehicleColor}}' },
    { label: 'Combustível', value: '{{vehicleFuel}}' },
    { label: 'Quilometragem', value: '{{vehicleMileage}}' },
    { label: 'Placa do Veículo', value: '{{vehiclePlate}}' },
    { label: 'Chassi do Veículo', value: '{{vehicleVin}}' },
    { label: 'Renavam do Veículo', value: '{{vehicleRenavam}}' },
    { label: 'Valor Total', value: '{{totalValue}}' },
    { label: 'Valor por Extenso', value: '{{totalValueWords}}' },
    { label: 'Entrada', value: '{{downPayment}}' },
    { label: 'Valor em dinheiro (tabela)', value: '{{cashValue}}' },
    { label: 'Valor financiamento (tabela)', value: '{{financingValue}}' },
    { label: 'Forma de Pagamento', value: '{{paymentMethod}}' },
    { label: 'Saldo / Valor Financiado', value: '{{balance}}' },
    { label: 'Parcelas / Condições', value: '{{installments}}' },
    { label: 'Prazo de Garantia (Dias)', value: '{{warrantyDays}}' },
    { label: 'Nome da Empresa', value: '{{companyName}}' },
    { label: 'CNPJ da Empresa', value: '{{companyCnpj}}' },
    { label: 'Endereço da Empresa', value: '{{companyAddress}}' },
    { label: 'Telefone da Empresa', value: '{{companyPhone}}' },
    { label: 'Cidade (foro)', value: '{{city}}' },
    { label: 'Data por extenso', value: '{{date}}' },
    { label: 'Data da venda (dd/mm/aaaa)', value: '{{saleDateShort}}' },
    { label: 'Data e hora (rodapé)', value: '{{contractDateLong}}' },
    { label: 'Observações (cláusulas)', value: '{{observations}}' },
  ];

  const insertVariable = (variable: string) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range) {
        quill.insertText(range.index, variable);
      } else {
        quill.insertText(quill.getLength() - 1, variable);
      }
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    const saved = await storage.saveSettings(settings);
    setSettings(saved);
    alert('Configurações salvas com sucesso!');
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: editingUser.id || Math.random().toString(36).substr(2, 9),
      name: editingUser.name || '',
      email: editingUser.email || '',
      role: editingUser.role || 'vendedor',
      createdAt: editingUser.createdAt || new Date().toISOString(),
    };
    await storage.saveUser(newUser);
    setUsers(await storage.getUsers());
    setShowUserModal(false);
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      await storage.deleteUser(id);
      setUsers(await storage.getUsers());
    }
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    const newTemplate: ContractTemplate = {
      id: editingTemplate.id || Math.random().toString(36).substr(2, 9),
      name: editingTemplate.name || '',
      content: editingTemplate.content || '',
    };

    const updatedTemplates = [...settings.contractTemplates];
    const index = updatedTemplates.findIndex((t) => t.id === newTemplate.id);
    if (index >= 0) {
      updatedTemplates[index] = newTemplate;
    } else {
      updatedTemplates.push(newTemplate);
    }

    const updatedSettings = { ...settings, contractTemplates: updatedTemplates };
    const saved = await storage.saveSettings(updatedSettings);
    setSettings(saved);
    setShowTemplateModal(false);
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!settings) return;
    if (confirm('Tem certeza que deseja excluir este modelo?')) {
      const updatedTemplates = settings.contractTemplates.filter((t) => t.id !== id);
      const updatedSettings = { ...settings, contractTemplates: updatedTemplates };
      const saved = await storage.saveSettings(updatedSettings);
      setSettings(saved);
    }
  };

  const handleResetTemplates = async () => {
    if (
      confirm(
        'Isso irá restaurar os modelos padrão do sistema. Seus modelos personalizados serão perdidos. Deseja continuar?',
      )
    ) {
      const updatedSettings = await storage.resetTemplates();
      setSettings(updatedSettings);
      alert('Modelos restaurados com sucesso!');
    }
  };

  if (loadError) {
    return (
      <div className="p-8 rounded-xl border border-red-200 bg-red-50 text-red-800">
        <p className="font-medium">Não foi possível carregar as configurações.</p>
        <p className="text-sm mt-2">{loadError}</p>
        <p className="text-sm mt-2">Confirme se a API está rodando ({`npm run dev`} inicia Vite + servidor).</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-slate-500">
        Carregando configurações…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configurações do Sistema</h1>
          <p className="text-slate-500">Gerencie usuários, modelos de contrato e dados da empresa</p>
        </div>
      </div>

      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'general' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Geral</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Usuários</span>
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'templates' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Modelos de Contrato</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {activeTab === 'general' && (
          <form onSubmit={handleSaveSettings} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nome da Empresa</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={e => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">CNPJ</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={settings.cnpj}
                    onChange={e => setSettings({ ...settings, cnpj: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">E-mail de Contato</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={settings.email}
                    onChange={e => setSettings({ ...settings, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={e => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-slate-700">Endereço Completo</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={settings.address}
                    onChange={e => setSettings({ ...settings, address: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </form>
        )}

        {activeTab === 'users' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Usuários do Sistema</h3>
              <button
                onClick={() => {
                  setEditingUser({});
                  setShowUserModal(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Usuário</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 font-semibold text-slate-700">Nome</th>
                    <th className="pb-3 font-semibold text-slate-700">E-mail</th>
                    <th className="pb-3 font-semibold text-slate-700">Cargo</th>
                    <th className="pb-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 font-medium text-slate-900">{user.name}</td>
                      <td className="py-4 text-slate-600">{user.email}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role === 'admin' ? 'Administrador' : 'Vendedor'}
                        </span>
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowUserModal(true);
                          }}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Modelos de Contrato</h3>
              <div className="flex gap-3">
                <button
                  onClick={handleResetTemplates}
                  className="flex items-center space-x-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                  title="Restaurar modelos padrão"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Restaurar Padrão</span>
                </button>
                <button
                  onClick={() => {
                    setEditingTemplate({});
                    setShowTemplateModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Modelo</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settings.contractTemplates.map(template => (
                <div key={template.id} className="p-4 border border-slate-200 rounded-xl hover:border-indigo-300 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h4 className="font-semibold text-slate-900">{template.name}</h4>
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingTemplate(template);
                          setShowTemplateModal(true);
                        }}
                        className="p-2 text-slate-400 hover:text-indigo-600"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-2 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {template.content.substring(0, 150)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">
                {editingUser.id ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-600">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={editingUser.name || ''}
                  onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">E-mail</label>
                <input
                  type="email"
                  required
                  value={editingUser.email || ''}
                  onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Cargo</label>
                <select
                  value={editingUser.role || 'vendedor'}
                  onChange={e => setEditingUser({ ...editingUser, role: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="vendedor">Vendedor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">
                {editingTemplate.id ? 'Editar Modelo' : 'Novo Modelo de Contrato'}
              </h2>
              <button onClick={() => setShowTemplateModal(false)} className="text-slate-400 hover:text-slate-600">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTemplate} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Nome do Modelo</label>
                <input
                  type="text"
                  required
                  value={editingTemplate.name || ''}
                  onChange={e => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: Contrato de Venda à Vista"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-700">Conteúdo do Contrato</label>
                  <span className="text-xs text-slate-400">Use as tags abaixo para preenchimento automático</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                  {AVAILABLE_VARIABLES.map(variable => (
                    <button
                      key={variable.value}
                      type="button"
                      onClick={() => insertVariable(variable.value)}
                      className="px-2 py-1 text-[10px] font-medium bg-white border border-slate-200 rounded hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                    >
                      {variable.label}
                    </button>
                  ))}
                </div>

                <div className="h-96 mb-12">
                  <Quill
                    ref={quillRef}
                    theme="snow"
                    value={editingTemplate.content || ''}
                    onChange={(content: string) => setEditingTemplate({ ...editingTemplate, content })}
                    className="h-full"
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['clean']
                      ],
                    }}
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
                  className="px-6 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Salvar Modelo
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
