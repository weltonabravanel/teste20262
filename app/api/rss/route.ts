import { NextResponse } from "next/server";

// --- Interfaces ---
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

// --- Configurações ---
const REVALIDATE_TIME = 120; // 2 minutos

const RSS_FEEDS = {
  geral: [
    { url: "https://rss.uol.com.br/feed/noticias.xml", source: "UOL" },
    { url: "https://www.cnnbrasil.com.br/feed", source: "CNN Brasil" },
    { url: "https://g1.globo.com/rss/g1/", source: "G1" },
  ],
  brasil: [
    { url: "https://g1.globo.com/rss/g1/brasil/", source: "G1" },
    { url: "https://feeds.folha.uol.com.br/poder/rss091.xml", source: "Folha" },
    { url: "https://agenciabrasil.ebc.com.br/rss/politica/feed.xml", source: "Agência Brasil" },
  ],
  mundo: [
    { url: "https://g1.globo.com/rss/g1/mundo/", source: "G1" },
    { url: "https://feeds.folha.uol.com.br/mundo/rss091.xml", source: "Folha" },
    { url: "https://feeds.bbci.co.uk/portuguese/rss.xml", source: "BBC Brasil" },
  ],
  economia: [
    { url: "https://g1.globo.com/rss/g1/economia/", source: "G1" },
    { url: "https://rss.uol.com.br/feed/economia.xml", source: "UOL" },
    { url: "https://valorinveste.globo.com/rss/feed", source: "Valor Investe" },
  ],
  tecnologia: [
    { url: "https://g1.globo.com/rss/g1/tecnologia/", source: "G1" },
    { url: "https://www.tecmundo.com.br/rss", source: "TecMundo" },
    { url: "https://tecnoblog.net/feed/", source: "Tecnoblog" },
    { url: "https://olhardigital.com.br/feed/", source: "Olhar Digital" },
  ],
  esportes: [
    { url: "https://globoesporte.globo.com/rss.xml", source: "GE" },
    { url: "https://rss.uol.com.br/feed/esporte.xml", source: "UOL" },
    { url: "https://jovempan.com.br/esportes/feed", source: "Jovem Pan" },
  ],
  entretenimento: [
    { url: "https://g1.globo.com/rss/g1/pop-arte/", source: "G1" },
    { url: "https://feeds.folha.uol.com.br/ilustrada/rss091.xml", source: "Folha" },
    { url: "https://rss.uol.com.br/feed/entretenimento.xml", source: "UOL" },
  ],
};

// --- Funções Auxiliares ---

function cleanText(text: string): string {
  if (!text) return "";
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(d))
    .replace(/\s+/g, " ")
    .trim();
}

function parseRSSXML(xml: string, source: string, section?: string): RSSItem[] {
  const items: RSSItem[] = [];
  const itemRegex = /<(item|entry)>([\s\S]*?)<\/\1>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[2];

    const title = cleanText(content.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
    let link = content.match(/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i)?.[1] || 
               content.match(/href=["']([^"']+)["']/i)?.[1] || "";
    
    // Limpa trackers de URL (comum em RSS da Folha/UOL)
    link = link.split('?')[0].trim();

    let description = cleanText(content.match(/<(description|summary)[^>]*>([\s\S]*?)<\/\1>/i)?.[2] || "");
    if (description.length > 200) description = description.substring(0, 197) + "...";

    const pubDateStr = content.match(/<(pubDate|published|updated)>([\s\S]*?)<\/\1>/i)?.[2] || new Date().toISOString();
    
    const imageUrl = 
      content.match(/<media:content[^>]+url=["']([^"']+)["']/i)?.[1] ||
      content.match(/<enclosure[^>]+url=["']([^"']+)["']/i)?.[1] ||
      content.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ||
      content.match(/url=["']([^"']+\.(?:jpg|jpeg|png|webp|gif))["']/i)?.[1];

    if (title && link) {
      items.push({
        title,
        link,
        description,
        pubDate: new Date(pubDateStr).toISOString(), // Normaliza a data
        source,
        section,
        imageUrl: imageUrl?.startsWith("http") ? imageUrl : undefined
      });
    }
  }
  return items;
}

async function fetchRSSFeed(url: string, source: string, section?: string): Promise<RSSItem[]> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: REVALIDATE_TIME }, 
    });

    if (!response.ok) return [];

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "";
    let encoding = contentType.toLowerCase().includes("iso-8859-1") ? "iso-8859-1" : "utf-8";
    
    let decoder = new TextDecoder(encoding);
    let xml = decoder.decode(buffer);

    if (xml.toLowerCase().includes('encoding="iso-8859-1"') && encoding !== "iso-8859-1") {
      xml = new TextDecoder("iso-8859-1").decode(buffer);
    }

    return parseRSSXML(xml, source, section);
  } catch (error) {
    console.error(`Erro em ${source}:`, error);
    return [];
  }
}

async function fetchCategoryFeeds(category: keyof typeof RSS_FEEDS): Promise<RSSItem[]> {
  const feeds = RSS_FEEDS[category];
  const results = await Promise.allSettled(feeds.map(f => fetchRSSFeed(f.url, f.source, category)));
  
  const allItems = results
    .filter((r): r is PromiseFulfilledResult<RSSItem[]> => r.status === 'fulfilled')
    .map(r => r.value)
    .flat();

  const seen = new Set();
  return allItems
    .filter(item => {
      // Deduplicação por slug do link (ignora diferenças sutis de protocolo ou barra final)
      const key = item.link.replace(/^https?:\/\//, '').replace(/\/$/, '');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 20); // Aumentado para 20 itens por categoria
}

// --- Route Handler Principal ---

export async function GET() {
  try {
    // Busca todas as categorias em paralelo
    const categoriesKeys = Object.keys(RSS_FEEDS) as Array<keyof typeof RSS_FEEDS>;
    const results = await Promise.all(categoriesKeys.map(cat => fetchCategoryFeeds(cat)));

    // Mapeia os resultados para o formato da interface RSSFeed
    const feedMap: any = {};
    categoriesKeys.forEach((key, index) => {
      feedMap[key] = results[index];
    });

    const feedData: RSSFeed = {
      title: "Portal de Notícias",
      description: "Agregador RSS em Tempo Real",
      link: "/",
      items: feedMap.geral,
      categories: {
        brasil: feedMap.brasil,
        mundo: feedMap.mundo,
        economia: feedMap.economia,
        tecnologia: feedMap.tecnologia,
        esportes: feedMap.esportes,
        entretenimento: feedMap.entretenimento,
      },
      lastBuildDate: new Date().toISOString(),
    };

    return NextResponse.json(feedData, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        // Cache compartilhado de 2 minutos, permite servir cache "velho" por mais 30s enquanto valida
        "Cache-Control": `s-maxage=${REVALIDATE_TIME}, stale-while-revalidate=30`
      },
    });
  } catch (error) {
    console.error("Erro Geral no Feed:", error);
    return NextResponse.json({ error: "Erro ao processar feeds" }, { status: 500 });
  }
}