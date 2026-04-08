/**
 * Reexporta `lib/contractTemplateHtml.ts` (alias Vite `@contract-template-html`).
 * A API usa cópia inline em `server/mappers.ts` (evita módulo extra na Vercel).
 */
export {
  contractContentNeedsHtmlMode,
  contractTemplatePlainPreview,
  decodeBasicHtmlEntities,
  normalizeContractTemplateHtml,
  normalizeContractTemplates,
} from '@contract-template-html';
