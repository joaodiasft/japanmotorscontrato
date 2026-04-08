import type {
  Client,
  Contract,
  ContractTemplate,
  SystemSettings,
  User,
  Vehicle,
} from '../src/types';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __seedDir = dirname(fileURLToPath(import.meta.url));

function loadContratoVendaTemplateHtml(): string {
  const cwdServer = join(process.cwd(), 'server', 'contrato-venda-template.html');
  const beside = join(__seedDir, 'contrato-venda-template.html');
  for (const p of [beside, cwdServer]) {
    try {
      return readFileSync(p, 'utf8');
    } catch {
      /* tenta próximo path (dev tsx vs Vercel bundle) */
    }
  }
  throw new Error(
    `contrato-venda-template.html não encontrado. Tentado: ${beside}, ${cwdServer}`,
  );
}

const defaultTemplate: ContractTemplate = {
  id: 'default',
  name: 'Contrato Padrão de Compra e Venda',
  content: `<div style="text-align: center; font-weight: bold; font-size: 18px; margin-bottom: 20px;">CONTRATO PARTICULAR DE COMPRA E VENDA DE VEÍCULO AUTOMOTOR</div>

<p>Pelo presente instrumento particular, de um lado:</p>

<p><strong>VENDEDOR:</strong><br>
{{companyName}}, empresa do ramo de comércio de veículos automotores, inscrita sob CNPJ nº {{companyCnpj}}, com sede em {{companyAddress}}, neste ato representada por seu responsável legal.</p>

<p>E, de outro lado:</p>

<p><strong>COMPRADOR:</strong><br>
Nome: {{clientName}}<br>
CPF: {{clientCpf}}<br>
RG: {{clientRg}}<br>
Endereço: {{clientAddress}}<br>
Telefone: {{clientPhone}}<br>
E-mail: {{clientEmail}}</p>

<p>Têm entre si, justo e contratado, o presente contrato de compra e venda de veículo automotor, que se regerá pelas cláusulas e condições abaixo:</p>

<p><strong>CLÁUSULA 1 – DO OBJETO</strong></p>
<p>O presente contrato tem como objeto a venda do seguinte veículo:</p>
<p>
  Marca/Modelo: {{vehicleBrand}} {{vehicleModel}}<br>
  Ano/Modelo: {{vehicleYear}}<br>
  Cor: {{vehicleColor}}<br>
  Placa: {{vehiclePlate}}<br>
  Chassi: {{vehicleVin}}<br>
  Renavam: {{vehicleRenavam}}
</p>

<p><strong>CLÁUSULA 2 – DO VALOR E CONDIÇÕES DE PAGAMENTO</strong></p>
<p>
  O valor total da venda é de:<br>
  <strong>R$ {{totalValue}} ({{totalValueWords}})</strong>
</p>

<p>
  Entrada: <strong>R$ {{downPayment}}</strong><br>
  Saldo: <strong>R$ {{balance}}</strong><br>
  Condições pactuadas (plano de pagamento): {{paymentMethod}}
</p>

<p><strong>CLÁUSULA 3 – DAS CONDIÇÕES DO VEÍCULO</strong></p>
<p>
  O comprador declara que recebeu o veículo nas condições em que se encontra, tendo realizado vistoria prévia, estando ciente de seu estado geral de conservação.
</p>

<p><strong>CLÁUSULA 4 – DA TRANSFERÊNCIA</strong></p>
<p>
  O comprador se compromete a realizar a transferência do veículo no prazo legal de 30 (trinta) dias, responsabilizando-se por quaisquer multas, encargos ou penalidades decorrentes após a assinatura deste contrato.
</p>

<p><strong>CLÁUSULA 5 – RESPONSABILIDADES</strong></p>
<p>
  Após a assinatura deste contrato, todas as responsabilidades civis e criminais passam a ser do comprador. O vendedor não se responsabiliza por infrações ou eventos posteriores à entrega do veículo.
</p>

<p><strong>CLÁUSULA 6 – IRREVOGABILIDADE</strong></p>
<p>
  Este contrato é firmado em caráter irrevogável e irretratável, obrigando as partes e seus sucessores.
</p>

<p><strong>CLÁUSULA 7 – DO FORO</strong></p>
<p>Fica eleito o foro da comarca de {{city}} para dirimir quaisquer dúvidas oriundas deste contrato.</p>

<p style="margin-top: 40px;"><strong>ASSINATURAS</strong></p>
<p>Cidade: {{city}}<br>Data: {{date}}</p>

<div style="margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
  <div style="border-top: 1px solid black; padding-top: 10px; text-align: center;">
    {{companyName}}<br>VENDEDOR
  </div>
  <div style="border-top: 1px solid black; padding-top: 10px; text-align: center;">
    {{clientName}}<br>COMPRADOR
  </div>
</div>

<div style="margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
  <div style="border-top: 1px solid black; padding-top: 10px; text-align: center;">
    TESTEMUNHA 1<br>CPF: ________________
  </div>
  <div style="border-top: 1px solid black; padding-top: 10px; text-align: center;">
    TESTEMUNHA 2<br>CPF: ________________
  </div>
</div>`,
};

const deliveryReceiptTemplate: ContractTemplate = {
  id: 'receipt',
  name: 'Recibo de Entrega de Veículo',
  content: `<div style="text-align: center; font-weight: bold; font-size: 18px; margin-bottom: 20px;">RECIBO DE ENTREGA E TERMO DE RESPONSABILIDADE</div>

<p>
  Eu, <strong>{{clientName}}</strong>, inscrito(a) no CPF sob nº <strong>{{clientCpf}}</strong>, declaro para os devidos fins que recebi nesta data da empresa <strong>{{companyName}}</strong> o veículo abaixo descrito.
</p>

<p style="margin-top: 16px;"><strong>DADOS DO VEÍCULO</strong></p>
<div style="background: #f8f9fa; padding: 16px; border-radius: 10px; border: 1px solid #e5e7eb;">
  <p>Marca/Modelo: {{vehicleBrand}} {{vehicleModel}}</p>
  <p>Ano/Modelo: {{vehicleYear}}</p>
  <p>Cor: {{vehicleColor}}</p>
  <p>Placa: {{vehiclePlate}}</p>
  <p>Chassi: {{vehicleVin}}</p>
  <p>Renavam: {{vehicleRenavam}}</p>
</div>

<p style="margin-top: 16px;"><strong>DECLARAÇÕES</strong></p>
<ol>
  <li>Recebi o veículo em condições de uso, conservação e limpeza, bem como os acessórios descritos no ato da entrega.</li>
  <li>Recebi a documentação do veículo e estou ciente das condições gerais do bem.</li>
  <li>
    A partir desta data e hora (<strong>{{date}}</strong>), assumo a responsabilidade civil, criminal e administrativa por quaisquer infrações de trânsito, acidentes ou danos causados a terceiros envolvendo o veículo.
  </li>
  <li>
    Comprometo-me a efetuar a transferência de propriedade perante o órgão de trânsito no prazo máximo de 30 (trinta) dias.
  </li>
</ol>

<p style="margin-top: 40px;">{{city}}, {{date}}</p>

<div style="margin-top: 80px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
  <div style="border-top: 1px solid black; padding-top: 10px; text-align: center;">
    {{companyName}}<br>VENDEDOR(A)
  </div>
  <div style="border-top: 1px solid black; padding-top: 10px; text-align: center;">
    {{clientName}}<br>COMPRADOR(A)
  </div>
</div>

<div style="margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
  <div style="border-top: 1px solid black; padding-top: 10px; text-align: center;">
    TESTEMUNHA 1<br>CPF: ________________
  </div>
  <div style="border-top: 1px solid black; padding-top: 10px; text-align: center;">
    TESTEMUNHA 2<br>CPF: ________________
  </div>
</div>`,
};

const warrantyTemplate: ContractTemplate = {
  id: 'warranty',
  name: 'Termo de Garantia de Veículo Usado',
  content: `<div style="text-align: center; font-weight: bold; font-size: 18px; margin-bottom: 20px;">TERMO DE GARANTIA DE VEÍCULO USADO</div>

<p>
  A empresa <strong>{{companyName}}</strong> concede ao comprador <strong>{{clientName}}</strong> garantia para o veículo <strong>{{vehicleBrand}} {{vehicleModel}}</strong>, placa <strong>{{vehiclePlate}}</strong>, nos seguintes termos:
</p>

<p><strong>CLÁUSULA 1 – PRAZO</strong></p>
<p>
  A garantia é de <strong>{{warrantyDays}} dias</strong>, a contar da data de entrega do veículo (<strong>{{date}}</strong>), cobrindo exclusivamente <strong>MOTOR E CÂMBIO</strong> (partes internas lubrificadas).
</p>

<p><strong>CLÁUSULA 2 – ITENS EXCLUÍDOS</strong></p>
<p>
  Não estão cobertos pela garantia itens de desgaste natural e/ou de manutenção preventiva, tais como: pneus, bateria, suspensão, freios, embreagem, lâmpadas, estofamento, pintura, vidros e acessórios elétricos.
</p>

<p><strong>CLÁUSULA 3 – PERDA DA GARANTIA</strong></p>
<ul style="margin-top: 8px;">
  <li>Realizar reparos ou abrir motor/câmbio em oficinas não autorizadas pelo vendedor.</li>
  <li>Utilizar o veículo de forma inadequada (competições, sobrecarga, etc.).</li>
  <li>Deixar de realizar manutenção preventiva (troca de óleo, filtros, etc.).</li>
</ul>

<p><strong>CLÁUSULA 4 – PROCEDIMENTO EM CASO DE DEFEITO</strong></p>
<p>
  Em caso de qualquer irregularidade no motor ou câmbio, o comprador deverá comunicar imediatamente o vendedor antes de qualquer providência.
</p>

<p style="margin-top: 40px;">{{city}}, {{date}}</p>

<div style="margin-top: 80px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
  <div style="border-top: 1px solid black; padding-top: 10px; text-align: center;">
    {{companyName}}<br>VENDEDOR(A)
  </div>
  <div style="border-top: 1px solid black; padding-top: 10px; text-align: center;">
    {{clientName}}<br>COMPRADOR(A)
  </div>
</div>

<div style="margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
  <div style="border-top: 1px solid black; padding-top: 10px; text-align: center;">
    TESTEMUNHA 1<br>CPF: ________________
  </div>
  <div style="border-top: 1px solid black; padding-top: 10px; text-align: center;">
    TESTEMUNHA 2<br>CPF: ________________
  </div>
</div>`,
};

const financingAgreementTemplate: ContractTemplate = {
  id: 'financing',
  name: 'Acordo de Financiamento de Veículo',
  content: `<div style="text-align: center; font-weight: bold; font-size: 18px; margin-bottom: 20px;">ACORDO DE FINANCIAMENTO DE VEÍCULO</div>

<p>Pelo presente instrumento particular, de um lado:</p>
<p><strong>VENDEDOR:</strong><br>{{companyName}}, inscrita sob CNPJ nº {{companyCnpj}}, com sede em {{companyAddress}}.</p>

<p>E, de outro lado:</p>
<p><strong>COMPRADOR:</strong><br>
{{clientName}}<br>
CPF: {{clientCpf}}<br>
RG: {{clientRg}}<br>
Endereço: {{clientAddress}}<br>
Telefone: {{clientPhone}}<br>
E-mail: {{clientEmail}}
</p>

<p style="margin-top: 12px;">
  As partes acima qualificadas ajustam o presente acordo de financiamento referente à aquisição do veículo descrito abaixo, mediante as condições expostas nas cláusulas seguintes.
</p>

<p><strong>CLÁUSULA 1 – OBJETO</strong></p>
<p>
  O presente acordo tem por objeto disciplinar as condições de pagamento do veículo: {{vehicleBrand}} {{vehicleModel}}, ano/modelo {{vehicleYear}}, cor {{vehicleColor}}, placa {{vehiclePlate}}, chassi {{vehicleVin}} e renavam {{vehicleRenavam}}.
</p>

<p><strong>CLÁUSULA 2 – VALOR E ENTRADA</strong></p>
<p>
  Valor total: <strong>R$ {{totalValue}} ({{totalValueWords}})</strong>.<br>
  Entrada: <strong>R$ {{downPayment}}</strong>.
</p>

<p><strong>CLÁUSULA 3 – SALDO FINANCIADO E CONDIÇÕES</strong></p>
<p>
  Saldo a financiar: <strong>R$ {{balance}}</strong>.<br>
  As condições pactuadas (prazo, número de parcelas e demais ajustes) estão descritas em: <strong>{{paymentMethod}}</strong>.
</p>

<p><strong>CLÁUSULA 4 – OBRIGAÇÕES DO COMPRADOR</strong></p>
<p>
  O comprador compromete-se a efetuar o pagamento do saldo financiado conforme o plano informado em {{paymentMethod}}, responsabilizando-se por eventuais encargos decorrentes de atraso.
</p>

<p><strong>CLÁUSULA 5 – DISPOSIÇÕES GERAIS</strong></p>
<p>
  As partes declaram compreender e aceitar as condições ora estabelecidas, firmando o presente termo para produzir seus efeitos legais.
</p>

<p><strong>CLÁUSULA 6 – FORO</strong></p>
<p>Fica eleito o foro da comarca de {{city}} para dirimir quaisquer dúvidas.</p>

<p style="margin-top: 40px;">{{city}}, {{date}}</p>

<div style="margin-top: 80px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
  <div style="border-top: 1px solid black; padding-top: 10px; text-align: center;">
    {{companyName}}<br>VENDEDOR(A)
  </div>
  <div style="border-top: 1px solid black; padding-top: 10px; text-align: center;">
    {{clientName}}<br>COMPRADOR(A)
  </div>
</div>

<div style="margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
  <div style="border-top: 1px solid black; padding-top: 10px; text-align: center;">
    TESTEMUNHA 1<br>CPF: ________________
  </div>
  <div style="border-top: 1px solid black; padding-top: 10px; text-align: center;">
    TESTEMUNHA 2<br>CPF: ________________
  </div>
</div>`,
};

const saleReceiptTemplate: ContractTemplate = {
  id: 'sale-receipt',
  name: 'Recibo de Venda de Veículo',
  content: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; border: 1px solid #eee; padding: 30px; border-radius: 8px;">
  <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 10px;">
    <h1 style="margin: 0; font-size: 24px; text-transform: uppercase; color: #000;">Recibo de Venda</h1>
    <p style="margin: 5px 0; color: #666;">Comprovante de Pagamento e Quitação</p>
  </div>

  <p style="text-align: justify; margin-bottom: 20px;">
    Recebemos de <strong>{{clientName}}</strong>, inscrito(a) no CPF sob nº <strong>{{clientCpf}}</strong>, a importância de <strong>{{totalValue}}</strong> ({{totalValueWords}}), referente à venda e quitação total do veículo abaixo descrito:
  </p>

  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #e9ecef;">
    <h3 style="margin-top: 0; font-size: 16px; border-bottom: 1px solid #dee2e6; padding-bottom: 10px; margin-bottom: 15px; color: #000;">Dados do Veículo</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
      <p style="margin: 0;"><strong>Marca/Modelo:</strong> {{vehicleBrand}} {{vehicleModel}}</p>
      <p style="margin: 0;"><strong>Ano:</strong> {{vehicleYear}}</p>
      <p style="margin: 0;"><strong>Placa:</strong> {{vehiclePlate}}</p>
      <p style="margin: 0;"><strong>Chassi:</strong> {{vehicleVin}}</p>
    </div>
  </div>

  <p style="text-align: justify; margin-bottom: 30px;">
    Pelo que firmamos o presente recibo para que produza seus efeitos legais, dando plena e geral quitação do valor recebido.
  </p>

  <p style="text-align: right; margin-top: 40px; font-weight: bold;">
    {{city}}, {{date}}.
  </p>

  <div style="margin-top: 80px; text-align: center;">
    <div style="display: inline-block; width: 350px; border-top: 1px solid #000; padding-top: 10px;">
      <p style="margin: 0; font-weight: bold; font-size: 16px;">{{companyName}}</p>
      <p style="margin: 0; font-size: 12px; color: #666;">CNPJ: {{companyCnpj}}</p>
      <p style="margin: 0; font-size: 12px; color: #666;">VENDEDORA</p>
    </div>
  </div>
</div>`,
};

const modernSaleContractTemplate: ContractTemplate = {
  id: 'modern-sale',
  name: 'Contrato de Compra e Venda (Moderno)',
  content: `<div style="font-family: 'Inter', sans-serif; color: #1a1a1a; max-width: 800px; margin: 0 auto; padding: 40px; background: #fff;">
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px;">
    <div>
      <h1 style="font-size: 24px; font-weight: 800; margin: 0; color: #111827; text-transform: uppercase; letter-spacing: -0.025em;">Contrato de Compra e Venda</h1>
      <p style="font-size: 14px; color: #6b7280; margin: 4px 0 0 0;">Instrumento Particular de Transação de Veículo</p>
    </div>
    <div style="text-align: right;">
      <p style="font-size: 12px; font-weight: 600; color: #374151; margin: 0;">{{companyName}}</p>
      <p style="font-size: 11px; color: #9ca3af; margin: 0;">CNPJ: {{companyCnpj}}</p>
    </div>
  </div>

  <div style="margin-bottom: 30px;">
    <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; color: #374151; border-left: 4px solid #4b5563; padding-left: 12px; margin-bottom: 16px;">1. Partes Contratantes</h2>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; font-size: 13px; line-height: 1.5;">
      <div style="background: #f9fafb; padding: 16px; border-radius: 8px;">
        <p style="font-weight: 700; color: #111827; margin-bottom: 8px; text-transform: uppercase; font-size: 11px;">Vendedor</p>
        <p><strong>{{companyName}}</strong></p>
        <p>CNPJ: {{companyCnpj}}</p>
        <p>{{companyAddress}}</p>
      </div>
      <div style="background: #f9fafb; padding: 16px; border-radius: 8px;">
        <p style="font-weight: 700; color: #111827; margin-bottom: 8px; text-transform: uppercase; font-size: 11px;">Comprador</p>
        <p><strong>{{clientName}}</strong></p>
        <p>CPF: {{clientCpf}}</p>
        <p>{{clientAddress}}</p>
      </div>
    </div>
  </div>

  <div style="margin-bottom: 30px;">
    <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; color: #374151; border-left: 4px solid #4b5563; padding-left: 12px; margin-bottom: 16px;">2. Objeto do Contrato</h2>
    <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #e5e7eb;">
        <div style="background: #fff; padding: 12px;">
          <p style="font-size: 10px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Marca/Modelo</p>
          <p style="font-size: 13px; font-weight: 600;">{{vehicleBrand}} {{vehicleModel}}</p>
        </div>
        <div style="background: #fff; padding: 12px;">
          <p style="font-size: 10px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Ano/Modelo</p>
          <p style="font-size: 13px; font-weight: 600;">{{vehicleYear}}</p>
        </div>
        <div style="background: #fff; padding: 12px;">
          <p style="font-size: 10px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Placa</p>
          <p style="font-size: 13px; font-weight: 600;">{{vehiclePlate}}</p>
        </div>
        <div style="background: #fff; padding: 12px;">
          <p style="font-size: 10px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Cor</p>
          <p style="font-size: 13px; font-weight: 600;">{{vehicleColor}}</p>
        </div>
        <div style="background: #fff; padding: 12px;">
          <p style="font-size: 10px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Chassi</p>
          <p style="font-size: 13px; font-weight: 600;">{{vehicleVin}}</p>
        </div>
        <div style="background: #fff; padding: 12px;">
          <p style="font-size: 10px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Renavam</p>
          <p style="font-size: 13px; font-weight: 600;">{{vehicleRenavam}}</p>
        </div>
      </div>
    </div>
  </div>

  <div style="margin-bottom: 30px;">
    <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; color: #374151; border-left: 4px solid #4b5563; padding-left: 12px; margin-bottom: 16px;">3. Condições Comerciais</h2>
    <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 14px; color: #374151;">Valor Total da Transação</span>
        <span style="font-size: 20px; font-weight: 800; color: #111827;">{{totalValue}}</span>
      </div>
      <p style="font-size: 12px; color: #4b5563; margin-bottom: 16px;">({{totalValueWords}})</p>
      <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 13px;">
        <p style="margin-bottom: 8px;"><strong>Forma de Pagamento:</strong> {{paymentMethod}}</p>
        <p><strong>Entrada:</strong> {{downPayment}}</p>
      </div>
    </div>
  </div>

  <div style="margin-bottom: 40px; font-size: 12px; line-height: 1.6; color: #4b5563; text-align: justify;">
    <p style="margin-bottom: 12px;"><strong>CLÁUSULA 4ª:</strong> O COMPRADOR declara ter vistoriado o veículo e aceitá-lo no estado em que se encontra, isentando o VENDEDOR de vícios aparentes.</p>
    <p style="margin-bottom: 12px;"><strong>CLÁUSULA 5ª:</strong> A transferência de propriedade deve ocorrer em até 30 dias. Multas e encargos após esta data são de inteira responsabilidade do COMPRADOR.</p>
    <p><strong>CLÁUSULA 6ª:</strong> Este contrato é irrevogável e obriga as partes e seus sucessores ao fiel cumprimento de todas as cláusulas aqui estabelecidas.</p>
  </div>

  <div style="text-align: center; margin-bottom: 60px;">
    <p style="font-size: 13px; color: #6b7280;">{{city}}, {{date}}</p>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; text-align: center;">
    <div>
      <div style="border-top: 1px solid #111827; padding-top: 8px;">
        <p style="font-size: 13px; font-weight: 700; margin: 0;">{{companyName}}</p>
        <p style="font-size: 11px; color: #6b7280; margin: 0;">Vendedor</p>
      </div>
    </div>
    <div>
      <div style="border-top: 1px solid #111827; padding-top: 8px;">
        <p style="font-size: 13px; font-weight: 700; margin: 0;">{{clientName}}</p>
        <p style="font-size: 11px; color: #6b7280; margin: 0;">Comprador</p>
      </div>
    </div>
  </div>
</div>`,
};

/** Contrato multipágina (4 folhas): contrato-venda-template.html; logo /public/logo-contrato.png */
const juniorVeiculosSaleContractTemplate: ContractTemplate = {
  id: 'junior-veiculos-venda',
  name: 'Contrato de Venda',
  content: loadContratoVendaTemplateHtml(),
};

export function getDefaultSystemSettings(): SystemSettings {
  return {
    companyName: 'Japan Motors',
    cnpj: '00.000.000/0001-00',
    address:
      'Av. Contorno, QD35 - LT 39 - Jardim Colorado, Goiânia - GO, 74474-048',
    phone: 'Instagram @japanmotors_go',
    email: 'contato@japanmotors.com.br',
    contractTemplates: [
      juniorVeiculosSaleContractTemplate,
      defaultTemplate,
      deliveryReceiptTemplate,
      warrantyTemplate,
      financingAgreementTemplate,
      saleReceiptTemplate,
      modernSaleContractTemplate,
    ],
  };
}

export const seedVehicles: Vehicle[] = [
  {
    id: '1',
    type: 'car',
    brand: 'Chevrolet',
    model: 'Onix LT2 1.0',
    year: 2023,
    color: 'Prata',
    plate: 'JPN-1A23',
    vin: '9BGKN69A0PB123456',
    renavam: '12345678901',
    mileage: 28000,
    fuel: 'Flex',
    acquisitionPrice: 58000,
    salePrice: 66900,
    status: 'available',
    images: ['https://picsum.photos/seed/onix2023/800/600'],
    inspectionNotes: `CHEVROLET ONIX LT2 1.0 2022/23 — Completo | Econômico | Moderno | Muito novo.
Se você procura um carro bonito, confortável, econômico e tecnológico, esse Onix LT2 1.0 2023 é a escolha certa.
Versão completa, motor 1.0 super econômico, câmera de ré, start/stop, multimídia, direção elétrica, ar-condicionado, vidros/travas/retrovisores elétricos. Excelente para cidade e viagem. Design moderno, ótimo espaço interno, confortável, qualidade Chevrolet.`,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'motorcycle',
    brand: 'Suzuki',
    model: 'GSX-R 750',
    year: 2008,
    color: 'Azul',
    plate: 'JPN-2B34',
    vin: 'JS1GR7MA082345678',
    renavam: '10987654321',
    mileage: 18500,
    fuel: 'Gasolina',
    acquisitionPrice: 30000,
    salePrice: 36900,
    status: 'available',
    images: ['https://picsum.photos/seed/gsxr750/800/600'],
    inspectionNotes: `SUZUKI GSX-R 750 2008 — Bruta de verdade. Moto icônica, potência, velocidade e presença. Cor azul clássica e chamativa.`,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'car',
    brand: 'Volkswagen',
    model: 'Gol 1.0',
    year: 2013,
    color: 'Preto',
    plate: 'JPN-3C45',
    vin: '9BWZZZ377DT123456',
    renavam: '11223344556',
    mileage: 95000,
    fuel: 'Flex',
    acquisitionPrice: 28000,
    salePrice: 34900,
    status: 'available',
    images: ['https://picsum.photos/seed/gol2013/800/600'],
    inspectionNotes: `Volkswagen Gol 1.0 2013 Completo — Econômico e muito conservado. Preto, bem cuidado; ideal para economia, confiabilidade e baixo custo de manutenção. Motor 1.0 econômico.`,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    type: 'motorcycle',
    brand: 'Honda',
    model: 'Biz 125',
    year: 2023,
    color: 'Branca',
    plate: 'JPN-4D56',
    vin: '9C2KC0810PR123456',
    renavam: '55443322110',
    mileage: 1900,
    fuel: 'Gasolina',
    acquisitionPrice: 14500,
    salePrice: 17900,
    status: 'available',
    images: ['https://picsum.photos/seed/biz125/800/600'],
    inspectionNotes: `Honda Biz 125 2023 — Branca. Impecável, apenas 1.900 km rodados; praticamente zero km.`,
    createdAt: new Date().toISOString(),
  },
];

export const seedClients: Client[] = [
  {
    id: '1',
    name: 'Marcos Henrique Alves',
    status: 'active',
    birthDate: '1988-03-12',
    cpf: '701.234.567-89',
    rg: '12.345.678-9',
    email: 'marcos.alves@email.com',
    phone: '(62) 98123-4567',
    whatsapp: '(62) 98123-4567',
    address: {
      zipCode: '74474-048',
      street: 'Rua das Palmeiras',
      number: '120',
      neighborhood: 'Jardim Colorado',
      city: 'Goiânia',
      state: 'GO',
    },
    notes: 'Cliente Japan Motors — região Jardim Colorado.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Fernanda Costa Lima',
    status: 'vip',
    birthDate: '1995-11-28',
    cpf: '529.876.543-21',
    rg: '45.678.901-2',
    email: 'fernanda.costa@email.com',
    phone: '(62) 99234-5678',
    whatsapp: '(62) 99234-5678',
    address: {
      zipCode: '74000-000',
      street: 'Av. T-4',
      number: '500',
      neighborhood: 'Setor Bueno',
      city: 'Goiânia',
      state: 'GO',
    },
    notes: 'Preferência por motos e carros populares.',
    createdAt: new Date().toISOString(),
  },
];

export const seedContracts: Contract[] = [
  {
    id: 'CTR-001',
    type: 'sale',
    clientId: '1',
    clientName: 'Marcos Henrique Alves',
    vehicleId: '1',
    vehicleName: 'Chevrolet Onix LT2 1.0',
    date: new Date().toISOString(),
    totalValue: 66900,
    downPayment: 20000,
    balance: 46900,
    paymentMethod: 'Financiamento em 48x (simulação)',
    warrantyDays: 90,
    clauses: [],
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

export const seedUsers: User[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@japanmotors.com.br',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
];
