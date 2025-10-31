'use client'

import type { TimeRange } from '@/lib/analytics/utils'
import { useState } from 'react'
import { AnalyticsOverview } from '@/components/analytics/analytics-overview'
import { VisitorsByCountry } from '@/components/analytics/countries-map'
import { CurrentVisitorsBadge } from '@/components/analytics/current-visitors'
import { AnalyticsEvents } from '@/components/analytics/events-metrics'
import { AnalyticsTopList } from '@/components/analytics/top-list'
import { ChartAreaInteractive } from '@/components/common/chart-area-interactive'

export default function Page() {
  const [range, setRange] = useState<TimeRange>('24h')

  return (
    <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
      <div className='px-4 lg:px-6'>
        <CurrentVisitorsBadge />
      </div>
      <AnalyticsOverview range={range} />
      <div className='px-4 lg:px-6'>
        <ChartAreaInteractive
          onRangeChange={(r) => setRange(r)}
          range={range}
        />
      </div>
      <div className='grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6'>
        <AnalyticsTopList kind='browsers' range={range} title='Browsers' />
        <AnalyticsTopList kind='os' range={range} title='OS' />
        <AnalyticsTopList kind='devices' range={range} title='Devices' />
      </div>
      <div className='px-4 lg:px-6'>
        <VisitorsByCountry range={range} />
      </div>
      <div className='px-4 lg:px-6'>
        <AnalyticsEvents range={range} />
      </div>
    </div>
  )
}
