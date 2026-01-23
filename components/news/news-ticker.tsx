"use client";

import { Zap } from "lucide-react";
import type { RSSItem } from "@/app/api/rss/route";

interface NewsTickerProps {
  items: RSSItem[];
}

export function NewsTicker({ items }: NewsTickerProps) {
  if (items.length === 0) return null;

  // Duplicamos os itens para criar o efeito infinito
  const tickerItems = [...items.slice(0, 10), ...items.slice(0, 10)];

  return (
    <div className="overflow-hidden border-y border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center">
        <div className="flex items-center gap-2 bg-accent px-4 py-2 text-accent-foreground">
          <Zap className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Últimas
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div className="animate-ticker flex whitespace-nowrap py-2">
            {tickerItems.map((item, index) => (
              <a
                key={`${item.link}-${index}`}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-8 inline-flex items-center gap-2 text-sm text-card-foreground transition-colors hover:text-primary"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="font-medium">{item.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
