/**
 * navigation.js
 * ---------------------------------------------------------------------------
 * Wires up the app shell chrome that appears on every page: the navbar
 * avatar, the notification bell, and active-state sync across the top
 * navbar, desktop sidebar, and mobile bottom nav. Page-specific content
 * (e.g. the dashboard's stat cards) is handled by that page's own module.
 * ---------------------------------------------------------------------------
 */

import { getPatient, getUnreadNotificationCount } from './services/api.js';
import { createInitialsAvatar } from './ui.js';
import { qs, qsAll } from './helpers.js';
import { routes } from './routes.js';

/** Hydrates the top navbar avatar with the current patient's initials. */
async function renderNavbarAvatar() {
  const mount = qs('[data-navbar-avatar]');
  if (!mount) return;
  const patient = await getPatient();
  mount.setAttribute('aria-label', `${patient.firstName} ${patient.lastName}'s profile`);
  mount.appendChild(createInitialsAvatar(patient.initials, 40, 15));
}

/**
 * Routes the notification bell to the Notifications page and shows/hides
 * its badge dot based on the real unread count, so the bell reflects
 * actual state on every page rather than always displaying a static dot.
 */
async function initNotificationBell() {
  const bell = qs('[data-notif-bell]');
  if (!bell) return;
  bell.addEventListener('click', () => {
    window.location.href = routes.notifications;
  });

  const dot = bell.querySelector('.badge-dot');
  if (dot) {
    const unreadCount = await getUnreadNotificationCount();
    dot.hidden = unreadCount === 0;
  }
}

/** Routes the navbar's gear icon to the Settings page. */
function initSettingsShortcut() {
  const gear = qs('[data-settings-shortcut]');
  if (!gear) return;
  gear.addEventListener('click', () => {
    window.location.href = routes.settings;
  });
}

/**
 * Marks the correct link/button as active everywhere the current page is
 * represented — top navbar, desktop sidebar, and mobile bottom nav all key
 * off the same `data-nav-link` value and `<body data-page>` attribute.
 */
function syncActiveNav() {
  const currentPage = (document.body.dataset.page || '').toLowerCase();
  qsAll('[data-nav-link]').forEach((link) => {
    const target = (link.dataset.navLink || '').toLowerCase();
    link.classList.toggle('active', target === currentPage);
  });
}

/**
 * Resolves every `[data-route]` element's `href` from the shared routes
 * config (routes.js), so a page path only ever needs to be typed in one
 * place. The markup keeps a real `href` too (pointing at the same page)
 * purely as a static fallback if JS fails to load — this just guarantees
 * both agree with the single source of truth.
 */
function resolveDataRoutes() {
  qsAll('[data-route]').forEach((el) => {
    const target = routes[el.dataset.route];
    if (target) el.setAttribute('href', target);
  });
}

/** Entry point, called once per page on DOMContentLoaded. */
export function initNavigation() {
  renderNavbarAvatar();
  initNotificationBell();
  initSettingsShortcut();
  syncActiveNav();
  resolveDataRoutes();
}
