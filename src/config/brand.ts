/**
 * Reexporta `server/brandDefaults.ts` (fonte única; API na Vercel não inclui `src/` no bundle do seed).
 */
export {
  BRAND_INSTAGRAM_HANDLE,
  BRAND_INSTAGRAM_URL,
  BRAND_LOGO_ALT,
  BRAND_LOGO_URL,
  BRAND_NAME,
  BRAND_TAGLINE,
  DEFAULT_COMPANY_ADDRESS,
  DEFAULT_COMPANY_CNPJ,
  DEFAULT_COMPANY_EMAIL,
  DEFAULT_COMPANY_PHONE_LINE,
} from '../../server/brandDefaults';
