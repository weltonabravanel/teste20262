"use client";

import { useState } from "react";
import type { RSSItem } from "@/app/api/rss/route";
import { NewsCard } from "./news-card";
import {
  Globe2,
  Landmark,
  TrendingUp,
  Smartphone,
  Trophy,
  Clapperboard,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  categories: {
    brasil: RSSItem[];
    mundo: RSSItem[];
    economia: RSSItem[];
    tecnologia: RSSItem[];
    esportes: RSSItem[];
    entretenimento: RSSItem[];
  };
}

const tabConfig = [
  { key: "brasil", label: "Brasil", icon: Landmark, color: "text-emerald-600", bgColor: "bg-emerald-600" },
  { key: "mundo", label: "Mundo", icon: Globe2, color: "text-blue-600", bgColor: "bg-blue-600" },
  { key: "economia", label: "Economia", icon: TrendingUp, color: "text-amber-600", bgColor: "bg-amber-600" },
  { key: "tecnologia", label: "Tecnologia", icon: Smartphone, color: "text-violet-600", bgColor: "bg-violet-600" },
  { key: "esportes", label: "Esportes", icon: Trophy, color: "text-green-600", bgColor: "bg-green-600" },
  { key: "entretenimento", label: "Entretenimento", icon: Clapperboard, color: "text-pink-600", bgColor: "bg-pink-600" },
] as const;

export function CategoryTabs({ categories }: CategoryTabsProps) {
  const [activeTab, setActiveTab] = useState<keyof typeof categories>("brasil");

  const currentItems = categories[activeTab] || [];
  const currentConfig = tabConfig.find((t) => t.key === activeTab);
  const Icon = currentConfig?.icon || Newspaper;

  return (
    <section className="mb-8">
      {/* Tabs Navigation */}
      <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-border pb-4">
        {tabConfig.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all",
                isActive
                  ? `${tab.bgColor} text-white shadow-md`
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <TabIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-6 w-6", currentConfig?.color)} />
          <h2 className="font-serif text-2xl font-bold">{currentConfig?.label}</h2>
        </div>
        <span className={cn("rounded-full px-3 py-1 text-xs font-bold text-white", currentConfig?.bgColor)}>
          {currentItems.length} noticias
        </span>
      </div>

      {/* Content Grid */}
      {currentItems.length > 0 ? (
        <div className="grid gap-4">
          {/* Featured Row */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Main Featured */}
            <div className="lg:col-span-2">
              {currentItems[0] && <NewsCard item={currentItems[0]} variant="featured" />}
            </div>

            {/* Secondary Featured */}
            <div className="flex flex-col gap-4">
              {currentItems.slice(1, 3).map((item, index) => (
                <NewsCard key={`featured-${item.link}-${index}`} item={item} variant="medium" />
              ))}
            </div>
          </div>

          {/* News Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {currentItems.slice(3, 11).map((item, index) => (
              <article
                key={`grid-${item.link}-${index}`}
                className="group rounded-lg bg-card p-3 shadow-sm transition-all hover:shadow-md"
              >
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="relative mb-3 aspect-video overflow-hidden rounded">
                    <img
                      src={
                        item.imageUrl ||
                        `https://picsum.photos/seed/${encodeURIComponent(item.title.substring(0, 15)) || "/placeholder.svg"}/400/225`
                      }
                      alt=""
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(item.title.substring(0, 15))}/400/225`;
                      }}
                    />
                  </div>
                  {item.source && (
                    <span className={cn("mb-1 block text-[10px] font-bold", currentConfig?.color)}>
                      {item.source}
                    </span>
                  )}
                  <h3 className="line-clamp-3 text-sm font-semibold leading-tight text-card-foreground transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                </a>
              </article>
            ))}
          </div>

          {/* Additional News List */}
          {currentItems.length > 11 && (
            <div className="mt-4 rounded-lg bg-card p-4 shadow-sm">
              <h3 className="mb-3 font-semibold text-card-foreground">Mais noticias</h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {currentItems.slice(11).map((item, index) => (
                  <a
                    key={`more-${item.link}-${index}`}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2 rounded p-2 transition-colors hover:bg-muted"
                  >
                    <span className={cn("mt-1 h-2 w-2 flex-shrink-0 rounded-full", currentConfig?.bgColor)} />
                    <span className="line-clamp-2 text-sm text-card-foreground transition-colors group-hover:text-primary">
                      {item.title}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-lg bg-muted p-8">
          <p className="text-muted-foreground">Nenhuma noticia encontrada nesta categoria.</p>
        </div>
      )}
    </section>
  );
}
