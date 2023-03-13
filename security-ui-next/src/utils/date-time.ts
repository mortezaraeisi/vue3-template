// import PersianDate from 'persian-date/dist/persian-date.js';
import { persianify } from './persianify';

export function currentDate(dt: Date | string = new Date()) {
  const dateValue = typeof dt === 'string' ? new Date(dt) : dt;
  return persianify(dateValue.toLocaleDateString('fa-ir', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  }));
}

export function currentTime(dt: Date | string = new Date()) {
  const dateValue = typeof dt === 'string' ? new Date(dt) : dt;
  return persianify(dateValue.toLocaleTimeString('fa-ir', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }));
}

export function currentDateTime(dt: Date | string = new Date()) {
  const dateValue = typeof dt === 'string' ? new Date(dt) : dt;
  return persianify(dateValue.toLocaleString('fa-ir', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }));
}

// export function convertToGregorian(datetime: string, separator = ' ') {
//   const s = datetime.split(separator);
//   const d = s[0].split('/').map(Number);
//   const h = s[1]?.split(':').map(Number);
//   const c = new PersianDate([ ...d, ...h ]);
//   return c.toDate();
// }
