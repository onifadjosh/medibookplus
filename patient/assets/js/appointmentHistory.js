/**
 * appointmentHistory.js
 * ---------------------------------------------------------------------------
 * Page controller for Appointment History. Follows the same pattern as
 * dashboard.js/appointments.js: fetch through services/api.js, render with
 * components.js templates, keep all page state local to this module.
 * ---------------------------------------------------------------------------
 */

import { getAppointmentHistory, cancelAppointment } from './services/api.js';
import { resolveStatusBadge, openModal, closeModal, showToast } from './ui.js';
import { createAppointmentHistoryRow, createDetailRow, createEmptyState } from './components.js';
import { qs, debounce } from './helpers.js';

/** Full dataset fetched once; filtering/searching happen client-side against this. */
let allAppointments = [];
let activeFilter = 'all';
let searchTerm = '';
let pendingCancelId = null;

/* ---------------------------------------------------------------------
 * Filtering + rendering
 * --------------------------------------------------------------------- */

function getFilteredAppointments() {
  return allAppointments.filter((appt) => {
    const matchesFilter = activeFilter === 'all' || appt.status === activeFilter;
    const haystack = `${appt.doctorName} ${appt.department}`.toLowerCase();
    const matchesSearch = !searchTerm || haystack.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });
}

function renderTable() {
  const results = getFilteredAppointments();
  const tbody = qs('[data-history-body]');

  tbody.innerHTML = results.length
    ? results.map(createAppointmentHistoryRow).join('')
    : `<tr><td colspan="6">${createEmptyState({ icon: 'bi-calendar-x', message: 'No appointments match your search or filter.' })}</td></tr>`;

  const countLabel = `${results.length} appointment${results.length === 1 ? '' : 's'}`;
  qs('[data-history-count]').textContent = countLabel;
}

/* ---------------------------------------------------------------------
 * Toolbar: search + filter tabs
 * --------------------------------------------------------------------- */

function initToolbar() {
  const searchInput = qs('[data-history-search]');
  searchInput.addEventListener(
    'input',
    debounce((e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      renderTable();
    }, 200)
  );

  qs('[data-history-filters]').addEventListener('click', (e) => {
    const tab = e.target.closest('.mb-filter-tab');
    if (!tab) return;
    activeFilter = tab.dataset.filter;
    qs('[data-history-filters]')
      .querySelectorAll('.mb-filter-tab')
      .forEach((t) => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
    renderTable();
  });
}

/* ---------------------------------------------------------------------
 * View Details modal
 * --------------------------------------------------------------------- */

function openDetailModal(appointment) {
  const badge = resolveStatusBadge(appointment.status);
  const rows = [
    { icon: 'bi-hash', label: 'Appointment ID', value: appointment.id },
    { icon: 'bi-person-badge', label: 'Doctor', value: appointment.doctorName },
    { icon: 'bi-hospital', label: 'Department', value: appointment.department },
    { icon: 'bi-calendar-event', label: 'Date & Time', value: `${appointment.date} at ${appointment.time}` },
  ];
  qs('[data-modal-detail-grid]').innerHTML = rows.map(createDetailRow).join('') + `
    <div class="mb-detail-row">
      <div class="mb-detail-row__icon"><i class="bi bi-info-circle" aria-hidden="true"></i></div>
      <div>
        <p class="mb-detail-row__label">Status</p>
        <span class="mb-badge ${badge.cls}">${badge.label}</span>
      </div>
    </div>`;

  const notesWrap = qs('[data-modal-notes-wrap]');
  if (appointment.notes) {
    qs('[data-modal-notes]').textContent = appointment.notes;
    notesWrap.hidden = false;
  } else {
    notesWrap.hidden = true;
  }

  openModal('appointmentDetailModal');
}

/* ---------------------------------------------------------------------
 * Cancel confirmation modal
 * --------------------------------------------------------------------- */

function openCancelModal(appointment) {
  pendingCancelId = appointment.id;
  qs('[data-cancel-modal-message]').textContent =
    `Are you sure you want to cancel your appointment with ${appointment.doctorName} on ${appointment.date} at ${appointment.time}? This cannot be undone.`;
  openModal('cancelConfirmModal');
}

async function handleConfirmCancel() {
  if (!pendingCancelId) return;
  const { success } = await cancelAppointment(pendingCancelId);
  if (success) {
    const appt = allAppointments.find((a) => a.id === pendingCancelId);
    if (appt) appt.status = 'cancelled';
    renderTable();
    showToast('Appointment cancelled.', 'success');
  } else {
    showToast('Something went wrong. Please try again.', 'error');
  }
  pendingCancelId = null;
  closeModal('cancelConfirmModal');
}

/* ---------------------------------------------------------------------
 * Row action delegation (View / Reschedule / Cancel)
 * --------------------------------------------------------------------- */

function initRowActions() {
  qs('[data-history-body]').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const row = btn.closest('[data-appointment-id]');
    const appointment = allAppointments.find((a) => a.id === row?.dataset.appointmentId);
    if (!appointment) return;

    switch (btn.dataset.action) {
      case 'view-appointment':
        openDetailModal(appointment);
        break;
      case 'reschedule-appointment':
        // Hand off to the Booking wizard, pre-selecting this doctor (see
        // appointments.js's URL-param handling) rather than duplicating
        // the date/time-picking UI on this page.
        window.location.href = `appointments.html?doctorId=${encodeURIComponent(appointment.doctorId)}`;
        break;
      case 'cancel-appointment':
        openCancelModal(appointment);
        break;
      default:
        break;
    }
  });

  qs('[data-action="confirm-cancel"]')?.addEventListener('click', handleConfirmCancel);
}

/* ---------------------------------------------------------------------
 * Init
 * --------------------------------------------------------------------- */

async function initAppointmentHistory() {
  initToolbar();
  initRowActions();
  allAppointments = await getAppointmentHistory();
  renderTable();
}

document.addEventListener('DOMContentLoaded', initAppointmentHistory);
