/* ==========================================================================
   MediBook+ | Appointment Details
   Vanilla JS interactions only. No backend calls — all data is local/dummy
   and stands in for future API integration.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initActiveNavSync();
  initButtonPressFeedback();
  initGlobalSearch();
  initNewSessionAction();
  initAppointmentActions();
  initDocumentDownloads();
  renderAppointmentDetails();
});

/* ---------------------------------------------------------------------------
   Dummy data — stands in for a future backend/API response.
--------------------------------------------------------------------------- */
const APPOINTMENT_DATA = {
  doctor: {
    name: 'Dr. James Wilson',
    role: 'Senior Cardiologist',
  },
  notifications: { unreadCount: 3 },
  appointment: {
    id: 'APT-2847',
    status: 'pending',
    patient: {
      name: 'Sarah J. Mitchell',
      id: 'PX-4412',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAsBOapm_Vua8Eh1806E5PqoR9h85YDk3ONxrjmOTCF2Sq2Yjm3ABIvHFXe38egUGf1Jzt9ZHvtQ_zm9Akaqv4-7LSKtjcRbrVyftSxDSuNNkFs-7Rtgx9KTHZRy0OS8Py3kkHtvHBvWa1NdcdRLSDbSH-q_Z6ITa_zMxYdymxLwn61AC9m87QyEZB5rbarqdLVSloGn0WXGCrjPyCM0bMMuOeRIDosjajlemZEJuvCfo_IwTRUsLvVCQ',
      age: 54,
      gender: 'Female',
      bloodGroup: 'A+',
      nextAppointment: 'Jul 15, 2026 — 10:30 AM',
      medicalNotes:
        'Patient reports occasional shortness of breath during exertion. Previous ECG showed mild arrhythmia. Follow-up recommended after lab review.',
    },
    vitals: {
      heartRate: { value: 78, unit: 'BPM' },
      bloodPressure: { value: '128/82', unit: 'mmHg' },
      temperature: { value: 98.4, unit: '°F' },
      lastUpdated: 'Today, 09:15 AM',
    },
    allergies: ['Penicillin', 'Peanuts', 'Pollen'],
    conditions: ['Hypertension', 'Seasonal Asthma'],
    labTrend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      cholesterol: [210, 205, 198, 192, 188, 182],
      glucose: [105, 102, 100, 98, 96, 94],
    },
    documents: [
      {
        id: 'doc-1',
        name: 'Cardiology_Report.pdf',
        date: 'Jun 28, 2026',
        size: '2.4 MB',
      },
      {
        id: 'doc-2',
        name: 'Blood_Test_Panel.pdf',
        date: 'Jul 02, 2026',
        size: '1.1 MB',
      },
    ],
  },
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
   Active nav link syncing (reused from dashboard pattern)
--------------------------------------------------------------------------- */
function initActiveNavSync() {
  const allNavLinks = document.querySelectorAll('[data-nav]');

  allNavLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetKey = link.getAttribute('data-nav');
      if (link.getAttribute('href') === '#') {
        event.preventDefault();
      }

      allNavLinks.forEach((otherLink) => {
        const isMatch = otherLink.getAttribute('data-nav') === targetKey;
        otherLink.classList.toggle('active', isMatch);
      });

      const offcanvasEl = document.getElementById('mobileSidebar');
      if (offcanvasEl) {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (offcanvasInstance) offcanvasInstance.hide();
      }
    });
  });
}

/* ---------------------------------------------------------------------------
   Button press feedback
--------------------------------------------------------------------------- */
function initButtonPressFeedback() {
  document.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('mousedown', () => btn.classList.add('btn-press'));
    ['mouseup', 'mouseleave'].forEach((evt) =>
      btn.addEventListener(evt, () => btn.classList.remove('btn-press'))
    );
  });
}

/* ---------------------------------------------------------------------------
   Global topbar search
--------------------------------------------------------------------------- */
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

/* ---------------------------------------------------------------------------
   New Session buttons
--------------------------------------------------------------------------- */
function initNewSessionAction() {
  const desktopBtn = document.getElementById('newSessionBtn');
  const mobileBtn = document.getElementById('mobileNewSessionBtn');

  [desktopBtn, mobileBtn].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      showAppToast('Starting a new patient session...');
    });
  });
}

/* ---------------------------------------------------------------------------
   Render appointment details from dummy data
--------------------------------------------------------------------------- */
function renderAppointmentDetails() {
  const { patient, vitals, allergies, conditions, labTrend, documents } =
    APPOINTMENT_DATA.appointment;

  setText('breadcrumbPatientName', patient.name);
  setText('patientName', patient.name);
  setText('patientId', `ID: ${patient.id}`);
  setText('patientAge', `${patient.age} years`);
  setText('patientGender', patient.gender);
  setText('patientBloodGroup', patient.bloodGroup);
  setText('patientNextAppt', patient.nextAppointment);
  setText('patientMedicalNotes', patient.medicalNotes);
  setText('vitalsLastUpdated', vitals.lastUpdated);
  setText('vitalHR', vitals.heartRate.value);
  setText('vitalBP', vitals.bloodPressure.value);
  setText('vitalTemp', vitals.temperature.value);

  const avatarEl = document.getElementById('patientAvatar');
  if (avatarEl) {
    avatarEl.src = patient.avatar;
    avatarEl.alt = patient.name;
  }

  renderBadgeList('allergyList', allergies, 'tag-allergy');
  renderBadgeList('conditionsList', conditions, 'tag-condition');
  renderLabChart(labTrend);
  renderDocuments(documents);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderBadgeList(containerId, items, tagClass) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = items
    .map((item) => `<span class="tag ${tagClass}">${item}</span>`)
    .join('');
}

/* ---------------------------------------------------------------------------
   Render lab trend placeholder chart
--------------------------------------------------------------------------- */
function renderLabChart(labTrend) {
  const chartEl = document.getElementById('labChartPlaceholder');
  if (!chartEl) return;

  const maxChol = Math.max(...labTrend.cholesterol);
  const maxGluc = Math.max(...labTrend.glucose);
  const maxVal = Math.max(maxChol, maxGluc);

  const gridLines = Array(4)
    .fill('')
    .map(() => '<div class="lab-chart-grid-line"></div>')
    .join('');

  const barGroups = labTrend.labels
    .map((label, i) => {
      const cholH = Math.round((labTrend.cholesterol[i] / maxVal) * 100);
      const glucH = Math.round((labTrend.glucose[i] / maxVal) * 100);
      return `
        <div class="lab-chart-bar-group">
          <div class="lab-chart-bars">
            <div class="lab-chart-bar lab-chart-bar-primary" style="height: ${cholH}%;" title="Cholesterol: ${labTrend.cholesterol[i]}"></div>
            <div class="lab-chart-bar lab-chart-bar-secondary" style="height: ${glucH}%;" title="Glucose: ${labTrend.glucose[i]}"></div>
          </div>
          <span class="lab-chart-label">${label}</span>
        </div>
      `;
    })
    .join('');

  chartEl.innerHTML = `
    <div class="lab-chart-grid-lines">${gridLines}</div>
    ${barGroups}
  `;
}

/* ---------------------------------------------------------------------------
   Render clinical documents list
--------------------------------------------------------------------------- */
function renderDocuments(documents) {
  const listEl = document.getElementById('documentsList');
  if (!listEl) return;

  listEl.innerHTML = documents
    .map(
      (doc) => `
    <li class="document-item">
      <span class="document-icon" aria-hidden="true"><i class="bi bi-file-earmark-pdf-fill"></i></span>
      <div class="document-info">
        <p class="document-name">${doc.name}</p>
        <p class="document-meta">${doc.date} &bull; ${doc.size}</p>
      </div>
      <button type="button" class="btn btn-icon-outline document-download-btn" data-doc-id="${doc.id}" data-doc-name="${doc.name}" aria-label="Download ${doc.name}">
        <i class="bi bi-download"></i>
      </button>
    </li>
  `
    )
    .join('');
}

/* ---------------------------------------------------------------------------
   Document download buttons
--------------------------------------------------------------------------- */
function initDocumentDownloads() {
  document.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-doc-id]');
    if (!btn) return;

    const docName = btn.getAttribute('data-doc-name');
    showAppToast(`Downloading ${docName}...`);
  });
}

/* ---------------------------------------------------------------------------
   Appointment action buttons (Accept / Reschedule / Cancel)
--------------------------------------------------------------------------- */
function initAppointmentActions() {
  const acceptBtn = document.getElementById('acceptApptBtn');
  const rescheduleBtn = document.getElementById('rescheduleApptBtn');
  const cancelBtn = document.getElementById('cancelApptBtn');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      showConfirmModal({
        title: 'Accept Appointment',
        iconClass: 'appt-modal-icon-success',
        icon: 'bi-check-circle-fill',
        message: `Confirm acceptance of the appointment with <strong>${APPOINTMENT_DATA.appointment.patient.name}</strong> on <strong>${APPOINTMENT_DATA.appointment.patient.nextAppointment}</strong>?`,
        confirmLabel: 'Accept Appointment',
        confirmClass: 'btn-brand',
        onConfirm: () => {
          APPOINTMENT_DATA.appointment.status = 'accepted';
          showAppToast('Appointment accepted successfully.');
        },
      });
    });
  }

  if (rescheduleBtn) {
    rescheduleBtn.addEventListener('click', () => {
      showConfirmModal({
        title: 'Reschedule Appointment',
        iconClass: 'appt-modal-icon-warning',
        icon: 'bi-calendar-event',
        message: `Open the scheduling workflow to reschedule <strong>${APPOINTMENT_DATA.appointment.patient.name}</strong>'s appointment?`,
        confirmLabel: 'Reschedule',
        confirmClass: 'btn-neutral-solid',
        onConfirm: () => {
          showAppToast('Reschedule workflow opened (preview).');
        },
      });
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      showConfirmModal({
        title: 'Cancel Appointment',
        iconClass: 'appt-modal-icon-danger',
        icon: 'bi-x-circle-fill',
        message: `Are you sure you want to cancel the appointment with <strong>${APPOINTMENT_DATA.appointment.patient.name}</strong>? This action cannot be undone.`,
        confirmLabel: 'Cancel Appointment',
        confirmClass: 'btn-danger-solid',
        onConfirm: () => {
          APPOINTMENT_DATA.appointment.status = 'cancelled';
          showAppToast('Appointment cancelled.');
        },
      });
    });
  }
}

/* ---------------------------------------------------------------------------
   Reusable confirmation modal
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
