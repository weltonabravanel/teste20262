"use client";

import { useEffect, useState, useCallback } from "react";
import useSWR from "swr";
import { Header } from "@/components/news/header";
import { NewsTicker } from "@/components/news/news-ticker";
import { NewsCard } from "@/components/news/news-card";
import { CategoryTabs } from "@/components/news/category-tabs";
import { CategorySection, categoryConfig } from "@/components/news/category-section";
import { NewsSkeleton } from "@/components/news/skeleton";
import type { RSSFeed } from "@/app/api/rss/route";
import { TrendingUp, Clock, Newspaper, Flame } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Intervalo de atualizacao: 5 minutos
const REFRESH_INTERVAL = 5 * 60 * 1000;

export default function Home() {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const { data, error, isLoading, mutate } = useSWR<RSSFeed>("/api/rss", fetcher, {
    refreshInterval: REFRESH_INTERVAL,
    revalidateOnFocus: false,
    onSuccess: () => {
      setLastUpdate(new Date());
    },
  });

  const handleRefresh = useCallback(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    if (data) {
      setLastUpdate(new Date());
    }
  }, [data]);

  const items = data?.items || [];
  const categories = data?.categories;

  // Separa os itens para diferentes secoes
  const featuredItem = items[0];
  const secondaryItems = items.slice(1, 5);
  const sidebarItems = items.slice(5, 15);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header lastUpdate={lastUpdate} isLoading={isLoading} onRefresh={handleRefresh} />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Newspaper className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">Erro ao carregar noticias</h2>
            <p className="mb-4 text-muted-foreground">
              Nao foi possivel buscar as noticias. Tente novamente.
            </p>
            <button
              onClick={handleRefresh}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Tentar novamente
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header lastUpdate={lastUpdate} isLoading={isLoading} onRefresh={handleRefresh} />

      {/* News Ticker */}
      {items.length > 0 && <NewsTicker items={items} />}

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {isLoading && items.length === 0 ? (
          <NewsSkeleton />
        ) : (
          <>
            {/* Destaque Principal */}
            {featuredItem && (
              <section className="mb-8">
                <div className="mb-4 flex items-center gap-2 border-b-2 border-primary pb-2">
                  <Flame className="h-5 w-5 text-primary" />
                  <h2 className="font-serif text-xl font-bold">Ultimas Noticias</h2>
                </div>
                <div className="grid gap-4 lg:grid-cols-3">
                  {/* Noticia Principal */}
                  <div className="lg:col-span-2">
                    <NewsCard item={featuredItem} variant="featured" />
                  </div>

                  {/* Secundarias */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    {secondaryItems.map((item, index) => (
                      <article
                        key={`${item.link}-${index}`}
                        className="group flex gap-3 rounded-lg bg-card p-3 shadow-md transition-shadow hover:shadow-lg"
                      >
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-1 gap-3"
                        >
                          <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded">
                            <img
                              src={
                                item.imageUrl ||
                                `https://picsum.photos/seed/${encodeURIComponent(item.title.substring(0, 15)) || "/placeholder.svg"}/200/150`
                              }
                              alt=""
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(item.title.substring(0, 15))}/200/150`;
                              }}
                            />
                          </div>
                          <div className="flex flex-1 flex-col justify-center">
                            {item.source && (
                              <span className="mb-1 text-[10px] font-bold text-primary">{item.source}</span>
                            )}
                            <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-card-foreground transition-colors group-hover:text-primary">
                              {item.title}
                            </h3>
                          </div>
                        </a>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Navegacao por Abas */}
            {categories && <CategoryTabs categories={categories} />}

            {/* Secoes de Categorias em Grid */}
            {categories && (
              <div className="space-y-8">
                {/* Brasil e Mundo lado a lado em telas grandes */}
                <div className="grid gap-8 xl:grid-cols-2">
                  <CategorySection
                    title={categoryConfig.brasil.title}
                    icon={categoryConfig.brasil.icon}
                    items={categories.brasil}
                    color={categoryConfig.brasil.color}
                    variant="list"
                  />
                  <CategorySection
                    title={categoryConfig.mundo.title}
                    icon={categoryConfig.mundo.icon}
                    items={categories.mundo}
                    color={categoryConfig.mundo.color}
                    variant="list"
                  />
                </div>

                {/* Economia - Layout horizontal completo */}
                <CategorySection
                  title={categoryConfig.economia.title}
                  icon={categoryConfig.economia.icon}
                  items={categories.economia}
                  color={categoryConfig.economia.color}
                  variant="horizontal"
                />

                {/* Tecnologia - Grid */}
                <CategorySection
                  title={categoryConfig.tecnologia.title}
                  icon={categoryConfig.tecnologia.icon}
                  items={categories.tecnologia}
                  color={categoryConfig.tecnologia.color}
                  variant="grid"
                />

                {/* Esportes e Entretenimento lado a lado */}
                <div className="grid gap-8 xl:grid-cols-2">
                  <CategorySection
                    title={categoryConfig.esportes.title}
                    icon={categoryConfig.esportes.icon}
                    items={categories.esportes}
                    color={categoryConfig.esportes.color}
                    variant="list"
                  />
                  <CategorySection
                    title={categoryConfig.entretenimento.title}
                    icon={categoryConfig.entretenimento.icon}
                    items={categories.entretenimento}
                    color={categoryConfig.entretenimento.color}
                    variant="list"
                  />
                </div>
              </div>
            )}

            {/* Sidebar com Mais Recentes */}
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="mb-4 flex items-center gap-2 border-b-2 border-primary pb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h2 className="font-serif text-xl font-bold">Destaques do Dia</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.slice(0, 6).map((item, index) => (
                    <NewsCard key={`highlight-${item.link}-${index}`} item={item} variant="medium" />
                  ))}
                </div>
              </div>

              <aside>
                <div className="rounded-lg bg-card p-4 shadow-md">
                  <div className="mb-4 flex items-center gap-2 border-b-2 border-accent pb-2">
                    <Clock className="h-4 w-4 text-accent" />
                    <h2 className="font-serif text-lg font-bold text-card-foreground">Mais Recentes</h2>
                  </div>
                  <div className="space-y-0">
                    {sidebarItems.map((item, index) => (
                      <NewsCard key={`sidebar-${item.link}-${index}`} item={item} variant="small" />
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-sm text-muted-foreground">Portal RSS - Noticias agregadas de multiplas fontes</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Atualizacao automatica a cada 5 minutos | Brasil | Mundo | Economia | Tecnologia | Esportes |
            Entretenimento
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Fontes: UOL, G1, Folha, CNN Brasil, Agencia Brasil, BBC Brasil, InfoMoney, TecMundo, Tecnoblog, Canaltech,
            Olhar Digital, Lance, Omelete e mais
          </p>
        </div>
      </footer>
    </div>
  );
}
