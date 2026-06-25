/**
 * Formats a date/time to a 12-hour system string.
 * @param {string|Date} dateInput
 * @param {string} locale - 'ar' or 'en'
 * @returns {string} e.g. "21/05/2026 9:50 مساءً" or "21/05/2026 9:50 PM"
 */
export const formatDateTime12h = (dateInput, locale = 'en') => {
  if (!dateInput) return '—';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return dateInput;

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');

    let period = '';
    const isAr = locale === 'ar';
    if (isAr) {
      if (hours === 0) {
        hours = 12;
        period = 'منتصف الليل';
      } else if (hours === 12) {
        period = 'ظهرًا';
      } else if (hours > 12) {
        hours = hours - 12;
        period = 'مساءً';
      } else {
        period = 'صباحًا';
      }
    } else {
      period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      if (hours === 0) hours = 12;
    }

    return `${day}/${month}/${year} ${hours}:${minutes} ${period}`;
  } catch (e) {
    return dateInput;
  }
};

/**
 * Formats time only to a 12-hour system string.
 * @param {string|Date} dateInput
 * @param {string} locale - 'ar' or 'en'
 * @returns {string} e.g. "9:50 مساءً" or "9:50 PM"
 */
export const formatTimeOnly12h = (dateInput, locale = 'en') => {
  if (!dateInput) return '—';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return dateInput;

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');

    let period = '';
    const isAr = locale === 'ar';
    if (isAr) {
      if (hours === 0) {
        hours = 12;
        period = 'منتصف الليل';
      } else if (hours === 12) {
        period = 'ظهرًا';
      } else if (hours > 12) {
        hours = hours - 12;
        period = 'مساءً';
      } else {
        period = 'صباحًا';
      }
    } else {
      period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      if (hours === 0) hours = 12;
    }

    return `${hours}:${minutes} ${period}`;
  } catch (e) {
    return dateInput;
  }
};
