"use client";

import { Newspaper, RefreshCw, Clock } from "lucide-react";

interface HeaderProps {
  lastUpdate: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export function Header({ lastUpdate, isLoading, onRefresh }: HeaderProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Newspaper className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">PORTAL RSS</h1>
              <p className="text-xs text-primary-foreground/80">
                Notícias em tempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right text-sm md:block">
              <p className="font-medium capitalize">
                {formatDate(new Date())}
              </p>
              {lastUpdate && (
                <p className="flex items-center justify-end gap-1 text-xs text-primary-foreground/70">
                  <Clock className="h-3 w-3" />
                  Atualizado às {formatTime(lastUpdate)}
                </p>
              )}
            </div>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-md bg-primary-foreground/20 px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/30 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Barra de navegação de categorias */}
      <nav className="border-t border-primary-foreground/20 bg-primary/90">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="flex gap-1 overflow-x-auto py-2 text-sm">
            {[
              "Destaques",
              "Brasil",
              "Mundo",
              "Economia",
              "Tecnologia",
              "Esportes",
              "Entretenimento",
            ].map((category) => (
              <li key={category}>
                <button className="whitespace-nowrap rounded px-3 py-1.5 font-medium transition-colors hover:bg-primary-foreground/20">
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
