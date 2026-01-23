"use client";

export function NewsSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Featured skeleton */}
      <div className="mb-8">
        <div className="aspect-[16/9] rounded-lg bg-muted" />
      </div>

      {/* Grid skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 h-6 w-32 rounded bg-muted" />
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg bg-card">
                <div className="aspect-[16/10] bg-muted" />
                <div className="p-4">
                  <div className="mb-2 flex gap-2">
                    <div className="h-4 w-12 rounded bg-muted" />
                    <div className="h-4 w-16 rounded bg-muted" />
                  </div>
                  <div className="mb-2 h-5 w-full rounded bg-muted" />
                  <div className="h-5 w-3/4 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="rounded-lg bg-card p-4">
          <div className="mb-4 h-6 w-32 rounded bg-muted" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 border-b border-border py-3">
              <div className="h-20 w-28 flex-shrink-0 rounded bg-muted" />
              <div className="flex-1">
                <div className="mb-2 flex gap-2">
                  <div className="h-3 w-10 rounded bg-muted" />
                  <div className="h-3 w-12 rounded bg-muted" />
                </div>
                <div className="mb-1 h-4 w-full rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TickerSkeleton() {
  return (
    <div className="flex animate-pulse gap-8 py-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-4 w-48 rounded bg-muted" />
      ))}
    </div>
  );
}
