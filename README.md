# Japan Motors — Gestão de Contratos

## Desenvolvimento local

1. Copie o ambiente: `cp .env.example .env` e preencha `DATABASE_URL` (PostgreSQL acessível da sua rede).
2. `npm install`
3. `npx prisma generate && npx prisma db push`
4. `npx prisma db seed` (opcional — dados iniciais e modelos de contrato)
5. `npm run dev` — front em **http://localhost:3000**, API em **http://127.0.0.1:3002** (proxy `/api` → API).

Se “Configurações” não carregar, o erro costuma ser **falha de conexão com o banco** (firewall, URL errada ou instância pausada).

## Contrato de Venda (multipágina)

- Texto: `server/contrato-venda-template.html`
- Logo e dados padrão: `server/brandDefaults.ts` (reexportado em `src/config/brand.ts` para o front).
- Para **atualizar os modelos no banco**: Configurações → Restaurar modelos padrão (ou `POST /api/settings/reset-templates`).

## Deploy (Vercel)

- Variáveis: `DATABASE_URL` (e demais necessárias ao Prisma).
- Build: `npm run build` (gera cliente Prisma + Vite).
- Garanta deploy da branch com `vercel.json` que inclui `server/contrato-venda-template.html` nas functions da API.

Repositório: [japanmotorscontrato](https://github.com/joaodiasft/japanmotorscontrato)
