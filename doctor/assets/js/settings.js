/* ==========================================================================
   MediBook+ | Settings Module
   Vanilla JS interactions only. No backend calls — all data is local/dummy
   and stands in for future API integration.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initActiveNavSync();
  initButtonPressFeedback();
  initGlobalSearch();
  initNewSessionAction();
  initAvailabilityToggles();
  initScheduleViewToggle();
  initHolidayActions();
  initPhotoEditActions();
  initSaveChanges();
  initDiscardChanges();
  initPrintSchedule();
  renderHolidayList();
  renderScheduleGrid();
});

/* ---------------------------------------------------------------------------
   Dummy data — stands in for a future backend/API response.
--------------------------------------------------------------------------- */
const SETTINGS_DATA = {
  doctor: {
    name: 'Dr. James Wilson',
    role: 'Senior Cardiologist',
  },
  notifications: { unreadCount: 3 },
  holidays: [
    { name: 'Labor Day', date: 'Sep 07, 2026' },
    { name: 'Thanksgiving Day', date: 'Nov 26, 2026' },
    { name: 'Christmas Day', date: 'Dec 25, 2026' },
  ],
  /* Schedule grid runs 08:00–18:00 across Mon–Sun (rows are 1-hour each). */
  scheduleHours: { start: 8, end: 18 },
  scheduleDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  todayDayIndex: 0, // Monday — used only to highlight a column, matches dummy "today"
  scheduleBlocks: [
    { day: 0, start: 8, end: 12, type: 'available', label: 'Clinic Consultation' },
    { day: 0, start: 12, end: 13, type: 'break', label: 'Lunch Break' },
    { day: 0, start: 13, end: 17, type: 'available', label: 'Clinic Consultation' },

    { day: 1, start: 8, end: 10, type: 'available', label: 'Telemedicine' },
    { day: 1, start: 10, end: 12, type: 'available', label: 'Clinic Consultation' },
    { day: 1, start: 12, end: 13, type: 'break', label: 'Lunch Break' },
    { day: 1, start: 13, end: 16, type: 'available', label: 'Clinic Consultation' },

    { day: 2, start: 8, end: 10, type: 'available', label: 'Clinic Consultation' },
    { day: 2, start: 10, end: 12, type: 'busy', label: 'Surgery Prep' },
    { day: 2, start: 12, end: 13, type: 'break', label: 'Lunch Break' },
    { day: 2, start: 13, end: 17, type: 'available', label: 'Telemedicine' },

    { day: 3, start: 8, end: 12, type: 'available', label: 'Clinic Consultation' },
    { day: 3, start: 12, end: 13, type: 'break', label: 'Lunch Break' },
    { day: 3, start: 13, end: 17, type: 'available', label: 'Clinic Consultation' },

    { day: 4, start: 8, end: 11, type: 'available', label: 'Telemedicine' },
    { day: 4, start: 11, end: 12, type: 'available', label: 'Clinic Consultation' },
    { day: 4, start: 12, end: 13, type: 'break', label: 'Lunch Break' },
    { day: 4, start: 13, end: 15, type: 'available', label: 'Clinic Consultation' },
    { day: 4, start: 15, end: 18, type: 'vacation', label: 'Planned Time Off' },
  ],
};

const BLOCK_TYPE_LABELS = {
  available: 'Available',
  busy: 'Busy',
  break: 'Break',
  vacation: 'Vacation',
};

/* ---------------------------------------------------------------------------
   Utility: show a bottom-right toast with a given message
--------------------------------------------------------------------------- */
function showAppToast(message) {
  const toastEl = document.getElementById('appToast');
  const toastBody = document.getElementById('appToastBody');
  if (!toastEl || !toastBody) return;

  toastBody.textContent = message;
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3200 });
  toast.show();
}

/* ---------------------------------------------------------------------------
   Shared init helpers (established dashboard pattern, reused per-page)
--------------------------------------------------------------------------- */
function initActiveNavSync() {
  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (link.getAttribute('href') === '#') event.preventDefault();

      const targetKey = link.getAttribute('data-nav');
      document.querySelectorAll('[data-nav]').forEach((otherLink) => {
        otherLink.classList.toggle('active', otherLink.getAttribute('data-nav') === targetKey);
      });

      const offcanvasEl = document.getElementById('mobileSidebar');
      if (offcanvasEl) {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (offcanvasInstance) offcanvasInstance.hide();
      }
    });
  });
}

function initButtonPressFeedback() {
  document.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('mousedown', () => btn.classList.add('btn-press'));
    ['mouseup', 'mouseleave'].forEach((evt) =>
      btn.addEventListener(evt, () => btn.classList.remove('btn-press'))
    );
  });
}

function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearch');
  if (!searchInput) return;

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && searchInput.value.trim().length > 0) {
      event.preventDefault();
      showAppToast(`Searching for "${searchInput.value.trim()}"...`);
    }
  });
}

function initNewSessionAction() {
  const desktopBtn = document.getElementById('newSessionBtn');
  const mobileBtn = document.getElementById('mobileNewSessionBtn');

  [desktopBtn, mobileBtn].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', () => showAppToast('Starting a new patient session...'));
  });
}

/* ---------------------------------------------------------------------------
   Availability & Vacation Mode toggles
--------------------------------------------------------------------------- */
function initAvailabilityToggles() {
  document.querySelectorAll('.settings-switch .form-check-input').forEach((toggle) => {
    toggle.addEventListener('change', () => {
      const name = toggle.getAttribute('data-toggle-name') || 'Setting';
      const state = toggle.checked ? 'enabled' : 'disabled';
      showAppToast(`${name} ${state}.`);
    });
  });
}

/* ---------------------------------------------------------------------------
   Weekly / Monthly schedule view toggle (mirrors Dashboard's Queue/Calendar
   segmented control — Monthly is a placeholder for a future view).
--------------------------------------------------------------------------- */
function initScheduleViewToggle() {
  const buttons = document.querySelectorAll('[data-schedule-view]');
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      if (btn.getAttribute('data-schedule-view') === 'monthly') {
        showAppToast('Monthly view is coming soon for this workspace.');
      }
    });
  });
}

/* ---------------------------------------------------------------------------
   Render the weekly schedule grid from SETTINGS_DATA.scheduleBlocks
--------------------------------------------------------------------------- */
function renderScheduleGrid() {
  const grid = document.getElementById('scheduleGrid');
  if (!grid) return;

  const { start, end } = SETTINGS_DATA.scheduleHours;
  const totalHours = end - start;
  const dayCount = SETTINGS_DATA.scheduleDays.length;

  grid.style.gridTemplateRows = `40px repeat(${totalHours}, 44px)`;

  let html = '<div class="schedule-grid-corner"></div>';

  // Day headers (row 1, columns 2..8)
  SETTINGS_DATA.scheduleDays.forEach((day, index) => {
    const isToday = index === SETTINGS_DATA.todayDayIndex;
    html += `
      <div class="schedule-day-header${isToday ? ' schedule-day-header-today' : ''}" style="grid-column: ${index + 2};">
        ${day}
      </div>
    `;
  });

  // Time labels (column 1, rows 2..N)
  for (let hour = start; hour < end; hour += 1) {
    const rowIndex = hour - start + 2;
    html += `
      <div class="schedule-time-label" style="grid-row: ${rowIndex};">
        ${formatHourLabel(hour)}
      </div>
    `;
  }

  // Empty background cells for the full grid (so unscheduled hours still show gridlines)
  for (let hour = start; hour < end; hour += 1) {
    const rowIndex = hour - start + 2;
    for (let dayIndex = 0; dayIndex < dayCount; dayIndex += 1) {
      html += `<div class="schedule-cell" style="grid-column: ${dayIndex + 2}; grid-row: ${rowIndex};"></div>`;
    }
  }

  // Scheduled blocks, positioned by day column + hour row span
  SETTINGS_DATA.scheduleBlocks.forEach((block) => {
    const rowStart = block.start - start + 2;
    const rowEnd = block.end - start + 2;
    const column = block.day + 2;

    html += `
      <div class="schedule-block schedule-block-${block.type}"
           style="grid-column: ${column}; grid-row: ${rowStart} / ${rowEnd};"
           title="${BLOCK_TYPE_LABELS[block.type]}: ${block.label}">
        <span>${block.label}</span>
        <span class="schedule-block-time">${formatHourLabel(block.start)}–${formatHourLabel(block.end)}</span>
      </div>
    `;
  });

  grid.innerHTML = html;
}

function formatHourLabel(hour24) {
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:00 ${period}`;
}

/* ---------------------------------------------------------------------------
   Render holiday list
--------------------------------------------------------------------------- */
function renderHolidayList() {
  const listEl = document.getElementById('holidayList');
  if (!listEl) return;

  listEl.innerHTML = SETTINGS_DATA.holidays
    .map(
      (holiday) => `
      <li class="holiday-item">
        <p class="holiday-item-name">${holiday.name}</p>
        <span class="holiday-item-date">${holiday.date}</span>
      </li>
    `
    )
    .join('');
}

function initHolidayActions() {
  const manageBtn = document.getElementById('manageHolidaysBtn');
  if (!manageBtn) return;

  manageBtn.addEventListener('click', () => {
    showAppToast('Holiday management is not available in this preview.');
  });
}

/* ---------------------------------------------------------------------------
   Profile photo edit (dummy — no real upload)
--------------------------------------------------------------------------- */
function initPhotoEditActions() {
  const editBtn = document.getElementById('editPhotoBtn');
  const editTextBtn = document.getElementById('editPhotoTextBtn');

  [editBtn, editTextBtn].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      showAppToast('Photo upload is not available in this preview.');
    });
  });
}

/* ---------------------------------------------------------------------------
   Save Changes — collects form values and confirms via toast.
--------------------------------------------------------------------------- */
function initSaveChanges() {
  const saveBtn = document.getElementById('saveChangesBtn');
  if (!saveBtn) return;

  saveBtn.addEventListener('click', () => {
    // Placeholder for a future PATCH /doctor/settings API call.
    const payload = {
      name: getValue('fieldName'),
      department: getValue('fieldDepartment'),
      specialty: getValue('fieldSpecialty'),
      phone: getValue('fieldPhone'),
      email: getValue('fieldEmail'),
      license: getValue('fieldLicense'),
      maxPatientsPerHour: getValue('configMaxPatients'),
      consultationDuration: getValue('configDuration'),
      bufferTime: getValue('configBuffer'),
      appointmentInterval: getValue('configInterval'),
    };
    console.info('Settings saved (dummy):', payload);
    showAppToast('Your settings have been saved successfully.');
  });
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : null;
}

/* ---------------------------------------------------------------------------
   Discard Changes — confirms via the shared modal before resetting the form.
--------------------------------------------------------------------------- */
function initDiscardChanges() {
  const discardBtn = document.getElementById('discardChangesBtn');
  if (!discardBtn) return;

  discardBtn.addEventListener('click', () => {
    showConfirmModal({
      title: 'Discard Changes',
      iconClass: 'appt-modal-icon-warning',
      icon: 'bi-exclamation-triangle-fill',
      message: 'Any unsaved changes to your profile, availability, and configuration will be reverted. This action cannot be undone.',
      confirmLabel: 'Discard Changes',
      confirmClass: 'btn-danger-solid',
      onConfirm: () => {
        const form = document.getElementById('doctorProfileForm');
        if (form) form.reset();
        showAppToast('Unsaved changes have been discarded.');
      },
    });
  });
}

/* ---------------------------------------------------------------------------
   Reusable confirmation modal (shared pattern with Appointment Details)
--------------------------------------------------------------------------- */
function showConfirmModal({ title, iconClass, icon, message, confirmLabel, confirmClass, onConfirm }) {
  const modalEl = document.getElementById('confirmModal');
  if (!modalEl) return;

  const titleEl = document.getElementById('confirmModalTitle');
  const bodyEl = document.getElementById('confirmModalBody');
  const iconWrap = document.getElementById('confirmModalIcon');
  const confirmBtn = document.getElementById('confirmModalBtn');

  if (titleEl) titleEl.textContent = title;
  if (bodyEl) bodyEl.innerHTML = message;

  if (iconWrap) {
    iconWrap.className = `appt-modal-icon ${iconClass}`;
    iconWrap.innerHTML = `<i class="bi ${icon}"></i>`;
  }

  if (confirmBtn) {
    confirmBtn.textContent = confirmLabel;
    confirmBtn.className = `btn ${confirmClass}`;

    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener('click', () => {
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
      if (onConfirm) onConfirm();
    });
  }

  bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

/* ---------------------------------------------------------------------------
   Print Schedule — genuine frontend-only browser print (no backend needed).
--------------------------------------------------------------------------- */
function initPrintSchedule() {
  const printBtn = document.getElementById('printScheduleBtn');
  if (!printBtn) return;

  printBtn.addEventListener('click', () => {
    showAppToast('Preparing your schedule for printing...');
    window.setTimeout(() => window.print(), 400);
  });
}
