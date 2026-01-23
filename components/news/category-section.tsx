"use client";

import type { RSSItem } from "@/app/api/rss/route";
import { NewsCard } from "./news-card";
import { Globe2, Landmark, TrendingUp, Smartphone, Trophy, Clapperboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CategorySectionProps {
  title: string;
  icon: LucideIcon;
  items: RSSItem[];
  color?: string;
  variant?: "horizontal" | "grid" | "list";
}

const colorClasses: Record<string, { border: string; text: string; bg: string }> = {
  orange: { border: "border-primary", text: "text-primary", bg: "bg-primary" },
  red: { border: "border-accent", text: "text-accent", bg: "bg-accent" },
  blue: { border: "border-blue-600", text: "text-blue-600", bg: "bg-blue-600" },
  green: { border: "border-emerald-600", text: "text-emerald-600", bg: "bg-emerald-600" },
  purple: { border: "border-violet-600", text: "text-violet-600", bg: "bg-violet-600" },
  pink: { border: "border-pink-600", text: "text-pink-600", bg: "bg-pink-600" },
};

export function CategorySection({
  title,
  icon: Icon,
  items,
  color = "orange",
  variant = "horizontal",
}: CategorySectionProps) {
  const colors = colorClasses[color] || colorClasses.orange;

  if (items.length === 0) return null;

  const featuredItem = items[0];
  const remainingItems = items.slice(1, variant === "horizontal" ? 5 : 7);

  return (
    <section className="mb-8">
      {/* Header da Seção */}
      <div className={`mb-4 flex items-center gap-2 border-b-2 ${colors.border} pb-2`}>
        <Icon className={`h-5 w-5 ${colors.text}`} />
        <h2 className="font-serif text-xl font-bold">{title}</h2>
        <div className={`ml-auto ${colors.bg} rounded px-2 py-0.5`}>
          <span className="text-xs font-bold text-white">{items.length} notícias</span>
        </div>
      </div>

      {variant === "horizontal" && (
        <div className="grid gap-4 lg:grid-cols-5">
          {/* Destaque da categoria */}
          <div className="lg:col-span-2">
            <NewsCard item={featuredItem} variant="medium" />
          </div>

          {/* Lista lateral */}
          <div className="lg:col-span-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {remainingItems.map((item, index) => (
                <article
                  key={`${item.link}-${index}`}
                  className="group flex gap-3 rounded-lg bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
                >
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 gap-3"
                  >
                    <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded">
                      <img
                        src={
                          item.imageUrl ||
                          `https://picsum.photos/seed/${encodeURIComponent(item.title.substring(0, 15)) || "/placeholder.svg"}/200/150`
                        }
                        alt=""
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(item.title.substring(0, 15))}/200/150`;
                        }}
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      {item.source && (
                        <span className={`mb-1 text-[10px] font-bold ${colors.text}`}>
                          {item.source}
                        </span>
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
        </div>
      )}

      {variant === "grid" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.slice(0, 8).map((item, index) => (
            <NewsCard key={`${item.link}-${index}`} item={item} variant="medium" />
          ))}
        </div>
      )}

      {variant === "list" && (
        <div className="rounded-lg bg-card p-4 shadow-md">
          <div className="space-y-0">
            {items.slice(0, 6).map((item, index) => (
              <NewsCard key={`${item.link}-${index}`} item={item} variant="small" />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// Configuração das categorias para exportação
export const categoryConfig = {
  brasil: {
    title: "Brasil",
    icon: Landmark,
    color: "green",
  },
  mundo: {
    title: "Mundo",
    icon: Globe2,
    color: "blue",
  },
  economia: {
    title: "Economia",
    icon: TrendingUp,
    color: "orange",
  },
  tecnologia: {
    title: "Tecnologia",
    icon: Smartphone,
    color: "purple",
  },
  esportes: {
    title: "Esportes",
    icon: Trophy,
    color: "green",
  },
  entretenimento: {
    title: "Entretenimento",
    icon: Clapperboard,
    color: "pink",
  },
} as const;
