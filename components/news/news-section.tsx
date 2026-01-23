"use client";

import { NewsCard } from "./news-card";
import type { RSSItem } from "@/app/api/rss/route";

interface NewsSectionProps {
  title: string;
  items: RSSItem[];
  variant?: "grid" | "list";
}

export function NewsSection({ title, items, variant = "grid" }: NewsSectionProps) {
  if (items.length === 0) return null;

  if (variant === "list") {
    return (
      <section className="rounded-lg bg-card p-4 shadow-md">
        <h2 className="mb-4 border-b-2 border-primary pb-2 font-serif text-lg font-bold text-card-foreground">
          {title}
        </h2>
        <div className="space-y-0">
          {items.map((item, index) => (
            <NewsCard key={`${item.link}-${index}`} item={item} variant="small" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-4 border-l-4 border-primary pl-3 font-serif text-xl font-bold text-foreground">
        {title}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <NewsCard key={`${item.link}-${index}`} item={item} variant="medium" />
        ))}
      </div>
    </section>
  );
}
