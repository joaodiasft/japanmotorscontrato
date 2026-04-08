import type {
  Client,
  Contract,
  ContractTemplate,
  SystemSettings,
  User,
  Vehicle,
} from '../src/types';

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
    <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; color: #374151; border-left: 4px solid #ef4444; padding-left: 12px; margin-bottom: 16px;">1. Partes Contratantes</h2>
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
    <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; color: #374151; border-left: 4px solid #ef4444; padding-left: 12px; margin-bottom: 16px;">2. Objeto do Contrato</h2>
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
    <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; color: #374151; border-left: 4px solid #ef4444; padding-left: 12px; margin-bottom: 16px;">3. Condições Comerciais</h2>
    <div style="background: #fef2f2; border: 1px solid #fee2e2; padding: 20px; border-radius: 8px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 14px; color: #991b1b;">Valor Total da Transação</span>
        <span style="font-size: 20px; font-weight: 800; color: #991b1b;">{{totalValue}}</span>
      </div>
      <p style="font-size: 12px; color: #b91c1c; margin-bottom: 16px;">({{totalValueWords}})</p>
      <div style="border-top: 1px solid #fecaca; padding-top: 16px; font-size: 13px;">
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

/** Modelo espelhado no contrato impresso (cabeçalho, seções A–D, cláusulas, garantia, disposições finais e assinaturas). */
const juniorVeiculosSaleContractTemplate: ContractTemplate = {
  id: 'junior-veiculos-venda',
  name: 'Contrato de Venda (modelo loja — JV)',
  content: `<div class="contract-jv-root" style="font-family: Arial, Helvetica, sans-serif; color: #111; font-size: 11pt; line-height: 1.45; max-width: 720px; margin: 0 auto;">
  <header style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 20px; border-bottom: 2px solid #c41e3a; padding-bottom: 12px; print-color-adjust: exact; -webkit-print-color-adjust: exact;">
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="width: 48px; height: 48px; border: 2px solid #c41e3a; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; color: #c41e3a; font-family: 'Courier New', monospace;">JV</div>
      <div>
        <div style="font-size: 18px; font-weight: 800; color: #c41e3a; letter-spacing: 0.02em; text-transform: uppercase;">{{companyName}}</div>
        <div style="font-size: 10px; color: #333; margin-top: 2px;">Comércio de Veículos</div>
      </div>
    </div>
    <div style="text-align: right; font-size: 9.5pt; line-height: 1.35;">
      <div>{{companyAddress}}</div>
      <div>CNPJ: {{companyCnpj}}</div>
      <div>Tel.: {{companyPhone}}</div>
    </div>
  </header>

  <h1 style="text-align: center; font-size: 15pt; font-weight: bold; margin: 0 0 18px 0; letter-spacing: 0.06em;">CONTRATO DE VENDA</h1>

  <p style="margin: 0 0 10px 0;"><strong>A. VENDEDORA</strong></p>
  <table class="jv-field-table" style="width: 100%; border-collapse: collapse; font-size: 10.5pt; margin-bottom: 16px; font-family: 'Courier New', Courier, monospace;">
    <tr><td style="vertical-align: top; width: 140px; padding: 4px 0;">Razão social</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{companyName}}, pessoa jurídica de direito privado</td></tr>
    <tr><td style="padding: 4px 0;">CNPJ</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{companyCnpj}}</td></tr>
    <tr><td style="padding: 4px 0;">Endereço</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{companyAddress}}</td></tr>
    <tr><td style="padding: 4px 0;">Telefone</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{companyPhone}}</td></tr>
  </table>

  <p style="margin: 0 0 10px 0;"><strong>B. COMPRADOR</strong></p>
  <table class="jv-field-table" style="width: 100%; border-collapse: collapse; font-size: 10.5pt; margin-bottom: 16px; font-family: 'Courier New', Courier, monospace;">
    <tr><td style="width: 140px; padding: 4px 0;">Nome</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{clientName}}</td></tr>
    <tr><td style="padding: 4px 0;">Telefone(s)</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{clientPhone}}</td></tr>
    <tr><td style="padding: 4px 0;">Endereço</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{clientStreetLine}}</td></tr>
    <tr><td style="padding: 4px 0;">Bairro</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{clientNeighborhood}}</td></tr>
    <tr><td style="padding: 4px 0;">Cidade - UF</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{clientCityState}}</td></tr>
    <tr><td style="padding: 4px 0;">CEP</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{clientZipCode}}</td></tr>
    <tr><td style="padding: 4px 0;">Identidade</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{clientRg}}</td></tr>
    <tr><td style="padding: 4px 0;">CPF</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{clientCpf}}</td></tr>
  </table>

  <p style="margin: 0 0 10px 0;"><strong>C. OBJETO DO CONTRATO</strong> <span style="font-weight: normal;">(veículo usado)</span></p>
  <table class="jv-field-table" style="width: 100%; border-collapse: collapse; font-size: 10.5pt; margin-bottom: 16px; font-family: 'Courier New', Courier, monospace;">
    <tr><td style="width: 140px; padding: 4px 0;">Veículo</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{vehicleBrand}} {{vehicleModel}}</td></tr>
    <tr><td style="padding: 4px 0;">Cor</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{vehicleColor}}</td></tr>
    <tr><td style="padding: 4px 0;">Combustível</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{vehicleFuel}}</td></tr>
    <tr><td style="padding: 4px 0;">Placa</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{vehiclePlate}}</td></tr>
    <tr><td style="padding: 4px 0;">Chassi</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{vehicleVin}}</td></tr>
    <tr><td style="padding: 4px 0;">Renavam</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{vehicleRenavam}}</td></tr>
    <tr><td style="padding: 4px 0;">Ano Fab. / Mod.</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{vehicleYearFabMod}}</td></tr>
    <tr><td style="padding: 4px 0;">Quilometragem</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{vehicleMileage}} km</td></tr>
    <tr><td style="padding: 4px 0;">Data da venda</td><td style="padding: 4px 0; border-bottom: 1px dotted #333;">{{saleDateShort}}</td></tr>
  </table>

  <p style="margin: 0 0 10px 0;"><strong>D. PREÇO E CONDIÇÕES DE VENDA</strong></p>
  <table class="jv-field-table" style="width: 100%; border-collapse: collapse; font-size: 10.5pt; border: 1px solid #333; margin-bottom: 16px; font-family: 'Courier New', Courier, monospace;">
    <thead>
      <tr style="background: #f3f3f3;">
        <th style="border: 1px solid #333; padding: 6px; text-align: left;">Tipo pagamento</th>
        <th style="border: 1px solid #333; padding: 6px; text-align: right; width: 110px;">Valor R$</th>
        <th style="border: 1px solid #333; padding: 6px; text-align: left;">Histórico / detalhes</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #333; padding: 6px;">DINHEIRO</td>
        <td style="border: 1px solid #333; padding: 6px; text-align: right;">{{cashValue}}</td>
        <td style="border: 1px solid #333; padding: 6px;">—</td>
      </tr>
      <tr>
        <td style="border: 1px solid #333; padding: 6px;">FINANCIAMENTO</td>
        <td style="border: 1px solid #333; padding: 6px; text-align: right;">{{financingValue}}</td>
        <td style="border: 1px solid #333; padding: 6px; font-size: 9.5pt;">{{paymentMethod}}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #333; padding: 6px; font-weight: bold;">TOTAL</td>
        <td style="border: 1px solid #333; padding: 6px; text-align: right; font-weight: bold;">{{totalValue}}</td>
        <td style="border: 1px solid #333; padding: 6px;">Ref.: {{totalValueWords}}</td>
      </tr>
    </tbody>
  </table>

  <div style="font-size: 10.5pt; text-align: justify;">
    <p><strong>1.</strong> Na hipótese de o COMPRADOR utilizar veículo de menor valor nas partes pagas do negócio (troca), declara sob as penas da lei ser o único e exclusivo responsável por qualquer questão de natureza civil ou criminal relacionada àquele bem, isentando a VENDEDORA.</p>
    <p><strong>2.</strong> O COMPRADOR declara ter vistoriado o veículo, aceitando-o no estado em que se encontra (<em>ad corpus</em>), sem garantia de vícios ocultos quanto à mecânica geral, elétrica, lataria e pintura, exceto quanto à garantia legal/contratual expressamente indicada neste instrumento. A VENDEDORA não se responsabiliza por eventual evidência de descompasso do hodômetro em relação à quilometragem real, quando referente a proprietários anteriores.</p>
    <p><strong>3.</strong> Taxa de transferência combinada: <strong>R$ 1.500,00</strong> (mil e quinhentos reais). Na hipótese de financiamento, poderá haver cobrança de T.A.C. (taxa de abertura de crédito) no valor aproximado de <strong>R$ 2.000,00</strong> (dois mil reais), conforme instituição financeira e proposta aprovada.</p>
    <p style="margin-bottom: 6px;"><strong>* DAS CONDIÇÕES DA GARANTIA</strong> — Nos termos a seguir (prazo de <strong>{{warrantyDays}} dias</strong> a contar da entrega, quando aplicável ao modelo adotado pela loja).</p>
  </div>

  <div class="jv-page-break" style="break-after: page; page-break-after: always;"></div>

  <header style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 16px;">
    <div style="font-weight: 800; color: #c41e3a; text-transform: uppercase; font-size: 12pt;">{{companyName}}</div>
    <div style="text-align: right; font-size: 9.5pt;">
      <div>{{companyAddress}}</div>
      <div>CNPJ: {{companyCnpj}}</div>
    </div>
  </header>

  <h2 style="font-size: 12pt; text-align: center; margin: 0 0 14px 0;">GARANTIA</h2>
  <div style="font-size: 10.5pt; text-align: justify;">
    <p>O COMPRADOR declara ciência de que a garantia concedida pela VENDEDORA é de <strong>{{warrantyDays}} dias</strong>, limitada exclusivamente a <strong>MOTOR e CAIXA DE CÂMBIO</strong>, nas condições abaixo:</p>
    <ul style="margin: 8px 0; padding-left: 20px;">
      <li>Cobre apenas defeitos de fabricação/ocultos desses conjuntos, não abrangendo desgaste natural de demais itens.</li>
      <li>Os reparos deverão ser realizados em oficina autorizada, com apresentação de orçamento prévio à VENDEDORA para aprovação.</li>
      <li>O prazo conta-se a partir da data de entrega do veículo.</li>
      <li>A VENDEDORA poderá conferir a quilometragem e apurar indícios de fraude ou mau uso.</li>
      <li>As peças substituídas em garantia poderão ficar retidas pela VENDEDORA.</li>
      <li>A substituição de motor ou câmbio somente será considerada quando a impossibilidade técnica de reparo for comprovada.</li>
    </ul>

    <p style="margin-top: 14px;"><strong>São condições indispensáveis e obrigatórias para efetivação da garantia:</strong></p>
    <ul style="margin: 8px 0; padding-left: 20px;">
      <li>Comunicação direta à VENDEDORA, na sede indicada neste contrato.</li>
      <li>Defeitos que não decorram de desgaste de componentes anteriores à data da venda, na forma da análise técnica.</li>
      <li>Inexistência de desuso prolongado, uso inadequado, acidentes ou caso fortuito/força maior como causa do defeito.</li>
      <li>Cumprimento das recomendações de uso e manutenção do manual do fabricante.</li>
    </ul>

    <p style="margin-top: 14px;"><strong>G.1 — DA NÃO COBERTURA DA GARANTIA</strong></p>
    <p>A partir da entrega do veículo, o COMPRADOR assume integralmente multas, tributos e responsabilidades de trânsito. Não integram a garantia, entre outros: anéis sincronizadores; discos e pastilhas de freio; velas e bobinas; kit de embreagem e volante do motor; bicos/injeção eletrônica; sensores; retentores e juntas; correias e rolamentos; bateria; alternador e motor de partida; bomba de combustível; elevadores de vidro; itens de suspensão (amortecedores, buchas, pivôs, terminais); direção; arrefecimento (radiador, mangueiras, válvula termostática); estofamento e acabamentos internos; fluidos, lubrificantes, filtros, lâmpadas, consumíveis e itens de borracha/plástico em geral; alarmes, conversões de gás, air bags, sistemas de multimídia/GPS, vazamentos diversos e ruídos não caracterizados como defeito de motor/câmbio.</p>
  </div>

  <div class="jv-page-break" style="break-after: page; page-break-after: always;"></div>

  <header style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 16px;">
    <div style="font-weight: 800; color: #c41e3a; text-transform: uppercase; font-size: 12pt;">{{companyName}}</div>
    <div style="text-align: right; font-size: 9.5pt;">
      <div>{{companyAddress}}</div>
      <div>CNPJ: {{companyCnpj}}</div>
    </div>
  </header>

  <div style="font-size: 10.5pt; text-align: justify;">
    <p><strong>G.2</strong> — A presente garantia se restringe ao veículo e suas peças de motor e caixa de câmbio, não cobrindo quaisquer outras repercussões, mesmo quando decorrentes de avaria ou defeitos no veículo, tais como: <strong>1.</strong> Despesas de transportes. <strong>2.</strong> Imobilização do veículo. <strong>3.</strong> Hospedagem. <strong>4.</strong> Socorro de guincho. <strong>5.</strong> Pelo decurso de validade. <strong>6.</strong> Quando forem executadas alterações ou modificações no veículo ou qualquer de seus componentes, por oficina mecânica diversa da indicada pela VENDEDORA. <strong>7.</strong> Quando ocorrer danos decorrentes de mau uso comprovado ou falta de manutenção adequada. <strong>8.</strong> Não há garantia de pintura. <strong>9.</strong> Para fins de comprovação o cliente declara ter vistoriado a pintura do veículo mencionado neste contrato, atestando que a mesma se encontra em boas condições, considerando-se a particularidade de não se tratar de veículo novo.</p>

    <p><strong>H</strong> — A título de penalidade contratual por arrependimento, fica pactuada uma multa de <strong>10% (dez por cento)</strong>, calculada sobre o valor do presente contrato, a qual será devida pela parte que der causa à sua rescisão, convertida em benefício da parte inocente, adquirindo esta, neste caso, eficácia de título executivo.</p>

    <p style="margin-top: 14px;"><strong>* DISPOSIÇÕES FINAIS</strong></p>
    <p><strong>1.</strong> Na hipótese do COMPRADOR depositar ou transferir quantia a título de sinal de negócio, fica a VENDEDORA obrigada a reservar o veículo objeto da negociação por apenas <strong>48 (quarenta e oito) horas</strong>, ou pelo prazo combinado com o VENDEDOR, e, uma vez frustrado o negócio pelo COMPRADOR — independentemente do motivo — o valor correspondente a <strong>100% (cem por cento)</strong> do sinal será retido pela VENDEDORA em caráter de compensação material.</p>
    <p><strong>2.</strong> Tratando-se de venda com entrega futura, o prazo acima ajustado poderá ser automaticamente prorrogado por até mais <strong>20 (vinte) dias úteis</strong> quando se verificar atraso por comprovada culpa de fornecedores ou por motivo de força maior não provocado pela VENDEDORA, incluindo casos fortuitos como greves em setor correlato, fenômenos naturais que comprometam o transporte regular do produto, sinistros de transporte e outros.</p>
    <p><strong>3.</strong> Verificando-se atraso na entrega do bem por culpa exclusiva do COMPRADOR, entendendo-se como tais motivos, entre outros: falta de pagamento do preço total ou parcial (quando financiado), nos termos da cláusula “D”, e falta de documentação de responsabilidade do COMPRADOR, sujeito às penalidades contratuais.</p>
    <p><strong>4.</strong> Na hipótese da venda ser realizada com prestações futuras ou permanecer compromisso financeiro residual representado por boleto, cheque, nota promissória ou instrumento equivalente, poderá a VENDEDORA, independentemente de notificação prévia, e ainda que já tenha sido realizada a transferência do veículo, <strong>REALIZAR COMUNICADO DE VENDA JUNTO AO DETRAN EM NOME DA VENDEDORA</strong>, persistindo todas as consequências de estilo até a quitação integral do débito pelo COMPRADOR.</p>

    <p style="margin-top: 14px;"><strong>M.1</strong> — Para demonstrar ciência quanto ao comunicado de venda referido acima e à exigência de troca do óleo do motor e filtro de óleo antes de completar <strong>500 (quinhentos) quilômetros</strong> rodados após a retirada do veículo do pátio, mediante apresentação de nota fiscal do serviço para concessão de garantia, o COMPRADOR assinará o campo abaixo, concordando com as consequências que lhe foram explicadas no ato da compra.</p>

    <p style="margin-top: 24px;">Nome: <strong>{{clientName}}</strong> &nbsp;/&nbsp; CPF: <strong>{{clientCpf}}</strong></p>

    <p style="margin-top: 18px;">As partes elegem o <strong>Foro da Comarca de {{city}}</strong> para dirimir controvérsias sobre o presente contrato.</p>

    <p style="margin-top: 14px;"><strong>OBS:</strong> {{observations}}</p>

    <p style="margin-top: 20px; text-align: center;">{{contractDateLong}}</p>
  </div>

  <div class="jv-page-break" style="break-after: page; page-break-after: always;"></div>

  <header style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 24px;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="width: 40px; height: 40px; border: 2px solid #c41e3a; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; color: #c41e3a;">JV</div>
      <div style="font-size: 14pt; font-weight: 800; color: #c41e3a; text-transform: uppercase;">{{companyName}}</div>
    </div>
    <div style="text-align: right; font-size: 9.5pt;">
      <div>{{companyAddress}}</div>
      <div>CNPJ: {{companyCnpj}}</div>
    </div>
  </header>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-top: 40px; font-size: 10.5pt;">
    <div style="text-align: center;">
      <div style="min-height: 56px; border-bottom: 1px solid #111; margin-bottom: 8px;"></div>
      <strong>{{clientName}}</strong><br/>
      CPF/CNPJ: {{clientCpf}}
    </div>
    <div style="text-align: center;">
      <div style="min-height: 56px; border-bottom: 1px solid #111; margin-bottom: 8px;"></div>
      <strong>{{companyName}}</strong><br/>
      CNPJ: {{companyCnpj}}
    </div>
  </div>

  <p style="margin-top: 48px; font-size: 9pt; color: #555; text-align: center;">Documento gerado para impressão — conservar cópia para ambas as partes.</p>
</div>`,
};

export function getDefaultSystemSettings(): SystemSettings {
  return {
    companyName: 'Japan Motors',
    cnpj: '12.345.678/0001-90',
    address: 'Av. das Nações, 1500 - São Paulo, SP',
    phone: '(11) 3344-5566',
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
    brand: 'Honda',
    model: 'Civic Touring',
    year: 2022,
    color: 'Prata',
    plate: 'ABC-1234',
    vin: '9BR123...',
    renavam: '123456789',
    mileage: 15430,
    fuel: 'Flex',
    acquisitionPrice: 120000,
    salePrice: 145900,
    status: 'available',
    images: ['https://picsum.photos/seed/civic/400/300'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'car',
    brand: 'Toyota',
    model: 'Corolla Altis',
    year: 2021,
    color: 'Branco',
    plate: 'XYZ-5678',
    vin: '9BR456...',
    renavam: '987654321',
    mileage: 22100,
    fuel: 'Híbrido',
    acquisitionPrice: 110000,
    salePrice: 138500,
    status: 'sold',
    images: ['https://picsum.photos/seed/corolla/400/300'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'car',
    brand: 'BMW',
    model: '320i M Sport',
    year: 2023,
    color: 'Preto',
    plate: 'BMW-0001',
    vin: 'WBA789...',
    renavam: '456789123',
    mileage: 5200,
    fuel: 'Gasolina',
    acquisitionPrice: 280000,
    salePrice: 315000,
    status: 'available',
    images: ['https://picsum.photos/seed/bmw/400/300'],
    createdAt: new Date().toISOString(),
  },
];

export const seedClients: Client[] = [
  {
    id: '1',
    name: 'Ricardo Silva',
    status: 'vip',
    birthDate: '1985-05-15',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    email: 'ricardo.silva@email.com',
    phone: '(11) 98765-4321',
    whatsapp: '(11) 98765-4321',
    address: {
      zipCode: '01234-567',
      street: 'Rua das Flores',
      number: '456',
      neighborhood: 'Jardim Paulista',
      city: 'São Paulo',
      state: 'SP',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Ana Oliveira',
    status: 'active',
    birthDate: '1992-08-22',
    cpf: '987.654.321-11',
    rg: '98.765.432-1',
    email: 'ana.oliveira@email.com',
    phone: '(11) 91234-5678',
    whatsapp: '(11) 91234-5678',
    address: {
      zipCode: '13000-000',
      street: 'Av. Brasil',
      number: '1000',
      neighborhood: 'Centro',
      city: 'Campinas',
      state: 'SP',
    },
    createdAt: new Date().toISOString(),
  },
];

export const seedContracts: Contract[] = [
  {
    id: 'CTR-001',
    type: 'sale',
    clientId: '1',
    clientName: 'Ricardo Silva',
    vehicleId: '1',
    vehicleName: 'Honda Civic Touring',
    date: new Date().toISOString(),
    totalValue: 145900,
    downPayment: 45900,
    balance: 100000,
    paymentMethod: 'Financiamento 48x',
    warrantyDays: 90,
    clauses: [],
    status: 'completed',
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
