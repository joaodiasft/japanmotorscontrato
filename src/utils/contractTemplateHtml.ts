import type { ContractTemplate } from '../types';

/** Decodifica entidades comuns (ordem segura para &amp;). */
export function decodeBasicHtmlEntities(text: string): string {
  let s = text;
  s = s.replace(/&amp;/g, '\u0001AMP\u0001');
  s = s.replace(/&nbsp;/g, ' ');
  s = s.replace(/&#160;/g, ' ');
  s = s.replace(/&#32;/g, ' ');
  s = s.replace(/&lt;/g, '<');
  s = s.replace(/&gt;/g, '>');
  s = s.replace(/&quot;/g, '"');
  s = s.replace(/&#39;/g, "'");
  s = s.replace(/&#x27;/g, "'");
  s = s.replace(/\u0001AMP\u0001/g, '&');
  return s;
}

/** Indica colagem de página inteira ou HTML escapado pelo editor. */
export function contractContentNeedsHtmlMode(content: string): boolean {
  const c = (content || '').trim();
  if (!c) return false;
  if (/&lt;[a-z!]/i.test(c)) return true;
  if (/<!DOCTYPE/i.test(c)) return true;
  if (/<html[\s>]/i.test(c)) return true;
  if (/<head[\s>]/i.test(c) && /<\/head>/i.test(c)) return true;
  return false;
}

/**
 * Remove DOCTYPE/html/head/body e decodifica HTML escapado (ex.: colado no Quill).
 * Idempotente para fragmentos já corretos.
 */
export function normalizeContractTemplateHtml(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  let s = raw.trim();
  for (let i = 0; i < 3 && /&lt;[a-z!]/i.test(s); i++) {
    s = decodeBasicHtmlEntities(s).trim();
  }
  const bodyMatch = s.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    s = bodyMatch[1].trim();
  } else {
    s = s.replace(/<!DOCTYPE[^>]*>/gi, '');
    s = s.replace(/<\?xml[^>]*\?>/gi, '');
    s = s.replace(/<html[^>]*>/gi, '');
    s = s.replace(/<\/html>/gi, '');
    s = s.replace(/<head[\s\S]*?<\/head>/gi, '');
    s = s.replace(/<\/?body[^>]*>/gi, '');
  }
  return s.trim();
}

export function normalizeContractTemplates(templates: ContractTemplate[]): ContractTemplate[] {
  return templates.map((t) => ({
    ...t,
    content: normalizeContractTemplateHtml(t.content),
  }));
}

/** Prévia em texto para cards (sem tags visíveis). */
export function contractTemplatePlainPreview(html: string, maxLen: number): string {
  const step1 = normalizeContractTemplateHtml(html);
  const text = step1
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLen) return text || '— sem texto —';
  return `${text.slice(0, maxLen)}…`;
}
