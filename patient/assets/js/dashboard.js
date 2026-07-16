/**
 * dashboard.js
 * ---------------------------------------------------------------------------
 * Page controller for the Patient Dashboard. Fetches data through the
 * services/api.js boundary and renders it using the shared component
 * templates — this file owns *when* and *where* things render, not what
 * they look like (components.css/dashboard.css) or how they're built
 * (components.js).
 * ---------------------------------------------------------------------------
 */

import {
  getPatient,
  getFeaturedAppointment,
  getNextAppointmentReminder,
  getDashboardStats,
  getAppointments,
  getRecentNotifications,
} from './services/api.js';
import { createInitialsAvatar } from './ui.js';
import {
  createStatCard,
  createActionCard,
  createAppointmentRow,
  createMiniNotification,
  createMiniCalendarGrid,
  createEmptyState,
} from './components.js';
import { qs, buildMiniCalendar } from './helpers.js';
import { quickActions } from './data/quickActions.js';

/** Fixed "today" for this mock dataset (Oct 24, 2023 — a Tuesday), so the
 *  mini calendar's weekday alignment matches the approved design exactly. */
const MOCK_TODAY = new Date(2023, 9, 24);
const MOCK_MARKED_DAYS = [26];

/** Renders the hero's featured "Join Appointment" card. */
async function renderHeroAppointment() {
  const appt = await getFeaturedAppointment();
  const nameEl = qs('[data-hero-doctor-name]');
  const deptEl = qs('[data-hero-doctor-dept]');
  const dateEl = qs('[data-hero-date]');
  const timeEl = qs('[data-hero-time]');
  const avatarMount = qs('[data-hero-avatar]');

  if (nameEl) nameEl.textContent = appt.doctorName;
  if (deptEl) deptEl.textContent = appt.department;
  if (dateEl) dateEl.textContent = appt.date;
  if (timeEl) timeEl.textContent = appt.time;
  if (avatarMount) avatarMount.appendChild(createInitialsAvatar(appt.doctorInitials, 48, 16));
}

/** Populates the patient's health summary and animates the profile-completion bar. */
async function renderPatientSummary() {
  const patient = await getPatient();
  const { bloodGroup, insuranceStatus, allergies } = patient.healthSummary;

  const bloodEl = qs('[data-health-blood]');
  const insuranceEl = qs('[data-health-insurance]');
  const allergiesEl = qs('[data-health-allergies]');
  if (bloodEl) bloodEl.textContent = bloodGroup;
  if (insuranceEl) insuranceEl.textContent = insuranceStatus;
  if (allergiesEl) allergiesEl.textContent = allergies;

  const fill = qs('[data-progress-fill]');
  const valueEl = qs('[data-progress-value]');
  if (valueEl) valueEl.textContent = `${patient.profileCompletion}%`;
  if (fill) {
    fill.setAttribute('aria-hidden', 'true');
    const track = fill.closest('[role="progressbar"]');
    if (track) track.setAttribute('aria-valuenow', String(patient.profileCompletion));
    // Animate from 0 on next frame so the transition is visible on load.
    requestAnimationFrame(() => {
      fill.style.width = `${patient.profileCompletion}%`;
    });
  }
}

/** Fills the "Next Appointment" reminder banner in the hero side rail. */
async function renderNextAppointmentBanner() {
  const reminder = await getNextAppointmentReminder();
  const titleEl = qs('[data-next-appt-title]');
  const detailEl = qs('[data-next-appt-detail]');
  if (titleEl) titleEl.textContent = reminder.label;
  if (detailEl) detailEl.textContent = reminder.detail;
}

/** Builds the four quick-stat cards. */
async function renderQuickStats() {
  const mount = qs('[data-quick-stats]');
  if (!mount) return;
  const stats = await getDashboardStats();
  mount.innerHTML = stats.map(createStatCard).join('');
}

/** Builds the six quick-action shortcut cards (static config, not an API call). */
function renderQuickActions() {
  const mount = qs('[data-quick-actions]');
  if (!mount) return;
  mount.innerHTML = quickActions.map(createActionCard).join('');
}

/** Renders the "Upcoming Appointments" table body, or an empty state if none exist. */
async function renderAppointmentsTable() {
  const tbody = qs('[data-appointments-body]');
  if (!tbody) return;
  const appointments = await getAppointments();

  if (!appointments.length) {
    tbody.innerHTML = `<tr><td colspan="6">${createEmptyState({
      icon: 'bi-calendar-x',
      message: 'No upcoming appointments yet.',
      actionHtml: `<a href="appointments.html" data-route="appointments" class="mb-btn mb-btn-primary">Book an Appointment</a>`,
    })}</td></tr>`;
    return;
  }
  tbody.innerHTML = appointments.map(createAppointmentRow).join('');
}

/** Renders the sidebar's mini month calendar (see helpers.buildMiniCalendar). */
function renderMiniCalendar() {
  const monthEl = qs('[data-mini-cal-month]');
  const gridEl = qs('[data-mini-cal-grid]');
  if (!gridEl) return;

  const calendar = buildMiniCalendar(MOCK_TODAY, MOCK_MARKED_DAYS);
  if (monthEl) monthEl.textContent = calendar.month;
  gridEl.innerHTML = createMiniCalendarGrid(calendar);
}

/** Renders the sidebar's "Recent Notifications" preview list. */
async function renderSidebarNotifications() {
  const mount = qs('[data-sidebar-notifications]');
  if (!mount) return;
  const notifications = await getRecentNotifications(2);
  mount.innerHTML = notifications.length
    ? notifications.map(createMiniNotification).join('')
    : createEmptyState({ icon: 'bi-bell-slash', message: 'No new notifications.' });
}

/** Wires the "Join Appointment" and "New Appointment" CTAs. */
function initCtaButtons() {
  document.querySelectorAll('[data-cta="join-appointment"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.location.href = 'appointments.html';
    });
  });
  document.querySelectorAll('[data-cta="new-appointment"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.location.href = 'appointments.html';
    });
  });
}

/** Entry point: fetches and renders every dashboard section. */
async function initDashboard() {
  initCtaButtons();
  renderMiniCalendar();
  await Promise.all([
    renderHeroAppointment(),
    renderPatientSummary(),
    renderNextAppointmentBanner(),
    renderQuickStats(),
    renderAppointmentsTable(),
    renderSidebarNotifications(),
  ]);
  renderQuickActions();
}

document.addEventListener('DOMContentLoaded', initDashboard);
