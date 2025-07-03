import { toHTML } from '@portabletext/to-html';
import { urlFor } from '@/sanity/lib/image';
import { processLatexSSR } from '@/utils/latexProcessor';
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

export interface AuthorInfo {
  name: string;
  image?: string;
  bio?: string;
  socialLinks?: { platform: string; url: string }[];
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function renderSimpleTable(value: TableValue): string {
  if (!value || !Array.isArray(value.headers) || !Array.isArray(value.rows)) return '';
  return `
    <table border="1" style="width:100%;margin:1em 0;">
      <thead>
        <tr>
          ${value.headers.map((header: string) => `<th>${header}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${value.rows.map((row: TableRow) =>
          `<tr>${(row.cells || []).map((cell: string) => `<td>${cell}</td>`).join('')}</tr>`
        ).join('')}
      </tbody>
    </table>
  `;
}

function renderSimpleImage(value: { asset?: { _ref: string }; alt?: string; caption?: string }): string {
  if (!value || !value.asset?._ref) return '';
  const imageUrl = urlFor(value).url();
  const alt = value.alt || '';
  return `<img src="${imageUrl}" alt="${alt}" />`;
}

function renderSimpleCodeBlock(value: CodeBlockValue): string {
  return `<pre>${value?.code || '[Code block]'}</pre>`;
}

function renderSimpleEmbed(value: { url?: string; platform?: string }): string {
  if (!value?.url) return '';
  return `<a href="${value.url}" target="_blank">${value.url}</a>`;
}

function renderSimpleBlockquote(children?: string): string {
  return `<blockquote>${children ?? ''}</blockquote>`;
}

function renderSimpleCode(children?: string): string {
  return `<pre>${children ?? ''}</pre>`;
}

function renderSimpleAuthorCard(author: AuthorInfo): string {
  if (!author || !author.name) return '';
  return `<div>
    ${author.image ? `<img src="${author.image}" alt="${author.name}"/>` : ''}
    <div>${author.name}</div>
    ${author.bio ? `<div>${author.bio}</div>` : ''}
  </div>`;
}

export function renderTable(value: TableValue): string {
  if (!value || !Array.isArray(value.headers) || !Array.isArray(value.rows)) return '';
  try {
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
  } catch {
    // fallback to simple table
    return renderSimpleTable(value);
  }
}

export function renderHTMLContent(
  body: PortableTextBlock[],
  url: string,
  categories?: { title: string }[],
  author?: AuthorInfo
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
  const subscribeLink = `<div style=\"margin:1.5em 0;text-align:center;\"><a href=\"https://www.heyshinde.com/subscribe\" style=\"display:inline-block;padding:0.75em 2em;background:#a78bfa;color:#181825;font-weight:bold;border-radius:8px;text-decoration:none;font-size:1.1em;box-shadow:0 2px 8px #0002;transition:background 0.2s;\" target=\"_blank\">Subscribe to the Newsletter</a></div>`;
  const readHere = `<p><a href=\"${url}\">Read this post on HeyShinde.com for the best experience (with math, images, and formatting).</a></p>`;
  const html = toHTML(body, {
    components: {
      types: {
        image: ({ value }: { value: { asset?: { _ref: string }; alt?: string; caption?: string } }) => {
          try {
          if (!value || !value.asset?._ref) return '';
          const imageUrl = urlFor(value).url();
          const alt = value.alt || '';
          const caption = value.caption || alt || '';
          return `<figure style=\"margin:1.5em 0;text-align:center;\">
            <img src=\"${imageUrl}\" alt=\"${alt}\" style=\"max-width:100%;height:auto;border-radius:12px;box-shadow:0 2px 12px #0002;border:1px solid #a78bfa;\" />
            ${caption ? `<figcaption style=\\\"color:#a78bfa;font-size:0.95em;margin-top:0.5em;\\\">${caption}</figcaption>` : ''}
          </figure>`;
          } catch {
            return renderSimpleImage(value);
          }
        },
        table: ({ value }: { value: TableValue }) => {
          try {
            return renderTable(value);
          } catch {
            return renderSimpleTable(value);
          }
        },
        codeBlock: ({ value }: { value: CodeBlockValue }) => {
          try {
            return `<pre style=\"background:#181825;color:#a78bfa;padding:1em;border-radius:8px;overflow-x:auto;font-size:0.98em;margin:1.5em 0;\">${value?.code || '[Code block]'}</pre>`;
          } catch {
            return renderSimpleCodeBlock(value);
          }
        },
        embed: ({ value }: { value: { url?: string; platform?: string } }) => {
          try {
          if (!value?.url) return '';
          return `<p><a href=\"${value.url}\" rel=\"noopener noreferrer\" target=\"_blank\">View embedded content (${value.platform || 'link'})</a></p>`;
          } catch {
            return renderSimpleEmbed(value);
          }
        },
      },
      block: {
        blockquote: ({ children }: { children?: string }) => {
          try {
            return `<blockquote style=\"border-left:4px solid #a78bfa;padding-left:1em;margin:1.5em 0;color:#a78bfa;background:#1a1a2a0d;border-radius:8px;\">${children ?? ''}</blockquote>`;
          } catch {
            return renderSimpleBlockquote(children);
          }
        },
        code: ({ children }: { children?: string }) => {
          try {
            return `<pre style=\"background:#181825;color:#a78bfa;padding:1em;border-radius:8px;overflow-x:auto;font-size:0.98em;margin:1.5em 0;\">${children ?? ''}</pre>`;
          } catch {
            return renderSimpleCode(children);
          }
        },
      },
    },
  });
  let htmlWithMath = processLatexSSR(categoriesHtml + readHere + subscribeLink + html);

  // Author box
  if (author && author.name) {
    try {
      let socialLinksHtml = '';
      if (author.socialLinks && author.socialLinks.length > 0) {
        socialLinksHtml = '<div style="margin-top:0.5em;">' +
          author.socialLinks.map(link => `<a href="${link.url}" target="_blank" rel="noopener" style="margin-right:0.5em;color:#a78bfa;text-decoration:none;">${link.platform}</a>`).join(' ') +
          '</div>';
      }
      htmlWithMath += `
        <div style="margin-top:2em;padding:1.5em;border:1px solid #a78bfa;border-radius:12px;background:#1a1a2a0d;display:flex;align-items:center;gap:1.5em;">
          ${author.image ? `<img src="${author.image}" alt="${author.name}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid #a78bfa;box-shadow:0 2px 8px #0002;" />` : ''}
          <div>
            <div style="font-weight:bold;font-size:1.15em;color:#a78bfa;">${author.name}</div>
            ${author.bio ? `<div style="margin:0.5em 0 0.25em 0;color:#a78bfa;">${author.bio}</div>` : ''}
            ${socialLinksHtml}
          </div>
        </div>
      `;
    } catch {
      htmlWithMath += renderSimpleAuthorCard(author);
    }
  }
  return htmlWithMath;
} 