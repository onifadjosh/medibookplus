/**
 * routes.js
 * ---------------------------------------------------------------------------
 * Single source of truth for internal page paths. Every page lives in
 * pages/, so a link from one page to another is always just a bare
 * filename — this module exists so that filename is written in exactly
 * one place instead of being retyped (and potentially mistyped) in every
 * `<a href>` and `window.location.href` across the app.
 *
 * Usage:
 *   - Static links: add `data-route="appointmentHistory"` to any <a>;
 *     navigation.js resolves it to the real href on every page load.
 *   - JS-triggered navigation: `window.location.href = routes.dashboard`.
 * ---------------------------------------------------------------------------
 */

export const routes = {
  dashboard: 'dashboard.html',
  appointments: 'appointments.html',
  appointmentHistory: 'appointment-history.html',
  patientCard: 'patient-card.html',
  notifications: 'notifications.html',
  messages: 'messages.html',
  profile: 'profile.html',
  settings: 'settings.html',
};

/**
 * Builds a route path with query params, e.g.
 * buildRoute('appointments', { doctorId: 'DOC-101' }) -> "appointments.html?doctorId=DOC-101"
 * @param {keyof typeof routes} routeKey
 * @param {Record<string, string>} [params]
 * @returns {string}
 */
export function buildRoute(routeKey, params) {
  const base = routes[routeKey];
  if (!params || !Object.keys(params).length) return base;
  return `${base}?${new URLSearchParams(params).toString()}`;
}
