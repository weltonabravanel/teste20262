"use client";

import { useEffect, useState, useCallback } from "react";
import useSWR from "swr";
import { Header } from "@/components/news/header";
import { NewsTicker } from "@/components/news/news-ticker";
import { NewsCard } from "@/components/news/news-card";
import { CategorySection } from "@/components/news/category-section";
import { NewsSkeleton } from "@/components/news/skeleton";
import { ShareButtons } from "@/components/news/share-buttons"; 
import type { RSSFeed, RSSItem } from "@/app/api/rss/route";
import { 
  TrendingUp, Clock, Newspaper, Flame, Mail, Facebook, Twitter, Instagram, 
  Trophy, Map, Globe2, Coins, Cpu, FileText, PlayCircle, LayoutGrid 
} from "lucide-react";

// --- COMPONENTE: STORIES ---
function NewsStories({ items }: { items: RSSItem[] }) {
  return (
    <div className="w-full border-b border-border bg-background py-4">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {items.slice(0, 15).map((item, index) => (
            <div key={`story-${index}`} className="flex flex-shrink-0 flex-col items-center gap-1 group">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 transition-transform group-hover:scale-105 active:scale-95">
                <div className="bg-background rounded-full p-[2px]">
                  <div className="h-16 w-16 overflow-hidden rounded-full border border-border bg-muted sm:h-20 sm:w-20">
                    <img src={item.imageUrl || `https://picsum.photos/seed/${index}/200/200`} alt="" className="h-full w-full object-cover" />
                  </div>
                </div>
              </a>
              <span className="w-20 truncate text-center text-[11px] font-medium text-foreground">{item.source || "Destaque"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE: FOOTER ---
function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-card/50 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-12 text-foreground">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary p-1.5"><Newspaper className="h-6 w-6 text-primary-foreground" /></div>
              <span className="text-xl font-bold tracking-tighter">PORTAL<span className="text-primary">RSS</span></span>
            </div>
            <p className="text-sm text-muted-foreground">Sua fonte de notícias em tempo real. Tecnologia, economia, esportes e política mundial.</p>
            <div className="flex gap-4">
              <Facebook size={20} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
              <Twitter size={20} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
              <Instagram size={20} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
            </div>
          </div>
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase">Categorias</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer">Esportes</li>
              <li className="hover:text-primary cursor-pointer">Economia</li>
              <li className="hover:text-primary cursor-pointer">Tecnologia</li>
              <li className="hover:text-primary cursor-pointer">Geral</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase">Institucional</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer">Sobre Nós</li>
              <li className="hover:text-primary cursor-pointer">Privacidade</li>
              <li className="hover:text-primary cursor-pointer">Contato</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase">Newsletter</h3>
            <div className="relative">
              <input type="email" placeholder="Seu e-mail" className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
              <button className="absolute right-1 top-1 bg-primary p-1 rounded text-primary-foreground"><Mail size={16} /></button>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border/50 pt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Portal RSS. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { data, error, isLoading, mutate } = useSWR<RSSFeed>("/api/rss", fetcher, {
    refreshInterval: 300000,
    revalidateOnFocus: false,
    onSuccess: () => setLastUpdate(new Date()),
  });

  const handleRefresh = useCallback(() => mutate(), [mutate]);

  const items = data?.items || [];
  const categories = data?.categories;
  
  const featuredItem = items[0];
  const secondaryItems = items.slice(1, 4); 
  const sidebarItems = items.slice(5, 11);

  if (error) return <div className="p-10 text-center">Erro ao carregar notícias.</div>;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header lastUpdate={lastUpdate} isLoading={isLoading} onRefresh={handleRefresh} />
      {items.length > 0 && <NewsTicker items={items} />}
      {!isLoading && items.length > 0 && <NewsStories items={items} />}

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {isLoading && items.length === 0 ? <NewsSkeleton /> : (
          <>
            {/* 1. SEÇÃO PLANTÃO DE NOTÍCIAS */}
            {featuredItem && (
              <section className="mb-12">
                <div className="mb-4 flex items-center gap-2 border-b-2 border-primary pb-2 text-foreground">
                  <Flame className="h-5 w-5 text-primary" />
                  <h2 className="font-serif text-xl font-bold">Plantão de Notícias</h2>
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <NewsCard item={featuredItem} variant="featured" />
                    <div className="mt-4 px-1">
                      <ShareButtons title={featuredItem.title} url={featuredItem.link} />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    {secondaryItems.map((item, i) => (
                      <div key={i} className="bg-card p-3 rounded-lg border border-border/50 group hover:bg-muted/50 transition-colors">
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex gap-3 mb-2">
                            <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded">
                              <img src={item.imageUrl || `https://picsum.photos/seed/${i+10}/150/150`} className="h-full w-full object-cover transition-transform group-hover:scale-110" alt="" />
                            </div>
                            <div className="flex flex-1 flex-col justify-center">
                              <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">{item.source || "Geral"}</span>
                              <h3 className="text-xs font-bold line-clamp-2 text-foreground leading-tight">{item.title}</h3>
                            </div>
                        </a>
                        <ShareButtons title={item.title} url={item.link} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

           

            {/* 2. SEÇÃO DE ESPORTES */}
            {categories?.esportes && (
              <section className="mb-12">
                <div className="mb-6 flex items-center justify-between border-b-2 border-red-600 pb-2 text-foreground">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-red-600" />
                    <h2 className="font-serif text-2xl font-bold tracking-tight">Arena Esportes</h2>
                  </div>
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Cobertura completa</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {categories.esportes.slice(0, 4).map((item, i) => (
                    <div key={`sport-top-${i}`} className="flex flex-col">
                      <NewsCard item={item} variant="medium" />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categories.esportes.slice(4, 10).map((item, i) => (
                    <div key={`sport-short-${i}`} className="flex flex-col h-full">
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-muted shadow-md block w-full"
                      >
                        <img 
                          src={item.imageUrl || `https://picsum.photos/seed/sport-${i}/400/700`} 
                          alt="" 
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 p-3 w-full">
                          <div className="flex items-center gap-1.5 mb-1">
                            <PlayCircle className="h-3 w-3 text-red-500" />
                            <span className="text-[9px] font-bold text-white/80 uppercase tracking-widest">Short</span>
                          </div>
                          <h3 className="text-[11px] font-bold leading-tight text-white line-clamp-3 group-hover:text-red-400 transition-colors">
                            {item.title}
                          </h3>
                        </div>
                      </a>
                      <div className="px-1 mt-auto">
                        <ShareButtons title={item.title} url={item.link} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
 {/* --- NOVA SEÇÃO: ÚLTIMAS NOTÍCIAS (GERAL) - ANTES DE ESPORTES --- */}
            {(categories?.brasil || items.length > 0) && (
              <div className="mb-12">
                <CategorySection 
                  title="Últimas Notícias" 
                  icon={LayoutGrid} 
                  items={categories?.brasil || items.slice(0, 4)} 
                  color="#64748b" 
                  variant="grid" 
                />
              </div>
            )}
            {categories && (
              <div className="space-y-12">
                <div className="grid gap-8 xl:grid-cols-2">
                  <CategorySection title="Brasil" icon={Map} items={categories.brasil} color="#22c55e" variant="list" />
                  <CategorySection title="Mundo" icon={Globe2} items={categories.mundo} color="#3b82f6" variant="list" />
                </div>
                
                <CategorySection title="Economia" icon={Coins} items={categories.economia?.slice(0, 8)} color="#eab308" variant="grid" />
                
                {/* 3. ANÁLISE & OPINIÃO */}
                <section className="my-12">
                  <div className="mb-6 flex items-center gap-2 border-b-2 border-orange-500 pb-2 text-foreground">
                    <FileText className="h-6 w-6 text-orange-500" />
                    <h2 className="font-serif text-2xl font-bold tracking-tight">Análise & Opinião</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(categories.geral || items).slice(10, 14).map((item, i) => (
                      <div key={`opinion-${i}`} className="group flex flex-col justify-between p-5 rounded-xl border border-border bg-card hover:shadow-lg hover:border-orange-500/50 transition-all">
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="block">
                          <div className="mb-3 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.source || "Análise"}</span>
                          </div>
                          <h3 className="text-sm font-bold leading-snug text-foreground group-hover:text-orange-500 transition-colors line-clamp-3">{item.title}</h3>
                          <div className="mt-2 text-[11px] font-medium text-muted-foreground group-hover:text-foreground">Ler reflexão completa →</div>
                        </a>
                        <ShareButtons title={item.title} url={item.link} />
                      </div>
                    ))}
                  </div>
                </section>

                <CategorySection title="Tecnologia" icon={Cpu} items={categories.tecnologia} color="#a855f7" variant="grid" />
              </div>
            )}

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="mb-4 flex items-center gap-2 border-b-2 border-primary pb-2 font-bold text-foreground">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Destaques do Dia
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.slice(12, 18).map((item, i) => (
                    <div key={i} className="flex flex-col bg-card border border-border rounded-lg overflow-hidden">
                       <NewsCard item={item} variant="medium" />
                       <div className="px-3 pb-3">
                         <ShareButtons title={item.title} url={item.link} />
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              <aside>
                <div className="bg-card p-5 rounded-xl border border-border shadow-sm sticky top-24">
                  <h2 className="mb-6 flex items-center gap-2 font-bold border-b border-border/50 pb-3 text-foreground uppercase text-sm tracking-widest">
                    <Clock size={16} className="text-accent" /> 
                    Mais Recentes
                  </h2>
                  <div className="space-y-6">
                    {sidebarItems.map((item, i) => (
                      <div key={i} className="group border-b border-border/30 last:border-0 pb-4 last:pb-0">
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="block mb-2">
                          <div className="flex gap-3">
                            <span className="text-xl font-black text-muted-foreground/30 group-hover:text-primary transition-colors">0{i+1}</span>
                            <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-relaxed">
                              {item.title}
                            </div>
                          </div>
                        </a>
                        <div className="pl-8 opacity-60 group-hover:opacity-100 transition-opacity">
                            <ShareButtons title={item.title} url={item.link} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
