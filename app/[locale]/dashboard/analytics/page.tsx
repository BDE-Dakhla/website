'use client'

import { useState } from 'react'
import { AnalyticsOverview } from '@/components/analytics/analytics-overview'
import { CurrentVisitorsBadge } from '@/components/analytics/current-visitors'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { AnalyticsTopList } from '@/components/analytics/top-list'

type Range = '3h' | '6h' | '12h' | '24h' | '7d' | '30d' | '90d' | '6mo' | '1y'

export default function Page() {
  const [range, setRange] = useState<Range>('24h')

  return (
    <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
      <div className='px-4 lg:px-6'>
        <CurrentVisitorsBadge />
      </div>
      <AnalyticsOverview range={range} />
      <div className='px-4 lg:px-6'>
        <ChartAreaInteractive range={range} onRangeChange={(r) => setRange(r)} />
      </div>
      <div className='grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6'>
        <div>
          <AnalyticsTopList kind='browsers' range={range} title='Browsers' />
        </div>
        <div>
          <AnalyticsTopList kind='os' range={range} title='OS' />
        </div>
        <div>
          <AnalyticsTopList kind='devices' range={range} title='Devices' />
        </div>
      </div>
    </div>
  )
}
