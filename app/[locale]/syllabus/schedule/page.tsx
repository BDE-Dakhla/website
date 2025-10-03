import { ROOMS, SAMPLE_EVENTS, Timetable } from './schedule'

export default function Page() {
  return (
    <div className='flex h-full min-h-0 lg:space-x-5'>
      <Timetable events={SAMPLE_EVENTS} rooms={ROOMS} />
    </div>
  )
}
