import { toHTML } from '@portabletext/to-html';
import { urlFor } from '@/sanity/lib/image';
import { processLatexSVGSSR } from '@/utils/latexProcessor';
import type { PortableTextBlock } from '@portabletext/types';

export interface TableRow {
  cells: string[];
}

export interface TableValue {
  headers: string[];
  rows: TableRow[];
  caption?: string;
}

export interface CodeBlockValue {
  code: string;
  language?: string;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

export function renderTable(value: TableValue): string {
  if (!value || !Array.isArray(value.headers) || !Array.isArray(value.rows)) return '';
  return `
    <table style="border-collapse:collapse;width:100%;margin:1.5em 0;">
      <thead>
        <tr>
          ${value.headers.map((header: string) => `<th style=\"border:1px solid #a78bfa;padding:0.5em;background:#2a2040;color:#a78bfa;\">${header}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${value.rows.map((row: TableRow) =>
          `<tr>${(row.cells || []).map((cell: string) => `<td style=\"border:1px solid #a78bfa;padding:0.5em;\">${cell}</td>`).join('')}</tr>`
        ).join('')}
      </tbody>
    </table>
  `;
}

export function renderHTMLContent(
  body: PortableTextBlock[],
  url: string,
  categories?: { title: string }[]
): string {
  if (!body) return '';
  let categoriesHtml = '';
  if (categories && categories.length > 0) {
    categoriesHtml = `<div style=\"margin-bottom:0.5em;\">Categories: ` +
      categories.map(cat => {
        const slug = slugify(cat.title);
        return `<a href=\"https://www.heyshinde.com/blog/category/${slug}\" style=\"color:#a78bfa;text-decoration:none;\">${cat.title}</a>`;
      }).join(', ') +
      `</div>`;
  }
  const readHere = `<p><a href=\"${url}\">Read this post on HeyShinde.com for the best experience (with math, images, and formatting).</a></p>`;
  const html = toHTML(body, {
    components: {
      types: {
        image: ({ value }: { value: { asset?: { _ref: string }; alt?: string; caption?: string } }) => {
          if (!value || !value.asset?._ref) return '';
          const imageUrl = urlFor(value).url();
          const alt = value.alt || '';
          const caption = value.caption || alt || '';
          return `<figure style=\"margin:1.5em 0;text-align:center;\">
            <img src=\"${imageUrl}\" alt=\"${alt}\" style=\"max-width:100%;height:auto;border-radius:12px;box-shadow:0 2px 12px #0002;border:1px solid #a78bfa;\" />
            ${caption ? `<figcaption style=\\\"color:#a78bfa;font-size:0.95em;margin-top:0.5em;\\\">${caption}</figcaption>` : ''}
          </figure>`;
        },
        table: ({ value }: { value: TableValue }) => renderTable(value),
        codeBlock: ({ value }: { value: CodeBlockValue }) => `<pre style=\"background:#181825;color:#a78bfa;padding:1em;border-radius:8px;overflow-x:auto;font-size:0.98em;margin:1.5em 0;\">${value?.code || '[Code block]'}</pre>`,
        embed: ({ value }: { value: { url?: string; platform?: string } }) => {
          if (!value?.url) return '';
          return `<p><a href=\"${value.url}\" rel=\"noopener noreferrer\" target=\"_blank\">View embedded content (${value.platform || 'link'})</a></p>`;
        },
      },
      block: {
        blockquote: ({ children }: { children?: string }) => `<blockquote style=\"border-left:4px solid #a78bfa;padding-left:1em;margin:1.5em 0;color:#a78bfa;background:#1a1a2a0d;border-radius:8px;\">${children ?? ''}</blockquote>`,
        code: ({ children }: { children?: string }) => `<pre style=\"background:#181825;color:#a78bfa;padding:1em;border-radius:8px;overflow-x:auto;font-size:0.98em;margin:1.5em 0;\">${children ?? ''}</pre>`,
      },
    },
  });
  // Render math as SVG
  const htmlWithMath = processLatexSVGSSR(categoriesHtml + readHere + html);
  return htmlWithMath;
} 