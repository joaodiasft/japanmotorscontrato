/**
 * Reexporta `server/contractTemplateHtml.ts` (alias Vite `@contract-template-html`).
 * A API na Vercel importa o mesmo arquivo via `./contractTemplateHtml` a partir de `server/mappers`.
 */
export {
  contractContentNeedsHtmlMode,
  contractTemplatePlainPreview,
  decodeBasicHtmlEntities,
  normalizeContractTemplateHtml,
  normalizeContractTemplates,
} from '@contract-template-html';
