/* ==========================================================================
   MediBook+ | Appointments List
   Vanilla JS interactions only. No backend calls — all data is local/dummy
   and stands in for future API integration.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initActiveNavSync();
  initButtonPressFeedback();
  initGlobalSearch();
  initNewSessionAction();
  initAppointmentFilters();
  initAppointmentSearch();
  initAppointmentRowActions();
  renderStats();
  renderAppointmentList();
});

/* ---------------------------------------------------------------------------
   Dummy data — stands in for a future backend/API response.
--------------------------------------------------------------------------- */
const APPOINTMENTS_LIST_DATA = {
  doctor: {
    name: 'Dr. James Wilson',
    role: 'Senior Cardiologist',
  },
  notifications: { unreadCount: 3 },
  appointments: [
    {
      id: 'APT-2847',
      patientName: 'Sarah J. Mitchell',
      patientId: 'PX-4412',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAsBOapm_Vua8Eh1806E5PqoR9h85YDk3ONxrjmOTCF2Sq2Yjm3ABIvHFXe38egUGf1Jzt9ZHvtQ_zm9Akaqv4-7LSKtjcRbrVyftSxDSuNNkFs-7Rtgx9KTHZRy0OS8Py3kkHtvHBvWa1NdcdRLSDbSH-q_Z6ITa_zMxYdymxLwn61AC9m87QyEZB5rbarqdLVSloGn0WXGCrjPyCM0bMMuOeRIDosjajlemZEJuvCfo_IwTRUsLvVCQ',
      date: 'Jul 13, 2026',
      time: '10:30 AM',
      department: 'Cardiology',
      doctor: 'Dr. James Wilson',
      reason: 'Follow-up consultation — arrhythmia review',
      status: 'confirmed',
      category: 'today',
      priority: false,
      detailsUrl: 'appointment-details.html',
    },
    {
      id: 'APT-2910',
      patientName: 'Eleanor Vance',
      patientId: 'PX-9921',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBy9mh47NSNhI0FoQ4E93LzbloWZbPiVYTzVN2PCG5MKFMaiPGzDnUaM5NeBCeMxVDVxfAgVSNB5FySOyhz5rJ13Fo1JjyzY14IVaqX40ueqmW8td2_-hwqGKVbZdTqBPk8iYgOXEF9txY_gObDAc8ICpJbLnda2gq4kIJVmr92Q7Z70Y4juf6NVOUTSpJ1ESk0WhTd4OxPDzsiUytnUio_M7Re79P92kb2kbIpIenvp5t8-815jlXtNg',
      date: 'Jul 13, 2026',
      time: '11:15 AM',
      department: 'Cardiology',
      doctor: 'Dr. James Wilson',
      reason: 'Hypertension management & vitals check',
      status: 'waiting',
      category: 'today',
      priority: false,
      detailsUrl: 'appointment-details.html',
    },
    {
      id: 'APT-2756',
      patientName: 'Julian Rossi',
      patientId: 'PX-8847',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDxt6mb1SFU954kesK4HjAFHE2k4yTh5U-o_Kq50G4am-0pxpiwkWPeX-VcEXY-QNcgugZNe_qReBRDXwVxilCR7XXDZlwLCo3LJVXsJDaaeGruSj8Wb5Kzgrho0KEZ6Agw5x2ECDHVEjXOKGgeSkJV2GztsieG8UeHyqyIXHNUdC7EVvkSGrzzOFYirphL2sIGTYGGqErMKY1b-WYAeW-4egvonyBno__94qH2-zvi8gvsMuStUjOKDQ',
      date: 'Jul 13, 2026',
      time: '10:45 AM',
      department: 'Cardiology',
      doctor: 'Dr. James Wilson',
      reason: 'Post-op chest pain check — Dr. Reed Refer',
      status: 'waiting',
      category: 'today',
      priority: true,
      detailsUrl: 'appointment-details.html',
    },
    {
      id: 'APT-2688',
      patientName: 'Mark Thompson',
      patientId: 'PX-7732',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAsBOapm_Vua8Eh1806E5PqoR9h85YDk3ONxrjmOTCF2Sq2Yjm3ABIvHFXe38egUGf1Jzt9ZHvtQ_zm9Akaqv4-7LSKtjcRbrVyftSxDSuNNkFs-7Rtgx9KTHZRy0OS8Py3kkHtvHBvWa1NdcdRLSDbSH-q_Z6ITa_zMxYdymxLwn61AC9m87QyEZB5rbarqdLVSloGn0WXGCrjPyCM0bMMuOeRIDosjajlemZEJuvCfo_IwTRUsLvVCQ',
      date: 'Jul 13, 2026',
      time: '09:00 AM',
      department: 'Cardiology',
      doctor: 'Dr. James Wilson',
      reason: 'Abnormal lab review — Lipid Panel',
      status: 'completed',
      category: 'today',
      priority: true,
      detailsUrl: 'appointment-details.html',
    },
    {
      id: 'APT-3021',
      patientName: 'Sarah Higgins',
      patientId: 'PX-6610',
      avatar: null,
      initials: 'SH',
      date: 'Jul 13, 2026',
      time: '01:15 PM',
      department: 'Preventive Care',
      doctor: 'Dr. James Wilson',
      reason: 'Annual screening — preventive care',
      status: 'confirmed',
      category: 'today',
      priority: false,
      detailsUrl: 'appointment-details.html',
    },
    {
      id: 'APT-3105',
      patientName: 'Robert Chen',
      patientId: 'PX-5503',
      avatar: null,
      initials: 'RC',
      date: 'Jul 15, 2026',
      time: '02:00 PM',
      department: 'Cardiology',
      doctor: 'Dr. James Wilson',
      reason: 'Medication refill & routine check-up',
      status: 'confirmed',
      category: 'upcoming',
      priority: false,
      detailsUrl: 'appointment-details.html',
    },
    {
      id: 'APT-3188',
      patientName: 'Amelia Torres',
      patientId: 'PX-4920',
      avatar: null,
      initials: 'AT',
      date: 'Jul 18, 2026',
      time: '09:30 AM',
      department: 'Cardiology',
      doctor: 'Dr. James Wilson',
      reason: 'ECG follow-up after stress test',
      status: 'confirmed',
      category: 'upcoming',
      priority: false,
      detailsUrl: 'appointment-details.html',
    },
    {
      id: 'APT-2590',
      patientName: 'David Park',
      patientId: 'PX-3811',
      avatar: null,
      initials: 'DP',
      date: 'Jul 10, 2026',
      time: '03:30 PM',
      department: 'Cardiology',
      doctor: 'Dr. James Wilson',
      reason: 'Pre-operative cardiac clearance',
      status: 'completed',
      category: 'completed',
      priority: false,
      detailsUrl: 'appointment-details.html',
    },
    {
      id: 'APT-2512',
      patientName: 'Linda Brooks',
      patientId: 'PX-2904',
      avatar: null,
      initials: 'LB',
      date: 'Jul 08, 2026',
      time: '11:00 AM',
      department: 'Cardiology',
      doctor: 'Dr. James Wilson',
      reason: 'Chest discomfort evaluation',
      status: 'cancelled',
      category: 'cancelled',
      priority: false,
      detailsUrl: 'appointment-details.html',
    },
  ],
};

/* ---------------------------------------------------------------------------
   Module state
--------------------------------------------------------------------------- */
let currentFilter = 'today';
let currentSearchQuery = '';

const STATUS_LABELS = {
  waiting: 'Waiting',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

/* ---------------------------------------------------------------------------
   Utility: show a bottom-right toast
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
   Shared init helpers (dashboard pattern)
--------------------------------------------------------------------------- */
function initActiveNavSync() {
  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (link.getAttribute('href') === '#') event.preventDefault();

      document.querySelectorAll('[data-nav]').forEach((other) => {
        other.classList.toggle('active', other.getAttribute('data-nav') === link.getAttribute('data-nav'));
      });

      const offcanvas = document.getElementById('mobileSidebar');
      if (offcanvas) bootstrap.Offcanvas.getInstance(offcanvas)?.hide();
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
  const input = document.getElementById('globalSearch');
  if (!input) return;
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      e.preventDefault();
      showAppToast(`Searching for "${input.value.trim()}"...`);
    }
  });
}

function initNewSessionAction() {
  [document.getElementById('newSessionBtn'), document.getElementById('mobileNewSessionBtn')].forEach((btn) => {
    btn?.addEventListener('click', () => showAppToast('Starting a new patient session...'));
  });
}


/* ---------------------------------------------------------------------------
   Filter tabs
--------------------------------------------------------------------------- */
function initAppointmentFilters() {
  document.querySelectorAll('[data-appt-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-appt-filter]').forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentFilter = btn.getAttribute('data-appt-filter');
      renderAppointmentList();
    });
  });
}

/* ---------------------------------------------------------------------------
   List search
--------------------------------------------------------------------------- */
function initAppointmentSearch() {
  const input = document.getElementById('apptListSearch');
  if (!input) return;
  input.addEventListener('input', () => {
    currentSearchQuery = input.value.trim().toLowerCase();
    renderAppointmentList();
  });
}

/* ---------------------------------------------------------------------------
   Filter logic
--------------------------------------------------------------------------- */
function getFilteredAppointments() {
  return APPOINTMENTS_LIST_DATA.appointments.filter((appt) => {
    if (currentFilter === 'today' && appt.category !== 'today') return false;
    if (currentFilter === 'upcoming' && appt.category !== 'upcoming') return false;
    if (currentFilter === 'completed' && appt.status !== 'completed') return false;
    if (currentFilter === 'cancelled' && appt.status !== 'cancelled') return false;

    if (currentSearchQuery) {
      const haystack = `${appt.patientName} ${appt.id} ${appt.department}`.toLowerCase();
      if (!haystack.includes(currentSearchQuery)) return false;
    }

    return true;
  });
}

/* ---------------------------------------------------------------------------
   Render statistics cards
--------------------------------------------------------------------------- */
function renderStats() {
  const today = APPOINTMENTS_LIST_DATA.appointments.filter((a) => a.category === 'today');
  const completedToday = today.filter((a) => a.status === 'completed').length;
  const pendingToday = today.filter((a) => a.status === 'waiting' || a.status === 'confirmed').length;
  const cancelled = APPOINTMENTS_LIST_DATA.appointments.filter((a) => a.status === 'cancelled').length;

  setText('statTodayTotal', today.length);
  setText('statCompletedToday', completedToday);
  setText('statPending', pendingToday);
  setText('statCancelled', cancelled);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/* ---------------------------------------------------------------------------
   Render appointment list
--------------------------------------------------------------------------- */
function renderAppointmentList() {
  const container = document.getElementById('appointmentList');
  const countEl = document.getElementById('appointmentListCount');
  if (!container) return;

  const filtered = getFilteredAppointments();

  if (countEl) {
    countEl.textContent = `${filtered.length} appointment${filtered.length !== 1 ? 's' : ''}`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="appt-list-empty">
        <i class="bi bi-calendar-x"></i>
        <p>No appointments match your search or filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((appt) => buildAppointmentRow(appt)).join('');
}

function buildAppointmentRow(appt) {
  const avatarHtml = appt.avatar
    ? `<img src="${appt.avatar}" alt="${appt.patientName}" class="appt-row-avatar">`
    : `<div class="appt-row-avatar appt-row-avatar-initials">${appt.initials}</div>`;

  const priorityBadge = appt.priority ? '<span class="priority-badge">Priority</span>' : '';
  const statusClass = `status-badge status-badge-${appt.status}`;
  const rowClass = appt.priority ? 'appt-row appt-row-priority' : 'appt-row';

  return `
    <article class="${rowClass}" data-appt-id="${appt.id}" data-details-url="${appt.detailsUrl}" tabindex="0" role="button" aria-label="View appointment for ${appt.patientName}">
      <div class="appt-row-inner">
        ${avatarHtml}
        <div class="appt-row-main">
          <div class="appt-row-top">
            <h3 class="appt-row-name">${appt.patientName}</h3>
            <div class="appt-row-badges">
              <span class="${statusClass}">${STATUS_LABELS[appt.status]}</span>
              ${priorityBadge}
            </div>
          </div>
          <p class="appt-row-meta"><strong>${appt.id}</strong> &bull; ${appt.reason}</p>
        </div>
        <div class="appt-row-details">
          <div class="appt-row-detail">
            <p class="appt-row-detail-label">Date</p>
            <p class="appt-row-detail-value">${appt.date}</p>
          </div>
          <div class="appt-row-detail">
            <p class="appt-row-detail-label">Time</p>
            <p class="appt-row-detail-value">${appt.time}</p>
          </div>
          <div class="appt-row-detail">
            <p class="appt-row-detail-label">Department</p>
            <p class="appt-row-detail-value">${appt.department}</p>
          </div>
          <div class="appt-row-detail">
            <p class="appt-row-detail-label">Doctor</p>
            <p class="appt-row-detail-value">${appt.doctor}</p>
          </div>
        </div>
        <div class="appt-row-actions">
          <a href="${appt.detailsUrl}" class="btn btn-brand" data-action="view-details">View Details</a>
          <button type="button" class="btn btn-neutral-solid" data-action="reschedule" data-appt-id="${appt.id}" data-patient="${appt.patientName}">Reschedule</button>
          <button type="button" class="btn btn-icon-outline" data-action="cancel" data-appt-id="${appt.id}" data-patient="${appt.patientName}" aria-label="Cancel appointment for ${appt.patientName}">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
    </article>
  `;
}

/* ---------------------------------------------------------------------------
   Row click + action button handlers
--------------------------------------------------------------------------- */
function initAppointmentRowActions() {
  const listEl = document.getElementById('appointmentList');
  if (!listEl) return;

  listEl.addEventListener('click', (event) => {
    const rescheduleBtn = event.target.closest('[data-action="reschedule"]');
    const cancelBtn = event.target.closest('[data-action="cancel"]');
    const viewLink = event.target.closest('[data-action="view-details"]');

    if (rescheduleBtn) {
      event.stopPropagation();
      event.preventDefault();
      showAppToast(`Reschedule workflow opened for ${rescheduleBtn.getAttribute('data-patient')} (preview).`);
      return;
    }

    if (cancelBtn) {
      event.stopPropagation();
      event.preventDefault();
      showAppToast(`Cancellation requested for ${cancelBtn.getAttribute('data-patient')} (preview).`);
      return;
    }

    if (viewLink) {
      event.stopPropagation();
      return;
    }

    const row = event.target.closest('.appt-row');
    if (!row) return;

    const url = row.getAttribute('data-details-url');
    if (url) window.location.href = url;
  });

  listEl.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const row = event.target.closest('.appt-row');
    if (!row || event.target.closest('.appt-row-actions')) return;
    event.preventDefault();
    const url = row.getAttribute('data-details-url');
    if (url) window.location.href = url;
  });
}
