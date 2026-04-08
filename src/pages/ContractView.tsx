import React, { useEffect, useState } from 'react';
import { 
  Printer, 
  Download, 
  Share2, 
  ArrowLeft,
  ShieldCheck,
  Calendar,
  User,
  Car,
  DollarSign,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Type,
  Palette,
  Droplets
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { storage } from '../services/storage';
import { Contract, Client, Vehicle, SystemSettings } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BRAND_LOGO_ALT, BRAND_LOGO_URL, BRAND_NAME } from '../config/brand';

const replaceVariables = (content: string, data: Record<string, string>) => {
  let result = content;
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value || '');
  });
  return result;
};

function numberToWords(value: number): string {
  const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const tens = ['', 'dez', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  const convertGroup = (n: number): string => {
    if (n === 0) return '';
    if (n === 100) return 'cem';
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const u = n % 10;
    const parts: string[] = [];
    if (h > 0) parts.push(hundreds[h]);
    if (t === 1) {
      parts.push(teens[u]);
    } else {
      if (t > 0) parts.push(tens[t]);
      if (u > 0) parts.push(units[u]);
    }
    return parts.join(' e ');
  };

  const intValue = Math.floor(value);
  const cents = Math.round((value - intValue) * 100);
  const billion = Math.floor(intValue / 1_000_000_000);
  const million = Math.floor((intValue % 1_000_000_000) / 1_000_000);
  const thousand = Math.floor((intValue % 1_000_000) / 1_000);
  const remainder = intValue % 1_000;

  const parts: string[] = [];
  if (billion > 0) parts.push(`${convertGroup(billion)} ${billion === 1 ? 'bilhão' : 'bilhões'}`);
  if (million > 0) parts.push(`${convertGroup(million)} ${million === 1 ? 'milhão' : 'milhões'}`);
  if (thousand > 0) parts.push(`${convertGroup(thousand)} mil`);
  if (remainder > 0) parts.push(convertGroup(remainder));

  let result = intValue === 0 ? 'zero' : parts.join(' e ');
  result += intValue === 1 ? ' real' : ' reais';
  if (cents > 0) result += ` e ${convertGroup(cents)} ${cents === 1 ? 'centavo' : 'centavos'}`;
  return result.toUpperCase();
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

export default function ContractView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contract, setContract] = useState<Contract | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('justify');
  const [fontSize, setFontSize] = useState<number>(14);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [printMode, setPrintMode] = useState<'color' | 'bw'>('color');

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const c = await storage.getContractById(id);
        if (cancelled) return;
        if (c) {
          setContract(c);
          const [cl, vh, s] = await Promise.all([
            storage.getClientById(c.clientId),
            storage.getVehicleById(c.vehicleId),
            storage.getSettings(),
          ]);
          if (cancelled) return;
          setClient(cl ?? null);
          setVehicle(vh ?? null);
          setSettings(s);
          setSelectedTemplateId(c.templateId || s.contractTemplates[0]?.id || '');
        } else {
          setContract(null);
          setClient(null);
          setVehicle(null);
          setSettings(null);
        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-64">
        <p className="text-gray-500">Contrato não especificado.</p>
        <button type="button" onClick={() => navigate('/contratos')} className="btn-primary">
          Voltar aos contratos
        </button>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-64">
        <p className="text-gray-500">Contrato não encontrado.</p>
        <button type="button" onClick={() => navigate('/contratos')} className="btn-primary">
          Voltar aos contratos
        </button>
      </div>
    );
  }

  if (!client || !vehicle || !settings) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-64 max-w-md mx-auto text-center px-4">
        <p className="text-gray-500">
          Não foi possível carregar cliente ou veículo deste contrato. Verifique se os cadastros ainda existem.
        </p>
        <button type="button" onClick={() => navigate('/contratos')} className="btn-primary">
          Voltar aos contratos
        </button>
      </div>
    );
  }

  const template = settings.contractTemplates.find(t => t.id === selectedTemplateId) || settings.contractTemplates[0];

  const addr = client.address;
  const clientStreetLine = [addr.street, addr.number && `Nº ${addr.number}`, addr.complement].filter(Boolean).join(', ');
  const vehicleFabModYear = (() => {
    const y = vehicle.year;
    const fab = y > 1 ? y - 1 : y;
    return `${String(fab).slice(-2)}/${String(y).slice(-2)}`;
  })();
  const mileageFmt = new Intl.NumberFormat('pt-BR').format(vehicle.mileage ?? 0);
  const observationsHtml = (contract.clauses ?? [])
    .map((c) => c.trim())
    .filter(Boolean)
    .join('<br/>');
  const stampDate = new Date(contract.createdAt || contract.date);

  const forumCityMatch = settings.address.match(/-\s*([^,]+?)\s*,\s*([A-Z]{2})\s*$/i);
  const forumCity =
    forumCityMatch?.[1]?.trim() ||
    settings.address.split('-')[1]?.trim()?.split(',')?.[0]?.trim() ||
    'São Paulo';
  const forumState = forumCityMatch?.[2]?.trim().toUpperCase() || '';
  const forumFull = [forumCity, forumState].filter(Boolean).join(' - ').toUpperCase();
  const venueDateLine = `${forumCity.toUpperCase()}, ${format(stampDate, "dd 'de' MMMM 'de' yyyy 'às' HH:mm 'horas'", { locale: ptBR })}`;

  const variableData: Record<string, string> = {
    clientName: client.name,
    clientCpf: client.cpf,
    clientRg: client.rg,
    clientAddress: `${client.address.street}, ${client.address.number} - ${client.address.city}/${client.address.state}`,
    clientStreetLine,
    clientNeighborhood: addr.neighborhood ?? '',
    clientCityState: [addr.city, addr.state].filter(Boolean).join(' - '),
    clientZipCode: addr.zipCode ?? '',
    clientPhone: client.phone,
    clientEmail: client.email,
    vehicleBrand: vehicle.brand,
    vehicleModel: vehicle.model,
    vehicleYear: vehicle.year.toString(),
    vehicleYearFabMod: vehicleFabModYear,
    vehicleColor: vehicle.color,
    vehiclePlate: vehicle.plate,
    vehicleVin: vehicle.vin,
    vehicleRenavam: vehicle.renavam,
    vehicleFuel: vehicle.fuel ?? '',
    vehicleMileage: mileageFmt,
    totalValue: formatBRL(contract.totalValue),
    totalValueWords: numberToWords(contract.totalValue),
    downPayment: formatBRL(contract.downPayment),
    cashValue: formatBRL(contract.downPayment),
    financingValue: formatBRL(contract.balance),
    balance: formatBRL(contract.balance),
    installments: contract.paymentMethod,
    paymentMethod: contract.paymentMethod,
    warrantyDays: contract.warrantyDays.toString(),
    companyName: settings.companyName,
    companyCnpj: settings.cnpj,
    companyAddress: settings.address,
    companyPhone: settings.phone ?? '',
    city: forumCity,
    forumFull,
    venueDateLine,
    date: format(new Date(contract.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
    saleDateShort: format(new Date(contract.date), 'dd/MM/yyyy', { locale: ptBR }),
    contractDateLong: format(stampDate, "dd 'de' MMMM 'de' yyyy 'às' HH:mm 'horas'", { locale: ptBR }),
    observations: observationsHtml || '_______________________________',
  };

  const renderedContent = template ? replaceVariables(template.content, variableData) : '';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 print:p-0 print:m-0 print:max-w-none print:w-full">
      {/* Actions Header */}
      <div className="flex flex-col gap-4 print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/contratos')}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            
            <div className="h-6 w-px bg-gray-200" />
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-medium">Modelo:</span>
              <select 
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="text-sm border-gray-200 rounded-lg focus:ring-neutral-500 focus:border-neutral-800"
              >
                {settings.contractTemplates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="btn-secondary" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
            <button className="btn-secondary" onClick={handlePrint}>
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button className="btn-primary">
              <Share2 className="w-4 h-4" />
              Compartilhar
            </button>
          </div>
        </div>

        {/* Formatting Controls */}
        <div className="flex items-center gap-6 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setTextAlign('left')}
              className={`p-2 rounded-lg transition-colors ${textAlign === 'left' ? 'bg-gray-100 text-neutral-800' : 'text-gray-400 hover:bg-gray-50'}`}
              title="Alinhar à Esquerda"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setTextAlign('center')}
              className={`p-2 rounded-lg transition-colors ${textAlign === 'center' ? 'bg-gray-100 text-neutral-800' : 'text-gray-400 hover:bg-gray-50'}`}
              title="Centralizar"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setTextAlign('right')}
              className={`p-2 rounded-lg transition-colors ${textAlign === 'right' ? 'bg-gray-100 text-neutral-800' : 'text-gray-400 hover:bg-gray-50'}`}
              title="Alinhar à Direita"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setTextAlign('justify')}
              className={`p-2 rounded-lg transition-colors ${textAlign === 'justify' ? 'bg-gray-100 text-neutral-800' : 'text-gray-400 hover:bg-gray-50'}`}
              title="Justificar"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-gray-100" />

          <div className="flex items-center gap-3">
            <Type className="w-4 h-4 text-gray-400" />
            <input 
              type="range" 
              min="10" 
              max="24" 
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-32 accent-neutral-800"
            />
            <span className="text-xs font-mono text-gray-500 w-8">{fontSize}px</span>
          </div>

          <div className="h-6 w-px bg-gray-100" />

          <button 
            onClick={() => setIsBold(!isBold)}
            className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${isBold ? 'bg-gray-100 text-neutral-800' : 'text-gray-400 hover:bg-gray-50'}`}
            title="Negrito"
          >
            <Bold className="w-4 h-4" />
            <span className="text-xs font-medium">Negrito</span>
          </button>

          <div className="h-6 w-px bg-gray-100" />

          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
            <button 
              onClick={() => setPrintMode('color')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${printMode === 'color' ? 'bg-white text-neutral-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Palette className="w-3.5 h-3.5" />
              Colorido
            </button>
            <button 
              onClick={() => setPrintMode('bw')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${printMode === 'bw' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Droplets className="w-3.5 h-3.5" />
              P&B
            </button>
          </div>
        </div>
      </div>

      {/* Contract Document */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-none md:rounded-3xl border border-gray-100 overflow-hidden print:overflow-visible print:shadow-none print:border-none print:rounded-none"
      >
        {/* Document Header - Hidden in Print if template has its own */}
        <div className="bg-white p-12 text-neutral-900 border-b border-gray-200 flex justify-between items-start print:hidden">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={BRAND_LOGO_URL}
                alt={BRAND_LOGO_ALT}
                className="h-12 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <h1 className="text-3xl font-bold tracking-tight">{settings.companyName || BRAND_NAME}</h1>
            </div>
            <div className="space-y-1 text-gray-500 text-sm">
              <p>{settings.address}</p>
              <p>CNPJ: {settings.cnpj}</p>
              <p>
                Contato: {settings.phone} • {settings.email}
              </p>
            </div>
          </div>
          <div className="text-right space-y-2">
            <span className="inline-block px-4 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs font-bold uppercase tracking-widest text-neutral-800">
              {template?.name || 'Contrato'}
            </span>
            <p className="text-4xl font-mono font-bold text-neutral-900">#{contract.id}</p>
            <p className="text-gray-500 text-sm">Emitido em {format(new Date(contract.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
          </div>
        </div>

        {/* Document Body */}
        <div className="p-12 space-y-12 print:p-0 print:text-black print:leading-relaxed">
          <div 
            className="prose prose-slate max-w-none contract-content break-words overflow-wrap-anywhere"
            style={{ 
              fontSize: `${fontSize}px`, 
              lineHeight: '1.6',
              color: '#000',
              wordBreak: 'break-word',
              textAlign: textAlign,
              fontWeight: isBold ? 'bold' : 'normal'
            }}
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />
        </div>

        {/* Document Footer */}
        <div className="bg-gray-50 p-8 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em] print:hidden">
          <span>Documento gerado eletronicamente via Japan Motors System</span>
          <span>O PDF/impressão pode ter várias páginas (modelo Contrato de Venda)</span>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .contract-content .contract-jv-root .cv-brand-logo:not(.cv-brand-logo--color) {
          filter: invert(1) brightness(0.35) contrast(1.1);
        }
        .contract-content .contract-jv-root .cv-print-only-break {
          display: none !important;
          height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
        @media print {
          html, body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            ${printMode === 'bw' ? 'filter: grayscale(100%) !important;' : ''}
          }
          @page {
            margin: 12mm 14mm;
            size: A4 portrait;
          }
          aside, header, nav, footer,
          [data-no-print] {
            display: none !important;
          }
          body > div {
            display: block !important;
          }
          main {
            display: block !important;
            width: 100% !important;
            max-width: none !important;
            overflow: visible !important;
            padding: 0 !important;
          }
          main > div {
            padding: 0 !important;
            max-width: none !important;
          }
          .contract-content {
            background: white !important;
            max-width: none !important;
          }
          .contract-content.prose {
            max-width: none !important;
          }
          /* Modelo JV: alinhar à impressão do papel (Courier nos campos, largura útil A4, quebras) */
          .contract-content .contract-jv-root {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            font-size: 10.5pt !important;
            line-height: 1.45 !important;
            color: #000 !important;
          }
          .contract-content .contract-jv-root .jv-field-table,
          .contract-content .contract-jv-root .cv-form-table {
            font-family: 'Courier New', Courier, monospace !important;
            font-size: 10pt !important;
          }
          .contract-content .contract-jv-root .cv-print-only-break {
            display: block !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            border: 0 !important;
            break-after: page !important;
            page-break-after: always !important;
          }
          .contract-content .contract-jv-root section.cv-sheet {
            break-after: auto !important;
            page-break-after: auto !important;
          }
          .contract-content .contract-jv-root section.cv-sheet:last-of-type {
            break-after: auto !important;
            page-break-after: auto !important;
          }
          .contract-content .contract-jv-root .jv-page-break {
            break-after: page !important;
            page-break-after: always !important;
          }
          /* Logo PNG com fundo preto: inverte para cinza escuro legível no papel branco */
          .contract-content .contract-jv-root .cv-brand-logo:not(.cv-brand-logo--color) {
            filter: invert(1) brightness(0.35) contrast(1.1) !important;
          }
          .contract-content .contract-jv-root table {
            page-break-inside: auto;
          }
          .contract-content .contract-jv-root .cv-form-table tr,
          .contract-content .contract-jv-root .cv-price tr {
            break-inside: auto !important;
            page-break-inside: auto !important;
          }
          .contract-content .contract-jv-root .cv-signatures {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}} />
    </div>
  );
}
