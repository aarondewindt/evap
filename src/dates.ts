import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(calendar);
dayjs.extend(LocalizedFormat)
dayjs.extend(advancedFormat)

export default dayjs;
