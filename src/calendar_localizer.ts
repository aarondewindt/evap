import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from '@/dates'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

export const localizer = dayjsLocalizer(dayjs)


export const DnDCalendar = withDragAndDrop(Calendar)
