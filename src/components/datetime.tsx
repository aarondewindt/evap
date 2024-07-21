import dayjs from '@/dates'


export type DTProps = {
  date: Date
  format?: string
}

export const DT = ({date, format}: DTProps) => {
  return <>{dayjs(date).format(format ?? "LL")}</>
}
