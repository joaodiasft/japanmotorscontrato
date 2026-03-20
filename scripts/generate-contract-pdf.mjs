import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i];
    if (!v.startsWith('--')) continue;
    const key = v.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      args[key] = next;
      i++;
    } else {
      args[key] = true;
    }
  }
  return args;
}

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceVariables(content, data) {
  let result = content;
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{${escapeRegExp(key)}}}`, 'g');
    result = result.replace(regex, value ?? '');
  }
  return result;
}

function formatBRLNoSymbol(value) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDatePtBR(isoDate) {
  const d = new Date(isoDate);
  // ex: "20 de março de 2026"
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function filePathToFileUrl(filePath) {
  // Windows absolute path -> file:///C:/...
  const normalized = path.resolve(filePath).replace(/\\/g, '/');
  return `file:///${normalized}`;
}

function pickChromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  return candidates.find((p) => p);
}

async function exists(filePath) {
  if (!filePath) return false;
  try {
    await fs.stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveChromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);

  for (const p of candidates) {
    // eslint-disable-next-line no-await-in-loop
    if (await exists(p)) return p;
  }
  throw new Error(
    'Não encontrei Chrome/Edge instalado. Defina CHROME_PATH no .env (caminho do chrome.exe).',
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const clientId = args.clientId ?? '1';
  const vehicleId = args.vehicleId ?? '1';
  const status = args.status ?? 'active';
  const templateIdOverride = args.templateId;
  const outputDir = args.outputDir ?? path.join(__dirname, '..', 'generated');

  const apiBase = process.env.VITE_API_PROXY ?? 'http://127.0.0.1:3002';
  const api = apiBase.replace(/\/$/, '');

  const [client, vehicle, settings] = await Promise.all([
    fetch(`${api}/api/clients/${encodeURIComponent(clientId)}`).then((r) => r.json()),
    fetch(`${api}/api/vehicles/${encodeURIComponent(vehicleId)}`).then((r) => r.json()),
    fetch(`${api}/api/settings`).then((r) => r.json()),
  ]);

  const template =
    settings.contractTemplates?.find((t) => t.id === templateIdOverride) ??
    settings.contractTemplates?.find((t) => t.id === 'default') ??
    settings.contractTemplates?.[0];

  if (!template) throw new Error('Nenhum template encontrado em /api/settings');

  const totalValue = vehicle.salePrice ?? vehicle.acquisitionPrice ?? 0;
  const downPayment = Math.min(totalValue, args.downPayment ? Number(args.downPayment) : 45900);
  const balance = totalValue - downPayment;

  const nowIso = new Date().toISOString();
  const contractId = `CTR-PDF-${Date.now()}`;

  const payload = {
    id: contractId,
    type: 'sale',
    clientId,
    vehicleId,
    clientName: client.name,
    vehicleName: `${vehicle.brand} ${vehicle.model}`,
    date: nowIso,
    totalValue,
    downPayment,
    balance,
    paymentMethod: args.paymentMethod ?? 'Financiamento 48x',
    warrantyDays: Number(args.warrantyDays ?? 90),
    clauses: [],
    templateId: template.id,
    status,
  };

  await fetch(`${api}/api/contracts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(async (r) => {
    if (!r.ok) throw new Error(await r.text());
  });

  const [contractLatest, latestClient, latestVehicle] = await Promise.all([
    fetch(`${api}/api/contracts/${encodeURIComponent(contractId)}`).then((r) => r.json()),
    fetch(`${api}/api/clients/${encodeURIComponent(clientId)}`).then((r) => r.json()),
    fetch(`${api}/api/vehicles/${encodeURIComponent(vehicleId)}`).then((r) => r.json()),
  ]);

  const variableData = {
    clientName: latestClient.name,
    clientCpf: latestClient.cpf,
    clientRg: latestClient.rg ?? '',
    clientAddress: `${latestClient.address.street}, ${latestClient.address.number} - ${latestClient.address.city}/${latestClient.address.state}`,
    clientPhone: latestClient.phone ?? '',
    clientEmail: latestClient.email ?? '',

    vehicleBrand: latestVehicle.brand,
    vehicleModel: latestVehicle.model,
    vehicleYear: String(latestVehicle.year),
    vehicleColor: latestVehicle.color,
    vehiclePlate: latestVehicle.plate,
    vehicleVin: latestVehicle.vin,
    vehicleRenavam: latestVehicle.renavam,

    // O front usa 'VALOR POR EXTENSO' como placeholder.
    totalValue: formatBRLNoSymbol(contractLatest.totalValue),
    totalValueWords: args.totalValueWords ?? 'VALOR POR EXTENSO',
    downPayment: formatBRLNoSymbol(contractLatest.downPayment),
    balance: formatBRLNoSymbol(contractLatest.balance),
    installments: contractLatest.paymentMethod,
    paymentMethod: contractLatest.paymentMethod,

    companyName: settings.companyName,
    companyCnpj: settings.cnpj,
    companyAddress: settings.address,
    city:
      (settings.address.split('-')[1]?.trim()?.split(',')[0] ?? 'São Paulo') ||
      'São Paulo',

    date: formatDatePtBR(contractLatest.date),
    warrantyDays: String(contractLatest.warrantyDays ?? 90),
  };

  const rendered = replaceVariables(template.content, variableData);

  await fs.mkdir(outputDir, { recursive: true });
  const htmlPath = path.join(outputDir, `${contractId}.html`);
  const pdfPath = path.join(outputDir, `${contractId}.pdf`);

  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      @page { size: A4; margin: 1.5cm; }
      body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
      /* O template já tem estilos inline; só garantimos que o conteúdo imprima. */
      #print-root { width: 100%; }
    </style>
  </head>
  <body>
    <div id="print-root">${rendered}</div>
  </body>
</html>`;

  await fs.writeFile(htmlPath, html, 'utf8');

  const chromePath = await resolveChromePath();
  const htmlUrl = filePathToFileUrl(htmlPath);

  execFileSync(
    chromePath,
    [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      `--print-to-pdf=${pdfPath}`,
      htmlUrl,
    ],
    { stdio: 'inherit' },
  );

  console.log(JSON.stringify({ contractId, pdfPath }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

