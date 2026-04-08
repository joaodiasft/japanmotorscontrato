import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';

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

async function jsonFetch(url, init) {
  const res = await fetch(url, init);
  const text = await res.text();
  const body = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
  if (!res.ok) {
    const msg = typeof body === 'string' ? body : JSON.stringify(body);
    throw new Error(`HTTP ${res.status} ${res.statusText} at ${url} -> ${msg}`);
  }
  return body;
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseWeb = args.baseWeb ?? 'http://127.0.0.1:3000';
  const baseApi = args.baseApi ?? 'http://127.0.0.1:3002';
  const outputDir = args.outputDir ?? path.join(process.cwd(), 'generated');

  const runId = `SMOKE-${Date.now()}`;
  const vehicleId = `VEH-${runId}`;
  const clientId = `CLI-${runId}`;
  const contractId = `CTR-${runId}`;

  const results = [];
  const log = (label, value) => results.push({ label, value });

  // 1) Proxy smoke: Vite 3000 -> API 3002 via /api
  const healthViaWeb = await jsonFetch(`${baseWeb}/api/health`, { method: 'GET' });
  log('proxy health', healthViaWeb);
  assert(healthViaWeb?.ok === true, 'proxy health failed');

  const statsViaWeb = await jsonFetch(`${baseWeb}/api/stats`, { method: 'GET' });
  log('proxy stats', statsViaWeb);

  // 2) Settings fetch (use API directly)
  const settings = await jsonFetch(`${baseApi}/api/settings`, { method: 'GET' });
  log('settings.companyName', settings.companyName);
  assert(Array.isArray(settings.contractTemplates), 'settings.contractTemplates missing');
  const originalCompanyName = settings.companyName;
  const template = settings.contractTemplates[0];

  // 3) Create Vehicle
  const createdVehicle = await jsonFetch(`${baseApi}/api/vehicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: vehicleId,
      type: 'car',
      brand: 'Teste',
      model: 'E2E',
      year: 2024,
      color: 'Azul',
      plate: `TST-${runId.slice(-4)}`,
      vin: `VIN-${runId}`,
      renavam: `REN-${runId}`,
      mileage: 1234,
      fuel: 'Flex',
      acquisitionPrice: 100000,
      salePrice: 120000,
      status: 'available',
      images: [],
      inspectionNotes: 'E2E smoke',
    }),
  });
  log('vehicle created', createdVehicle?.id);
  assert(createdVehicle?.id === vehicleId, 'vehicle id mismatch');

  const fetchedVehicle = await jsonFetch(`${baseApi}/api/vehicles/${encodeURIComponent(vehicleId)}`, {
    method: 'GET',
  });
  assert(fetchedVehicle?.plate === createdVehicle.plate, 'vehicle fetch mismatch');

  // 4) Create Client
  const createdClient = await jsonFetch(`${baseApi}/api/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: clientId,
      name: 'Cliente E2E',
      status: 'active',
      birthDate: '1990-01-01',
      gender: 'male',
      cpf: `000.000.000-${String(runId.slice(-3)).padStart(3, '0')}`,
      rg: `RG-${runId}`,
      email: `cliente-e2e-${runId.slice(-5)}@mail.com`,
      phone: '(11) 90000-0000',
      whatsapp: '(11) 90000-0000',
      address: {
        zipCode: '00000-000',
        street: 'Rua Teste',
        number: '100',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        complement: 'E2E',
      },
      totalSpent: 0,
      lastPurchase: null,
      assignedVehicles: null,
      notes: 'E2E smoke',
    }),
  });
  log('client created', createdClient?.id);
  assert(createdClient?.id === clientId, 'client id mismatch');

  const fetchedClient = await jsonFetch(`${baseApi}/api/clients/${encodeURIComponent(clientId)}`, {
    method: 'GET',
  });
  assert(fetchedClient?.email === createdClient.email, 'client fetch mismatch');

  // 5) Create Contract
  const totalValue = createdVehicle.salePrice ?? createdVehicle.acquisitionPrice ?? 0;
  const downPayment = 45000;
  const balance = totalValue - downPayment;
  const createdContract = await jsonFetch(`${baseApi}/api/contracts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: contractId,
      type: 'sale',
      clientId,
      vehicleId,
      clientName: createdClient.name,
      vehicleName: `${createdVehicle.brand} ${createdVehicle.model}`,
      date: new Date().toISOString(),
      totalValue,
      downPayment,
      balance,
      paymentMethod: 'E2E Payment',
      warrantyDays: 90,
      clauses: [],
      templateId: template?.id,
      status: 'active',
    }),
  });
  log('contract created', createdContract?.id);
  assert(createdContract?.id === contractId, 'contract id mismatch');

  const fetchedContract = await jsonFetch(`${baseApi}/api/contracts/${encodeURIComponent(contractId)}`, {
    method: 'GET',
  });
  assert(fetchedContract?.clientId === clientId, 'contract fetch mismatch');

  // 6) Stats should reflect activeContracts increment
  const statsAfter = await jsonFetch(`${baseApi}/api/stats`, { method: 'GET' });
  log('stats after contract', statsAfter);

  // 7) Settings update + reset templates
  const newCompanyName = `${originalCompanyName} E2E`;
  const updatedSettings = await jsonFetch(`${baseApi}/api/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...settings,
      companyName: newCompanyName,
    }),
  });
  log('settings updated.companyName', updatedSettings?.companyName);
  assert(updatedSettings?.companyName === newCompanyName, 'settings update mismatch');

  const resetSettings = await jsonFetch(`${baseApi}/api/settings/reset-templates`, { method: 'POST' });
  log('settings reset templates count', resetSettings?.contractTemplates?.length);
  assert(resetSettings?.contractTemplates?.length >= 1, 'templates reset failed');

  // revert companyName to avoid leaving user data modified
  await jsonFetch(`${baseApi}/api/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...resetSettings,
      companyName: originalCompanyName,
    }),
  });

  // 8) PDF generation using existing script (best-effort)
  let pdfPath = null;
  try {
    const script = path.join(process.cwd(), 'scripts', 'generate-contract-pdf.mjs');
    const { execFileSync } = await import('child_process');
    const out = execFileSync('node', [script, `--clientId=${clientId}`, `--vehicleId=${vehicleId}`, '--status=active', `--templateId=${template?.id}`, `--outputDir=${outputDir}`], {
      encoding: 'utf8',
    });
    const m = out.match(/"pdfPath"\s*:\s*"([^"]+)"/);
    pdfPath = m?.[1] ?? null;
  } catch (e) {
    log('pdf generation skipped', String(e?.message ?? e));
  }
  if (pdfPath) {
    const st = await fs.stat(pdfPath);
    log('pdf generated', { pdfPath, sizeBytes: st.size });
    assert(st.size > 0, 'pdf file empty');
  }

  // 9) Cleanup (best-effort) - keep DB tidy
  try {
    await jsonFetch(`${baseApi}/api/contracts/${encodeURIComponent(contractId)}`, { method: 'DELETE' });
  } catch {
    // API doesn't have contract DELETE; ignore
  }
  await jsonFetch(`${baseApi}/api/vehicles/${encodeURIComponent(vehicleId)}`, { method: 'DELETE' });
  await jsonFetch(`${baseApi}/api/clients/${encodeURIComponent(clientId)}`, { method: 'DELETE' });
  log('cleanup', { vehicle: vehicleId, client: clientId, contract: contractId });

  console.log(JSON.stringify({ runId, ok: true, results }, null, 2));
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: String(e?.message ?? e) }, null, 2));
  process.exit(1);
});

