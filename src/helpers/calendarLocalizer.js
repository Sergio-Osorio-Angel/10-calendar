import { dateFnsLocalizer } from 'react-big-calendar';
import { getDay, startOfWeek, parse, format } from 'date-fns'
import esEs from 'date-fns/locale/es';

const locales = {
  'es': esEs,
};

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});