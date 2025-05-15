import * as cheerio from 'cheerio';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new Response(JSON.stringify({ error: 'URL inválida' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const domains = new Set();

    $('script[src], img[src], video[src], link[href], a[src], audio[src], source[src]').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('href');
      if (!src) return;

      try {
        const fullUrl = new URL(src, url);
        const hostname = fullUrl.hostname;

        const parts = hostname.split('.');
        const normalized = parts.length <= 2 ? `www.${hostname}` : hostname;

        domains.add(normalized);
      } catch (e) {}
    });

    return new Response(JSON.stringify({ domains: Array.from(domains).sort() }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Erro ao carregar a página' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
