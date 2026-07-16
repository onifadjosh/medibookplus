/**
 * appointments.js
 * ---------------------------------------------------------------------------
 * Page controller for the Appointment Booking wizard (Department -> Doctor
 * -> Date -> Time -> Review -> Success). Follows the same pattern as
 * dashboard.js: fetch through services/api.js, render with components.js
 * templates, keep all booking state local to this module.
 * ---------------------------------------------------------------------------
 */

import {
  getDepartments,
  getDoctors,
  getDoctorsByDepartment,
  getMonthAvailability,
  getTimeSlots,
  bookAppointment,
} from './services/api.js';
import { createInitialsAvatar, showToast } from './ui.js';
import {
  createDepartmentCard,
  createDoctorCard,
  createCalendarDayCell,
  createSlotChip,
  createDetailRow,
  createEmptyState,
} from './components.js';
import { qs, qsAll, buildMonthCalendar } from './helpers.js';

/** Same mock "today" used on the Dashboard, so both pages agree on what's
 *  past/current/upcoming without needing a shared runtime clock. */
const MOCK_TODAY = new Date(2023, 9, 24);

const STEPS = ['department', 'doctor', 'date', 'time', 'review'];
const STEP_META = {
  department: { eyebrow: 'Step 1 of 5', title: 'Select Department', next: 'Select Provider' },
  doctor: { eyebrow: 'Step 2 of 5', title: 'Select Your Doctor', next: 'Select Date' },
  date: { eyebrow: 'Step 3 of 5', title: 'Select Appointment Date', next: 'Select Time Slot' },
  time: { eyebrow: 'Step 4 of 5', title: 'Select Appointment Time', next: 'Review & Confirm' },
  review: { eyebrow: 'Step 5 of 5', title: 'Review & Confirm', next: null },
};

/** All booking selections live here — the single source of truth for the wizard. */
const state = {
  departmentId: null,
  departmentName: null,
  doctorId: null,
  doctor: null,
  calendarYear: MOCK_TODAY.getFullYear(),
  calendarMonth: MOCK_TODAY.getMonth(),
  selectedDate: null,
  selectedTime: null,
  selectedPeriod: null,
};

/** Fetched-once-per-selection caches, so re-rendering a step doesn't re-hit the API needlessly. */
const cache = {
  departments: null,
  doctorsByDept: {},
  availabilityKey: null,
  monthAvailability: {},
  timeSlotsKey: null,
  timeSlotSections: [],
};

/* ---------------------------------------------------------------------
 * Small date helpers (page-specific — not generic enough for helpers.js)
 * --------------------------------------------------------------------- */
const stripTime = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const isSameDate = (a, b) => a && b && stripTime(a).getTime() === stripTime(b).getTime();
const formatWeekday = (date) => date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

/* ---------------------------------------------------------------------
 * Step navigation & stepper UI
 * --------------------------------------------------------------------- */

function goToStep(stepKey) {
  qsAll('.mb-wizard-step').forEach((section) => {
    section.hidden = section.dataset.step !== stepKey;
  });

  const stepperEl = qs('[data-wizard-stepper]');
  if (stepKey === 'success') {
    stepperEl.hidden = true;
  } else {
    stepperEl.hidden = false;
    updateStepper(stepKey);
  }
  qs('#main-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateStepper(stepKey) {
  const meta = STEP_META[stepKey];
  const index = STEPS.indexOf(stepKey);
  qs('[data-stepper-eyebrow]').textContent = meta.eyebrow;
  qs('[data-stepper-title]').textContent = meta.title;
  qs('[data-stepper-meta]').textContent = meta.next ? `Next: ${meta.next}` : 'Final step';
  qs('[data-stepper-fill]').style.width = `${((index + 1) / STEPS.length) * 100}%`;
  qsAll('[data-stepper-labels] span').forEach((span, i) => span.classList.toggle('is-current', i === index));
}

function setNextEnabled(stepKey, enabled) {
  qs(`.mb-wizard-step[data-step="${stepKey}"] [data-action="next"]`)?.toggleAttribute('disabled', !enabled);
}

function resetDownstreamSelections() {
  state.selectedDate = null;
  state.selectedTime = null;
  state.selectedPeriod = null;
  state.calendarYear = MOCK_TODAY.getFullYear();
  state.calendarMonth = MOCK_TODAY.getMonth();
  cache.availabilityKey = null;
  cache.timeSlotsKey = null;
}

/* ---------------------------------------------------------------------
 * Step 1: Select Department
 * --------------------------------------------------------------------- */

async function renderDepartmentStep() {
  if (!cache.departments) cache.departments = await getDepartments();
  const mount = qs('[data-department-grid]');
  mount.innerHTML = cache.departments.map((dept) => createDepartmentCard(dept, dept.id === state.departmentId)).join('');
  setNextEnabled('department', !!state.departmentId);
}

function initDepartmentListeners() {
  qs('[data-department-grid]').addEventListener('click', (e) => {
    const card = e.target.closest('[data-department-id]');
    if (!card) return;
    const dept = cache.departments.find((d) => d.id === card.dataset.departmentId);
    if (state.departmentId !== dept.id) {
      state.departmentId = dept.id;
      state.departmentName = dept.name;
      state.doctorId = null;
      state.doctor = null;
      resetDownstreamSelections();
    }
    qsAll('[data-department-id]', card.parentElement).forEach((c) => c.classList.remove('is-selected'));
    card.classList.add('is-selected');
    setNextEnabled('department', true);
  });
}

/* ---------------------------------------------------------------------
 * Step 2: Select Doctor
 * --------------------------------------------------------------------- */

async function renderDoctorStep() {
  if (!cache.doctorsByDept[state.departmentId]) {
    cache.doctorsByDept[state.departmentId] = await getDoctorsByDepartment(state.departmentId);
  }
  const doctors = cache.doctorsByDept[state.departmentId];
  const mount = qs('[data-doctor-list]');

  if (!doctors.length) {
    mount.innerHTML = createEmptyState({ icon: 'bi-person-x', message: 'No doctors available in this department right now.' });
    setNextEnabled('doctor', false);
    return;
  }

  mount.innerHTML = doctors.map((doc) => createDoctorCard(doc, doc.id === state.doctorId)).join('');
  setNextEnabled('doctor', !!state.doctorId);
}

function initDoctorListeners() {
  qs('[data-doctor-list]').addEventListener('click', (e) => {
    const card = e.target.closest('[data-doctor-id]');
    if (!card) return;
    const doctors = cache.doctorsByDept[state.departmentId];
    const doc = doctors.find((d) => d.id === card.dataset.doctorId);
    if (state.doctorId !== doc.id) {
      state.doctorId = doc.id;
      state.doctor = doc;
      resetDownstreamSelections();
    }
    qsAll('[data-doctor-id]', card.parentElement).forEach((c) => {
      c.classList.remove('is-selected');
      const btn = c.querySelector('[data-select-doctor]');
      if (btn) btn.textContent = 'Select';
    });
    card.classList.add('is-selected');
    const selectBtn = card.querySelector('[data-select-doctor]');
    if (selectBtn) selectBtn.textContent = 'Selected';
    setNextEnabled('doctor', true);
  });
}

/* ---------------------------------------------------------------------
 * Step 3: Select Date
 * --------------------------------------------------------------------- */

async function renderDateStep() {
  const key = `${state.doctorId}-${state.calendarYear}-${state.calendarMonth}`;
  if (cache.availabilityKey !== key) {
    cache.monthAvailability = await getMonthAvailability(state.doctorId, state.calendarYear, state.calendarMonth);
    cache.availabilityKey = key;
  }

  const { monthLabel, cells } = buildMonthCalendar(state.calendarYear, state.calendarMonth);
  qs('[data-calendar-month]').textContent = monthLabel;

  qs('[data-calendar-days]').innerHTML = cells
    .map(({ day, date }) => {
      if (day === null) return createCalendarDayCell({ day: null });
      const isPast = stripTime(date) < stripTime(MOCK_TODAY);
      const slots = cache.monthAvailability[day];
      let cellState = '';
      if (isPast) cellState = 'is-past';
      else if (slots === 0) cellState = 'is-full';
      else if (isSameDate(date, state.selectedDate)) cellState = 'is-selected';
      return createCalendarDayCell({ day, state: cellState, slotsAvailable: isPast ? null : slots });
    })
    .join('');

  renderDateSummary();
  setNextEnabled('date', !!state.selectedDate);

  const isAtEarliestMonth = state.calendarYear === MOCK_TODAY.getFullYear() && state.calendarMonth === MOCK_TODAY.getMonth();
  qs('[data-action="prev-month"]')?.toggleAttribute('disabled', isAtEarliestMonth);
}

function renderDateSummary() {
  const rows = [
    { icon: 'bi-hospital', label: 'Department', value: state.departmentName || '—' },
    { icon: 'bi-person-badge', label: 'Doctor', value: state.doctor ? state.doctor.name : '—' },
    { icon: 'bi-calendar-event', label: 'Selected Date', value: state.selectedDate ? formatWeekday(state.selectedDate) : 'Not selected yet' },
  ];
  qs('[data-date-summary]').innerHTML = rows.map(createDetailRow).join('');
}

function changeMonth(delta) {
  let month = state.calendarMonth + delta;
  let year = state.calendarYear;
  if (month < 0) { month = 11; year -= 1; }
  if (month > 11) { month = 0; year += 1; }
  if (year < MOCK_TODAY.getFullYear() || (year === MOCK_TODAY.getFullYear() && month < MOCK_TODAY.getMonth())) return;
  state.calendarMonth = month;
  state.calendarYear = year;
  renderDateStep();
}

function initDateListeners() {
  qs('[data-calendar-days]').addEventListener('click', (e) => {
    const cell = e.target.closest('.mb-calendar-day');
    if (!cell || cell.classList.contains('is-empty') || cell.classList.contains('is-past') || cell.classList.contains('is-full')) return;
    const day = Number(cell.dataset.day);
    state.selectedDate = new Date(state.calendarYear, state.calendarMonth, day);
    state.selectedTime = null;
    state.selectedPeriod = null;
    cache.timeSlotsKey = null;
    renderDateStep();
  });
}

/* ---------------------------------------------------------------------
 * Step 4: Select Time
 * --------------------------------------------------------------------- */

async function renderTimeStep() {
  const dateIso = state.selectedDate.toISOString().slice(0, 10);
  const key = `${state.doctorId}-${dateIso}`;
  if (cache.timeSlotsKey !== key) {
    cache.timeSlotSections = await getTimeSlots(state.doctorId, dateIso);
    cache.timeSlotsKey = key;
  }

  qs('[data-slot-sections]').innerHTML = cache.timeSlotSections
    .map(
      (section) => `
      <div class="mb-slot-section">
        <div class="mb-slot-section__head">
          <i class="bi ${section.icon}" aria-hidden="true"></i>
          <h3>${section.label}</h3>
          <span class="range">${section.range}</span>
        </div>
        <div class="mb-slot-grid">
          ${section.slots.map((slot) => createSlotChip(slot, state.selectedTime === slot.time && state.selectedPeriod === slot.period)).join('')}
        </div>
      </div>`
    )
    .join('');

  renderTimeSummary();
  setNextEnabled('time', !!state.selectedTime);
}

function renderTimeSummary() {
  const rows = [
    { icon: 'bi-calendar-event', label: 'Date', value: state.selectedDate ? formatWeekday(state.selectedDate) : '—' },
    { icon: 'bi-clock', label: 'Time', value: state.selectedTime ? `${state.selectedTime} ${state.selectedPeriod}` : 'Not selected yet' },
    { icon: 'bi-person-badge', label: 'Provider', value: state.doctor ? state.doctor.name : '—' },
  ];
  qs('[data-time-summary]').innerHTML = rows.map(createDetailRow).join('');
}

function initTimeListeners() {
  qs('[data-slot-sections]').addEventListener('click', (e) => {
    const chip = e.target.closest('.mb-slot-chip');
    if (!chip || chip.disabled) return;
    state.selectedTime = chip.dataset.time;
    state.selectedPeriod = chip.dataset.period;
    renderTimeStep();
  });
}

/* ---------------------------------------------------------------------
 * Step 5: Review & Confirm
 * --------------------------------------------------------------------- */

function renderReviewStep() {
  const avatarMount = qs('[data-review-avatar]');
  avatarMount.innerHTML = '';
  avatarMount.appendChild(createInitialsAvatar(state.doctor.initials, 72, 22));
  qs('[data-review-doctor-name]').textContent = state.doctor.name;
  qs('[data-review-doctor-dept]').textContent = `${state.doctor.department} Specialist`;

  const rows = [
    { icon: 'bi-camera-video', label: 'Consultation Type', value: 'Video Call' },
    { icon: 'bi-calendar-event', label: 'Date', value: formatWeekday(state.selectedDate) },
    { icon: 'bi-clock', label: 'Time', value: `${state.selectedTime} ${state.selectedPeriod}` },
    { icon: 'bi-cash-coin', label: 'Consultation Fee', value: `$${state.doctor.fee.toFixed(2)}` },
  ];
  qs('[data-review-details]').innerHTML = rows.map(createDetailRow).join('');
}

async function handleConfirmBooking() {
  const btn = qs('.mb-wizard-step[data-step="review"] [data-action="confirm"]');
  const originalLabel = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Confirming...';

  try {
    const { appointment } = await bookAppointment({
      doctorId: state.doctorId,
      departmentId: state.departmentId,
      date: state.selectedDate.toISOString().slice(0, 10),
      time: `${state.selectedTime} ${state.selectedPeriod}`,
    });

    qs('[data-success-message]').innerHTML =
      `Your session with <strong>${state.doctor.name}</strong> is scheduled for ` +
      `<strong>${formatWeekday(state.selectedDate)} at ${state.selectedTime} ${state.selectedPeriod}</strong>.`;
    qs('[data-success-reference]').textContent = appointment.referenceNumber;
    goToStep('success');
  } catch (err) {
    showToast('Something went wrong confirming your appointment. Please try again.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalLabel;
  }
}

/* ---------------------------------------------------------------------
 * Success step actions
 * --------------------------------------------------------------------- */

function copyReferenceNumber() {
  const ref = qs('[data-success-reference]')?.textContent?.trim();
  if (!ref || !navigator.clipboard) return;
  navigator.clipboard.writeText(ref).then(() => showToast('Reference number copied to clipboard.', 'success'));
}

function resetWizard() {
  Object.assign(state, {
    departmentId: null, departmentName: null, doctorId: null, doctor: null,
    calendarYear: MOCK_TODAY.getFullYear(), calendarMonth: MOCK_TODAY.getMonth(),
    selectedDate: null, selectedTime: null, selectedPeriod: null,
  });
  cache.availabilityKey = null;
  cache.timeSlotsKey = null;
  renderDepartmentStep();
  goToStep('department');
}

/* ---------------------------------------------------------------------
 * Wizard-level navigation (Continue / Back buttons)
 * --------------------------------------------------------------------- */

const NEXT_HANDLERS = {
  department: () => { goToStep('doctor'); renderDoctorStep(); },
  doctor: () => { goToStep('date'); renderDateStep(); },
  date: () => { goToStep('time'); renderTimeStep(); },
  time: () => { goToStep('review'); renderReviewStep(); },
};

const BACK_HANDLERS = {
  doctor: () => goToStep('department'),
  date: () => goToStep('doctor'),
  time: () => goToStep('date'),
  review: () => goToStep('time'),
};

function initWizardActionListeners() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const stepKey = btn.closest('.mb-wizard-step')?.dataset.step;

    if (action === 'next' && NEXT_HANDLERS[stepKey]) NEXT_HANDLERS[stepKey]();
    else if (action === 'back' && BACK_HANDLERS[stepKey]) BACK_HANDLERS[stepKey]();
    else if (action === 'confirm') handleConfirmBooking();
    else if (action === 'prev-month') changeMonth(-1);
    else if (action === 'next-month') changeMonth(1);
    else if (action === 'copy-reference') copyReferenceNumber();
    else if (action === 'add-to-calendar') showToast('Added to your calendar.', 'success');
    else if (action === 'restart-booking') resetWizard();
  });
}

/* ---------------------------------------------------------------------
 * Deep-link pre-fill (Appointment History's "Reschedule" action links
 * here as appointments.html?doctorId=DOC-101 — skip straight to Date)
 * --------------------------------------------------------------------- */

async function applyDeepLinkIfPresent() {
  const doctorId = new URLSearchParams(window.location.search).get('doctorId');
  if (!doctorId) return false;

  const doctors = await getDoctors();
  const doctor = doctors.find((d) => d.id === doctorId);
  if (!doctor) return false;

  state.departmentId = doctor.departmentId;
  state.departmentName = doctor.department;
  state.doctorId = doctor.id;
  state.doctor = doctor;
  cache.doctorsByDept[doctor.departmentId] = doctors.filter((d) => d.departmentId === doctor.departmentId);

  await renderDepartmentStep(); // re-render so the matching card shows selected + Continue is enabled if the user backs out
  await renderDoctorStep(); // populate Doctor step content too, so "Back" from Date isn't empty
  showToast(`Rescheduling with ${doctor.name} — pick a new date below.`, 'info');
  goToStep('date');
  await renderDateStep();
  return true;
}

/* ---------------------------------------------------------------------
 * Init
 * --------------------------------------------------------------------- */

async function initAppointments() {
  initWizardActionListeners();
  initDepartmentListeners();
  initDoctorListeners();
  initDateListeners();
  initTimeListeners();

  // Always populate the department grid so "Back" navigation works even
  // when we deep-link straight past it (see applyDeepLinkIfPresent).
  await renderDepartmentStep();

  const deepLinked = await applyDeepLinkIfPresent();
  if (!deepLinked) goToStep('department');
}

document.addEventListener('DOMContentLoaded', initAppointments);
