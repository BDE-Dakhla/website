"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { browserIconUrl, deviceIconUrl, osIconUrl } from "@/lib/brand-icons"
import { Skeleton } from "@/components/ui/skeleton"

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((r) => r.json())

type Kind = "browsers" | "os" | "devices"

export function AnalyticsTopList({ kind, range, title }: { kind: Kind; range: "7d" | "30d" | "90d"; title: string }) {
  const { data } = useSWR<{ items: { name: string; count: number; percent: number }[] }>(
    `/api/analytics/top?kind=${kind}&range=${range}`,
    fetcher,
    { refreshInterval: 60_000 },
  )

  const items = data?.items ?? []
  const isLoading = !data

  function iconFor(name: string): string {
    switch (kind) {
      case "browsers":
        return browserIconUrl(name)
      case "os":
        return osIconUrl(name)
      case "devices":
        return deviceIconUrl(name as any)
      default:
        return browserIconUrl(name)
    }
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <ul className="space-y-2">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <li key={`sk-${i}`} className="flex items-center gap-3">
                  <Skeleton className="h-[18px] w-[18px] rounded" />
                  <Skeleton className="h-4 w-40 flex-1" />
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-3 w-8 ms-2" />
                  <Skeleton className="ms-3 h-2 w-1/2" />
                </li>
              ))
            : items.map((it) => (
                <li key={`${kind}-${it.name}`} className="flex items-center gap-3">
                  <img src={iconFor(it.name)} alt={it.name} width={18} height={18} loading="lazy" referrerPolicy="no-referrer" className="shrink-0 opacity-90" />
                  <div className="flex-1 truncate text-sm">{it.name}</div>
                  <div className="text-sm tabular-nums text-muted-foreground w-16 text-right">
                    {it.count.toLocaleString()}
                  </div>
                  <div className="ms-2 w-12 text-right text-xs text-muted-foreground">{it.percent}%</div>
                  <div className="ms-3 h-2 flex-1 rounded bg-muted">
                    <div className="h-2 rounded bg-primary" style={{ width: `${it.percent}%` }} />
                  </div>
                </li>
              ))}
          {!isLoading && items.length === 0 && (
            <li className="text-sm text-muted-foreground">No data</li>
          )}
        </ul>
      </CardContent>
    </Card>
  )
}
