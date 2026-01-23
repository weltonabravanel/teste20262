import { NextResponse } from "next/server";

export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  category?: string;
  imageUrl?: string;
  source?: string;
  section?: string;
}

export interface RSSFeed {
  title: string;
  description: string;
  link: string;
  items: RSSItem[];
  categories: {
    brasil: RSSItem[];
    mundo: RSSItem[];
    economia: RSSItem[];
    tecnologia: RSSItem[];
    esportes: RSSItem[];
    entretenimento: RSSItem[];
  };
  lastBuildDate?: string;
}

// Lista expandida de feeds RSS organizados por categoria
const RSS_FEEDS = {
  geral: [
    { url: "https://rss.uol.com.br/feed/noticias.xml", source: "UOL" },
    { url: "https://g1.globo.com/rss/g1/", source: "G1" },
    { url: "https://feeds.folha.uol.com.br/emcimadahora/rss091.xml", source: "Folha" },
    { url: "https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml", source: "Agencia Brasil" },
    { url: "https://feeds.bbci.co.uk/portuguese/rss.xml", source: "BBC Brasil" },
  ],
  brasil: [
    { url: "https://g1.globo.com/rss/g1/brasil/", source: "G1" },
    { url: "https://feeds.folha.uol.com.br/poder/rss091.xml", source: "Folha" },
    { url: "https://rss.uol.com.br/feed/noticias.xml", source: "UOL" },
    { url: "https://agenciabrasil.ebc.com.br/rss/politica/feed.xml", source: "Agencia Brasil" },
    { url: "https://feeds.estadao.com.br/politica.xml", source: "Estadao" },
    { url: "https://www.correiobraziliense.com.br/rss/noticia/brasil/", source: "Correio Braziliense" },
  ],
  mundo: [
    { url: "https://g1.globo.com/rss/g1/mundo/", source: "G1" },
    { url: "https://feeds.folha.uol.com.br/mundo/rss091.xml", source: "Folha" },
    { url: "https://rss.uol.com.br/feed/noticias.xml", source: "UOL" },
    { url: "https://agenciabrasil.ebc.com.br/rss/internacional/feed.xml", source: "Agencia Brasil" },
    { url: "https://feeds.bbci.co.uk/portuguese/rss.xml", source: "BBC Brasil" },
    { url: "https://feeds.estadao.com.br/internacional.xml", source: "Estadao" },
  ],
  economia: [
    { url: "https://g1.globo.com/rss/g1/economia/", source: "G1" },
    { url: "https://feeds.folha.uol.com.br/mercado/rss091.xml", source: "Folha" },
    { url: "https://rss.uol.com.br/feed/economia.xml", source: "UOL" },
    { url: "https://agenciabrasil.ebc.com.br/rss/economia/feed.xml", source: "Agencia Brasil" },
    { url: "https://feeds.estadao.com.br/economia.xml", source: "Estadao" },
    { url: "https://valorinveste.globo.com/rss/feed", source: "Valor" },
  ],
  tecnologia: [
    { url: "https://g1.globo.com/rss/g1/tecnologia/", source: "G1" },
    { url: "https://feeds.folha.uol.com.br/tec/rss091.xml", source: "Folha" },
    { url: "https://rss.uol.com.br/feed/tecnologia.xml", source: "UOL" },
    { url: "https://www.tecmundo.com.br/rss", source: "TecMundo" },
    { url: "https://tecnoblog.net/feed/", source: "Tecnoblog" },
    { url: "https://canaltech.com.br/rss/", source: "Canaltech" },
    { url: "https://olhardigital.com.br/feed/", source: "Olhar Digital" },
  ],
  esportes: [
    { url: "https://g1.globo.com/rss/g1/esportes/", source: "G1" },
    { url: "https://feeds.folha.uol.com.br/esporte/rss091.xml", source: "Folha" },
    { url: "https://rss.uol.com.br/feed/esporte.xml", source: "UOL" },
    { url: "https://feeds.estadao.com.br/esportes.xml", source: "Estadao" },
    { url: "https://globoesporte.globo.com/rss.xml", source: "GE" },
  ],
  entretenimento: [
    { url: "https://g1.globo.com/rss/g1/pop-arte/", source: "G1" },
    { url: "https://feeds.folha.uol.com.br/ilustrada/rss091.xml", source: "Folha" },
    { url: "https://rss.uol.com.br/feed/entretenimento.xml", source: "UOL" },
    { url: "https://feeds.estadao.com.br/cultura.xml", source: "Estadao" },
    { url: "https://feeds.bbci.co.uk/portuguese/rss.xml", source: "BBC Brasil" },
  ],
};

// Funcao para corrigir UTF-8 mal codificado (double encoding)
function fixBrokenUTF8(text: string): string {
  // Mapeamento de sequencias UTF-8 quebradas para caracteres corretos
  // Inclui variantes com diferentes bytes de continuacao
  const brokenPatterns: Array<[RegExp, string]> = [
    // Minusculas acentuadas - padrao Ã + byte
    [/Ã¡/g, "a"], [/Ã /g, "a"], [/Ã¢/g, "a"], [/Ã£/g, "a"], [/Ã¤/g, "a"],
    [/Ã©/g, "e"], [/Ã¨/g, "e"], [/Ãª/g, "e"], [/Ã«/g, "e"],
    [/Ã­/g, "i"], [/Ã¬/g, "i"], [/Ã®/g, "i"], [/Ã¯/g, "i"],
    [/Ã³/g, "o"], [/Ã²/g, "o"], [/Ã´/g, "o"], [/Ãµ/g, "o"], [/Ã¶/g, "o"],
    [/Ãº/g, "u"], [/Ã¹/g, "u"], [/Ã»/g, "u"], [/Ã¼/g, "u"],
    [/Ã§/g, "c"], [/Ã±/g, "n"],
    // Maiusculas acentuadas
    [/Ã/g, "A"], [/Ã€/g, "A"], [/Ã‚/g, "A"], [/Ãƒ/g, "A"],
    [/Ã‰/g, "E"], [/Ãˆ/g, "E"], [/ÃŠ/g, "E"],
    [/Ã/g, "I"], [/ÃŒ/g, "I"], [/ÃŽ/g, "I"],
    [/Ã"/g, "O"], [/Ã'/g, "O"], [/Ã"/g, "O"], [/Ã•/g, "O"],
    [/Ãš/g, "U"], [/Ã™/g, "U"], [/Ã›/g, "U"],
    [/Ã‡/g, "C"], [/Ã'/g, "N"],
    // Simbolos
    [/Âº/g, "\u00BA"], [/Âª/g, "\u00AA"], [/Â°/g, "\u00B0"],
    [/â€"/g, "-"], [/â€"/g, "-"], [/â€˜/g, "'"], [/â€™/g, "'"],
    [/â€œ/g, "\""], [/â€/g, "\""], [/â€¦/g, "..."],
    [/Â /g, " "], [/Â«/g, "\""], [/Â»/g, "\""],
  ];

  // Mapeamento direto de bytes
  const brokenUTF8: Record<string, string> = {
    "\u00C3\u00A1": "\u00E1", // a
    "\u00C3\u00A0": "\u00E0", // a
    "\u00C3\u00A2": "\u00E2", // a
    "\u00C3\u00A3": "\u00E3", // a
    "\u00C3\u00A4": "\u00E4", // a
    "\u00C3\u00A9": "\u00E9", // e
    "\u00C3\u00A8": "\u00E8", // e
    "\u00C3\u00AA": "\u00EA", // e
    "\u00C3\u00AB": "\u00EB", // e
    "\u00C3\u00AD": "\u00ED", // i
    "\u00C3\u00AC": "\u00EC", // i
    "\u00C3\u00AE": "\u00EE", // i
    "\u00C3\u00AF": "\u00EF", // i
    "\u00C3\u00B3": "\u00F3", // o
    "\u00C3\u00B2": "\u00F2", // o
    "\u00C3\u00B4": "\u00F4", // o
    "\u00C3\u00B5": "\u00F5", // o
    "\u00C3\u00B6": "\u00F6", // o
    "\u00C3\u00BA": "\u00FA", // u
    "\u00C3\u00B9": "\u00F9", // u
    "\u00C3\u00BB": "\u00FB", // u
    "\u00C3\u00BC": "\u00FC", // u
    "\u00C3\u00A7": "\u00E7", // c
    "\u00C3\u0087": "\u00C7", // C
    "\u00C3\u00B1": "\u00F1", // n
    "\u00C3\u0091": "\u00D1", // N
    "\u00C3\u0081": "\u00C1", // A
    "\u00C3\u0080": "\u00C0", // A
    "\u00C3\u0082": "\u00C2", // A
    "\u00C3\u0083": "\u00C3", // A
    "\u00C3\u0089": "\u00C9", // E
    "\u00C3\u0088": "\u00C8", // E
    "\u00C3\u008A": "\u00CA", // E
    "\u00C3\u008D": "\u00CD", // I
    "\u00C3\u008C": "\u00CC", // I
    "\u00C3\u008E": "\u00CE", // I
    "\u00C3\u0093": "\u00D3", // O
    "\u00C3\u0092": "\u00D2", // O
    "\u00C3\u0094": "\u00D4", // O
    "\u00C3\u0095": "\u00D5", // O
    "\u00C3\u009A": "\u00DA", // U
    "\u00C3\u0099": "\u00D9", // U
    "\u00C3\u009B": "\u00DB", // U
    "\u00C2\u00BA": "\u00BA", // o
    "\u00C2\u00AA": "\u00AA", // a
    "\u00C2\u00B0": "\u00B0", // o
    "\u00E2\u0080\u0093": "\u2013", // -
    "\u00E2\u0080\u0094": "\u2014", // -
    "\u00E2\u0080\u0098": "\u2018", // '
    "\u00E2\u0080\u0099": "\u2019", // '
    "\u00E2\u0080\u009C": "\u201C", // "
    "\u00E2\u0080\u009D": "\u201D", // "
    "\u00E2\u0080\u00A6": "\u2026", // ...
  };

  let fixed = text;
  
  // Aplica substituicoes de regex primeiro
  for (const [pattern, replacement] of brokenPatterns) {
    fixed = fixed.replace(pattern, replacement);
  }
  
  // Depois aplica mapeamento direto
  for (const [broken, correct] of Object.entries(brokenUTF8)) {
    fixed = fixed.split(broken).join(correct);
  }
  
  return fixed;
}

// Funcao para decodificar entidades HTML
function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": "\"",
    "&apos;": "'",
    "&#39;": "'",
    "&nbsp;": " ",
    "&ndash;": "\u2013",
    "&mdash;": "\u2014",
    "&lsquo;": "\u2018",
    "&rsquo;": "\u2019",
    "&ldquo;": "\u201C",
    "&rdquo;": "\u201D",
    "&bull;": "\u2022",
    "&hellip;": "\u2026",
    "&copy;": "\u00A9",
    "&reg;": "\u00AE",
    "&trade;": "\u2122",
    "&euro;": "\u20AC",
    "&pound;": "\u00A3",
    "&yen;": "\u00A5",
    "&cent;": "\u00A2",
    "&deg;": "\u00B0",
    "&plusmn;": "\u00B1",
    "&times;": "\u00D7",
    "&divide;": "\u00F7",
    "&frac12;": "\u00BD",
    "&frac14;": "\u00BC",
    "&frac34;": "\u00BE",
    "&ordf;": "\u00AA",
    "&ordm;": "\u00BA",
    // Letras acentuadas minusculas
    "&aacute;": "\u00E1",
    "&agrave;": "\u00E0",
    "&acirc;": "\u00E2",
    "&atilde;": "\u00E3",
    "&auml;": "\u00E4",
    "&eacute;": "\u00E9",
    "&egrave;": "\u00E8",
    "&ecirc;": "\u00EA",
    "&euml;": "\u00EB",
    "&iacute;": "\u00ED",
    "&igrave;": "\u00EC",
    "&icirc;": "\u00EE",
    "&iuml;": "\u00EF",
    "&oacute;": "\u00F3",
    "&ograve;": "\u00F2",
    "&ocirc;": "\u00F4",
    "&otilde;": "\u00F5",
    "&ouml;": "\u00F6",
    "&uacute;": "\u00FA",
    "&ugrave;": "\u00F9",
    "&ucirc;": "\u00FB",
    "&uuml;": "\u00FC",
    "&ccedil;": "\u00E7",
    "&ntilde;": "\u00F1",
    "&yacute;": "\u00FD",
    "&yuml;": "\u00FF",
    // Letras acentuadas maiusculas
    "&Aacute;": "\u00C1",
    "&Agrave;": "\u00C0",
    "&Acirc;": "\u00C2",
    "&Atilde;": "\u00C3",
    "&Auml;": "\u00C4",
    "&Eacute;": "\u00C9",
    "&Egrave;": "\u00C8",
    "&Ecirc;": "\u00CA",
    "&Euml;": "\u00CB",
    "&Iacute;": "\u00CD",
    "&Igrave;": "\u00CC",
    "&Icirc;": "\u00CE",
    "&Iuml;": "\u00CF",
    "&Oacute;": "\u00D3",
    "&Ograve;": "\u00D2",
    "&Ocirc;": "\u00D4",
    "&Otilde;": "\u00D5",
    "&Ouml;": "\u00D6",
    "&Uacute;": "\u00DA",
    "&Ugrave;": "\u00D9",
    "&Ucirc;": "\u00DB",
    "&Uuml;": "\u00DC",
    "&Ccedil;": "\u00C7",
    "&Ntilde;": "\u00D1",
    "&Yacute;": "\u00DD",
  };

  let decoded = text;

  // Decodifica entidades nomeadas
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.split(entity).join(char);
  }

  // Decodifica entidades numericas decimais
  decoded = decoded.replace(/&#(\d+);/g, (_, code) => {
    return String.fromCharCode(parseInt(code, 10));
  });

  // Decodifica entidades numericas hexadecimais
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, code) => {
    return String.fromCharCode(parseInt(code, 16));
  });

  return decoded;
}

// Funcao para limpar e normalizar texto
function cleanText(text: string): string {
  if (!text) return "";

  let cleaned = text;

  // Remove CDATA
  cleaned = cleaned.replace(/<!\[CDATA\[|\]\]>/g, "");

  // Remove tags HTML
  cleaned = cleaned.replace(/<[^>]*>/g, "");

  // Decodifica entidades HTML
  cleaned = decodeHTMLEntities(cleaned);

  // Corrige UTF-8 mal codificado (double encoding)
  cleaned = fixBrokenUTF8(cleaned);

  // Remove espacos extras
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

function extractImageFromContent(content: string): string | null {
  const mediaMatch = content.match(/url=["']([^"']+)["']/);
  if (mediaMatch) return mediaMatch[1];

  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch) return imgMatch[1];

  const enclosureMatch = content.match(/enclosure[^>]+url=["']([^"']+)["']/);
  if (enclosureMatch) return enclosureMatch[1];

  return null;
}

function parseRSSXML(xml: string, source: string, section?: string): RSSItem[] {
  const items: RSSItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];

    const titleMatch = itemContent.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
    const linkMatch = itemContent.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
    const descMatch = itemContent.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
    const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
    const categoryMatch = itemContent.match(/<category>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/category>/i);

    const mediaContentMatch = itemContent.match(/<media:content[^>]+url=["']([^"']+)["']/i);
    const enclosureMatch2 = itemContent.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
    const mediaThumbMatch = itemContent.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);

    const imageUrl =
      mediaContentMatch?.[1] ||
      mediaThumbMatch?.[1] ||
      enclosureMatch2?.[1] ||
      extractImageFromContent(itemContent);

    if (titleMatch && linkMatch) {
      const title = cleanText(titleMatch[1]);
      const link = linkMatch[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim();
      const description = descMatch ? cleanText(descMatch[1]).substring(0, 200) : "";

      items.push({
        title,
        link,
        description,
        pubDate: pubDateMatch?.[1] || new Date().toISOString(),
        category: categoryMatch ? cleanText(categoryMatch[1]) : undefined,
        imageUrl: imageUrl || undefined,
        source,
        section,
      });
    }
  }

  return items;
}

// Funcao para detectar e converter encoding
function decodeWithCorrectEncoding(buffer: ArrayBuffer, contentType: string | null): string {
  // Tenta detectar encoding do header Content-Type
  let encoding = "utf-8";
  if (contentType) {
    const charsetMatch = contentType.match(/charset=([^\s;]+)/i);
    if (charsetMatch) {
      encoding = charsetMatch[1].toLowerCase().replace(/['"]/g, "");
    }
  }

  // Converte buffer para string
  const uint8Array = new Uint8Array(buffer);
  
  // Tenta detectar encoding do XML declaration
  const xmlDeclaration = new TextDecoder("ascii").decode(uint8Array.slice(0, 200));
  const xmlEncodingMatch = xmlDeclaration.match(/encoding=["']([^"']+)["']/i);
  if (xmlEncodingMatch) {
    encoding = xmlEncodingMatch[1].toLowerCase();
  }

  // Mapeia encodings comuns
  const encodingMap: Record<string, string> = {
    "iso-8859-1": "iso-8859-1",
    "latin1": "iso-8859-1",
    "latin-1": "iso-8859-1",
    "windows-1252": "windows-1252",
    "utf-8": "utf-8",
    "utf8": "utf-8",
  };

  const finalEncoding = encodingMap[encoding] || "utf-8";
  
  try {
    const decoder = new TextDecoder(finalEncoding);
    return decoder.decode(uint8Array);
  } catch {
    // Fallback para UTF-8 se encoding nao suportado
    return new TextDecoder("utf-8").decode(uint8Array);
  }
}

async function fetchRSSFeed(url: string, source: string, section?: string): Promise<RSSItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
        "Accept-Charset": "utf-8, iso-8859-1;q=0.5",
      },
      signal: controller.signal,
      next: { revalidate: 300 },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return [];
    }

    // Pega o buffer e decodifica com o encoding correto
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type");
    const xml = decodeWithCorrectEncoding(buffer, contentType);
    
    return parseRSSXML(xml, source, section);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error(`Timeout fetching ${url}`);
    } else {
      console.error(`Error fetching ${url}:`, error);
    }
    return [];
  }
}

async function fetchCategoryFeeds(category: keyof typeof RSS_FEEDS): Promise<RSSItem[]> {
  const feeds = RSS_FEEDS[category];
  const feedPromises = feeds.map((feed) => fetchRSSFeed(feed.url, feed.source, category));
  const allItems = await Promise.all(feedPromises);

  // Remove duplicatas baseado no titulo e ordena por data
  const seen = new Set<string>();
  return allItems
    .flat()
    .filter((item) => {
      const key = item.title.toLowerCase().substring(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 20);
}

export async function GET() {
  try {
    // Busca todas as categorias em paralelo
    const [geral, brasil, mundo, economia, tecnologia, esportes, entretenimento] = await Promise.all([
      fetchCategoryFeeds("geral"),
      fetchCategoryFeeds("brasil"),
      fetchCategoryFeeds("mundo"),
      fetchCategoryFeeds("economia"),
      fetchCategoryFeeds("tecnologia"),
      fetchCategoryFeeds("esportes"),
      fetchCategoryFeeds("entretenimento"),
    ]);

    const feed: RSSFeed = {
      title: "Portal de Noticias",
      description: "Agregador de noticias em tempo real",
      link: "/",
      items: geral,
      categories: {
        brasil,
        mundo,
        economia,
        tecnologia,
        esportes,
        entretenimento,
      },
      lastBuildDate: new Date().toISOString(),
    };

    return NextResponse.json(feed, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error fetching RSS feeds:", error);
    return NextResponse.json({ error: "Failed to fetch RSS feeds" }, { status: 500 });
  }
}
