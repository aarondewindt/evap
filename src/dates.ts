import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(calendar);
dayjs.extend(LocalizedFormat)
dayjs.extend(advancedFormat)
dayjs.extend(timezone)

export default dayjs;
