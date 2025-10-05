"use client"

import useSWR from "swr"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((r) => r.json())

export function CurrentVisitorsBadge() {
  const { data } = useSWR<{ current: number }>("/api/analytics/current", fetcher, {
    refreshInterval: 10_000,
  })

  const current = data?.current ?? 0

  if (!data) {
    return <Skeleton className="h-7 w-48 rounded-full" />
  }

  return (
    <Badge variant="outline" className="gap-2">
      <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
      {current} current visitors
    </Badge>
  )
}