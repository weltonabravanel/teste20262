"use client";

import { ExternalLink } from "lucide-react";
import type { RSSItem } from "@/app/api/rss/route";

interface NewsCardProps {
  item: RSSItem;
  variant?: "featured" | "medium" | "small";
}

export function NewsCard({ item, variant = "small" }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  const getSourceColor = (source?: string) => {
    switch (source) {
      case "UOL":
        return "bg-primary text-primary-foreground";
      case "G1":
        return "bg-accent text-accent-foreground";
      case "Folha":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const placeholderImage = `https://picsum.photos/seed/${encodeURIComponent(item.title.substring(0, 20))}/800/600`;

  if (variant === "featured") {
    return (
      <article className="group relative overflow-hidden rounded-lg bg-card shadow-lg transition-all hover:shadow-xl">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={item.imageUrl || placeholderImage}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = placeholderImage;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="mb-3 flex items-center gap-2">
                {item.source && (
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-bold ${getSourceColor(item.source)}`}
                  >
                    {item.source}
                  </span>
                )}
                {item.category && (
                  <span className="rounded bg-white/20 px-2 py-0.5 text-xs text-white">
                    {item.category}
                  </span>
                )}
                <span className="text-xs text-white/70">
                  {formatDate(item.pubDate)}
                </span>
              </div>
              <h2 className="mb-2 font-serif text-2xl font-bold leading-tight text-white md:text-3xl">
                {item.title}
              </h2>
              {item.description && (
                <p className="line-clamp-2 text-sm text-white/80">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        </a>
      </article>
    );
  }

  if (variant === "medium") {
    return (
      <article className="group overflow-hidden rounded-lg bg-card shadow-md transition-all hover:shadow-lg">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={item.imageUrl || placeholderImage}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = placeholderImage;
              }}
            />
          </div>
          <div className="p-4">
            <div className="mb-2 flex items-center gap-2">
              {item.source && (
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${getSourceColor(item.source)}`}
                >
                  {item.source}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDate(item.pubDate)}
              </span>
            </div>
            <h3 className="mb-2 line-clamp-3 font-serif text-lg font-bold leading-snug text-card-foreground transition-colors group-hover:text-primary">
              {item.title}
            </h3>
            {item.description && (
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {item.description}
              </p>
            )}
          </div>
        </a>
      </article>
    );
  }

  // Small variant
  return (
    <article className="group flex gap-3 border-b border-border py-3 last:border-b-0">
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 gap-3"
      >
        <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded">
          <img
            src={item.imageUrl || placeholderImage}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = placeholderImage;
            }}
          />
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-1 flex items-center gap-2">
            {item.source && (
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${getSourceColor(item.source)}`}
              >
                {item.source}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground">
              {formatDate(item.pubDate)}
            </span>
          </div>
          <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-card-foreground transition-colors group-hover:text-primary">
            {item.title}
          </h4>
        </div>
        <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </a>
    </article>
  );
}
