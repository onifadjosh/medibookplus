/**
 * helpers.js
 * ---------------------------------------------------------------------------
 * Small, pure, dependency-free utility functions reused across every page
 * and module. Nothing here touches the DOM's *content* (see ui.js /
 * components.js for that) — these are formatting and data-shaping helpers.
 * ---------------------------------------------------------------------------
 */

/** Shorthand for document.querySelector, optionally scoped to a parent. */
export const qs = (selector, scope = document) => scope.querySelector(selector);

/** Shorthand for document.querySelectorAll, returned as a real array. */
export const qsAll = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/**
 * Formats a Date (or date-parsable string) as "Mon DD, YYYY".
 * @param {Date | string} input
 * @returns {string}
 */
export function formatDate(input) {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return String(input);
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

/**
 * Formats a Date (or date-parsable string) as "H:MM AM/PM".
 * @param {Date | string} input
 * @returns {string}
 */
export function formatTime(input) {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return String(input);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/**
 * Debounces a function so it only runs after `wait` ms of silence —
 * ready for the search bar / filter inputs on later pages.
 * @param {Function} fn
 * @param {number} wait
 * @returns {Function}
 */
export function debounce(fn, wait = 250) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), wait);
  };
}

/**
 * Builds the data needed to render a mini week-strip calendar aligned to a
 * reference date's actual weekday, with a given set of days marked (e.g.
 * has an appointment). The sidebar widget shows one calendar week, so the
 * window is sized by weekday position rather than a fixed centered range.
 * @param {Date} referenceDate - the date to treat as "today" for the widget.
 * @param {number[]} markedDays - day-of-month numbers to flag as "marked".
 * @returns {{ month: string, days: Array<{ label: number, state?: string }> }}
 */
export function buildMiniCalendar(referenceDate, markedDays = []) {
  const month = referenceDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = referenceDate.getDate();
  const weekday = referenceDate.getDay(); // 0 (Sun) - 6 (Sat)
  const startOfWeek = today - weekday;

  const days = Array.from({ length: 7 }, (_, i) => {
    const label = startOfWeek + i;
    if (label === today) return { label, state: 'today' };
    if (markedDays.includes(label)) return { label, state: 'marked' };
    return { label };
  });
  return { month, days };
}

/**
 * Escapes text before it's interpolated into an HTML template string,
 * preventing accidental markup/script injection from dynamic data.
 * @param {string} value
 * @returns {string}
 */
export function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value ?? '';
  return div.innerHTML;
}

/**
 * Builds the pure grid structure for a full month calendar — weekday
 * alignment and in-month/out-of-month flags only. Callers decorate cells
 * with availability/selection state (that's business logic, not layout).
 * @param {number} year
 * @param {number} monthIndex - 0-11
 * @returns {{ monthLabel: string, cells: Array<{ day: number|null, date: Date|null }> }}
 */
export function buildMonthCalendar(year, monthIndex) {
  const monthLabel = new Date(year, monthIndex, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = new Date(year, monthIndex, 1).getDay(); // 0 (Sun) - 6 (Sat)

  const cells = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push({ day: null, date: null });
  for (let day = 1; day <= daysInMonth; day += 1) cells.push({ day, date: new Date(year, monthIndex, day) });

  return { monthLabel, cells };
}

/**
 * Formats a Date (or date-parsable string) as "Mon YYYY" — used for the
 * Digital Patient Card's Registered/Expires dates.
 * @param {Date | string} input
 * @returns {string}
 */
export function formatMonthYear(input) {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return String(input);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Formats a message/conversation timestamp the way chat apps typically do:
 * a bare time ("9:12 AM") if it's the same day as `referenceDate`,
 * otherwise a short date ("Oct 20").
 * @param {Date | string} input
 * @param {Date} referenceDate - the date to treat as "today".
 * @returns {string}
 */
export function formatConversationTime(input, referenceDate) {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return String(input);
  const isSameDay =
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth() &&
    date.getDate() === referenceDate.getDate();
  return isSameDay
    ? date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Generates a mock booking reference number, e.g. "MB-48213". Only used
 * client-side as a placeholder before a real backend assigns one.
 * @returns {string}
 */
export function generateReferenceNumber() {
  return `MB-${Math.floor(10000 + Math.random() * 90000)}`;
}
