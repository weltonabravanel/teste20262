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
    games: RSSItem[];
    saude: RSSItem[];
  };
  lastBuildDate?: string;
}

// --- Configurações de Fontes Ampliadas ---
const REVALIDATE_TIME = 120; // 2 minutos

const RSS_FEEDS = {
  geral: [
    { url: "https://portalleodias.com/feed/", source: "Portal Leo Dias" },
    { url: "https://news.google.com/rss?hl=pt-BR&gl=BR&ceid=BR:pt-419", source: "Google News" },
    { url: "https://rss.uol.com.br/feed/noticias.xml", source: "UOL" },
    { url: "https://www.cnnbrasil.com.br/feed", source: "CNN Brasil" },
    { url: "https://g1.globo.com/rss/g1/", source: "G1" },
    // --- Novos Feeds de Minas Gerais inseridos em GERAL ---
    { url: "https://g1.globo.com/rss/g1/minas-gerais/", source: "G1 Minas Gerais" },
    { url: "https://g1.globo.com/rss/g1/mg/triangulo-mineiro/", source: "G1 Triângulo" },
    { url: "https://g1.globo.com/rss/g1/mg/sul-de-minas/", source: "G1 Sul de Minas" },
    // ----------------------------------------------------
    { url: "https://www.sbtnews.com.br/rss", source: "SBT News" },
    { url: "https://www.nexojornal.com.br/rss/", source: "Nexo" },
    { url: "https://www.cartacapital.com.br/feed/", source: "Carta Capital" },
    { url: "https://www.estadao.com.br/arc/outboundfeeds/rss/category/brasil/?outputType=xml", source: "Estadão" },
  ],
  brasil: [
    { url: "https://news.google.com/rss/headlines/section/topic/POLITICS?hl=pt-BR&gl=BR&ceid=BR:pt-419", source: "Google News Brasil" },
    { url: "https://g1.globo.com/rss/g1/brasil/", source: "G1" },
    { url: "https://www.sbtnews.com.br/rss", source: "SBT News" },
    { url: "https://feeds.folha.uol.com.br/poder/rss091.xml", source: "Folha" },
    { url: "https://agenciabrasil.ebc.com.br/rss/politica/feed.xml", source: "Agência Brasil" },
    { url: "https://www.metropoles.com.br/feed", source: "Metrópoles" },
    { url: "https://www.gazetadopovo.com.br/feed/rss/republica.xml", source: "Gazeta do Povo" },
    { url: "https://portal.stf.jus.br/rss/noticias.xml", source: "STF" },
    { url: "https://www.poder360.com.br/feed/", source: "Poder360" },
  ],
  mundo: [
    { url: "https://news.google.com/rss/headlines/section/topic/WORLD?hl=pt-BR&gl=BR&ceid=BR:pt-419", source: "Google News Mundo" },
    { url: "https://g1.globo.com/rss/g1/mundo/", source: "G1" },
    { url: "https://feeds.folha.uol.com.br/mundo/rss091.xml", source: "Folha" },
    { url: "https://feeds.bbci.co.uk/portuguese/rss.xml", source: "BBC Brasil" },
    { url: "https://pt.euronews.com/rss?level=theme&name=news", source: "EuroNews" },
    { url: "https://dw.com/br/not%C3%ADcias/s-7111/rss", source: "Deutsche Welle" },
    { url: "https://www.rfi.fr/br/geral/rss", source: "RFI Brasil" },
  ],
  economia: [
    { url: "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=pt-BR&gl=BR&ceid=BR:pt-419", source: "Google News Economia" },
    { url: "https://g1.globo.com/rss/g1/economia/", source: "G1" },
    { url: "https://rss.uol.com.br/feed/economia.xml", source: "UOL" },
    { url: "https://www.infomoney.com.br/feed/", source: "InfoMoney" },
    { url: "https://neofeed.com.br/feed/", source: "NeoFeed" },
    { url: "https://valor.globo.com/rss/valor/", source: "Valor Econômico" },
    { url: "https://investnews.com.br/feed/", source: "InvestNews" },
    { url: "https://www.moneytimes.com.br/feed/", source: "Money Times" },
  ],
  tecnologia: [
    { url: "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=pt-BR&gl=BR&ceid=BR:pt-419", source: "Google News Tecnologia" },
    { url: "https://g1.globo.com/rss/g1/tecnologia/", source: "G1" },
    { url: "https://www.tecmundo.com.br/rss", source: "TecMundo" },
    { url: "https://tecnoblog.net/feed/", source: "Tecnoblog" },
    { url: "https://gizmodo.uol.com.br/feed/", source: "Gizmodo" },
    { url: "https://canaltech.com.br/rss/", source: "Canaltech" },
    { url: "https://olhardigital.com.br/feed/", source: "Olhar Digital" },
    { url: "https://www.hardware.com.br/index.php/feed/", source: "Hardware.com.br" },
  ],
  esportes: [
    { url: "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=pt-BR&gl=BR&ceid=BR:pt-419", source: "Google News Esportes" },
    { url: "https://globoesporte.globo.com/rss.xml", source: "GE" },
    { url: "https://rss.uol.com.br/feed/esporte.xml", source: "UOL" },
    { url: "https://www.espn.com.br/rss/noticias", source: "ESPN" },
    { url: "https://www.gazetaesportiva.com/feed/", source: "Gazeta Esportiva" },
    { url: "https://www.lance.com.br/rss", source: "Lance!" },
    { url: "https://maquinadoesporte.com.br/feed/", source: "Máquina do Esporte" },
  ],
  entretenimento: [
    { url: "https://portalleodias.com/category/famosos/feed/", source: "Leo Dias - Famosos" },
    { url: "https://portalleodias.com/category/televisao/feed/", source: "Leo Dias - TV" },
    { url: "https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=pt-BR&gl=BR&ceid=BR:pt-419", source: "Google News Entretenimento" },
    { url: "https://g1.globo.com/rss/g1/pop-arte/", source: "G1" },
    { url: "https://feeds.folha.uol.com.br/ilustrada/rss091.xml", source: "Folha" },
    { url: "https://www.omelete.com.br/feed/", source: "Omelete" },
    { url: "https://rollingstone.com.br/rss", source: "Rolling Stone" },
    { url: "https://catracalivre.com.br/feed/", source: "Catraca Livre" },
    { url: "https://www.adorocinema.com/rss/noticias.xml", source: "AdoroCinema" },
    { url: "https://www.papelpop.com/feed/", source: "PapelPop" },
  ],
  games: [
    { url: "https://news.google.com/rss/search?q=games&hl=pt-BR&gl=BR&ceid=BR:pt-419", source: "Google News Games" },
    { url: "https://br.ign.com/feed.xml", source: "IGN Brasil" },
    { url: "https://www.theenemy.com.br/feed", source: "The Enemy" },
    { url: "https://gamespot.com.br/feed/", source: "GameSpot BR" },
    { url: "https://meups.com.br/feed/", source: "MeuPlayStation" },
    { url: "https://www.voxel.com.br/rss", source: "Voxel" },
    { url: "https://www.eurogamer.pt/feed", source: "Eurogamer PT" },
  ],
  saude: [
    { url: "https://news.google.com/rss/headlines/section/topic/HEALTH?hl=pt-BR&gl=BR&ceid=BR:pt-419", source: "Google News Saúde" },
    { url: "https://g1.globo.com/rss/g1/bemestar/", source: "G1 Bem Estar" },
    { url: "https://saude.abril.com.br/feed/", source: "Veja Saúde" },
    { url: "https://agenciabrasil.ebc.com.br/rss/saude/feed.xml", source: "Agência Brasil Saude" },
    { url: "https://pmsaude.com.br/feed/", source: "Portal Minha Saúde" },
    { url: "https://drauziovarella.uol.com.br/feed/", source: "Drauzio Varella" },
  ]
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
        pubDate: new Date(pubDateStr).toISOString(),
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
      const key = item.link.replace(/^https?:\/\//, '').replace(/\/$/, '');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 50); // Aumentado para 50 para comportar as novas fontes no Geral
}

// --- Route Handler Principal ---

export async function GET() {
  try {
    const categoriesKeys = Object.keys(RSS_FEEDS) as Array<keyof typeof RSS_FEEDS>;
    const results = await Promise.all(categoriesKeys.map(cat => fetchCategoryFeeds(cat)));

    const feedMap: any = {};
    categoriesKeys.forEach((key, index) => {
      feedMap[key] = results[index];
    });

    const feedData: RSSFeed = {
      title: "Portal de Notícias Global",
      description: "Agregador de Notícias Multi-fontes",
      link: "/",
      items: feedMap.geral, // Notícias de MG aparecem aqui agora
      categories: {
        brasil: feedMap.brasil,
        mundo: feedMap.mundo,
        economia: feedMap.economia,
        tecnologia: feedMap.tecnologia,
        esportes: feedMap.esportes,
        entretenimento: feedMap.entretenimento,
        games: feedMap.games,
        saude: feedMap.saude,
      },
      lastBuildDate: new Date().toISOString(),
    };

    return NextResponse.json(feedData, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": `s-maxage=${REVALIDATE_TIME}, stale-while-revalidate=60`
      },
    });
  } catch (error) {
    console.error("Erro Geral no Feed:", error);
    return NextResponse.json({ error: "Erro ao processar feeds" }, { status: 500 });
  }
}