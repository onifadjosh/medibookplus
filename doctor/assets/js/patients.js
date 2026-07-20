document.addEventListener('DOMContentLoaded', initPatientsModule);

const PATIENTS_DATA = [
  {
    id: 'PT-1042',
    name: 'Sarah J. Mitchell',
    age: 41,
    gender: 'Female',
    phone: '+1 (555) 214-7788',
    email: 'sarah.mitchell@email.com',
    lastVisit: 'Jun 12, 2026',
    nextAppointment: 'Tomorrow, 09:30',
    status: 'active',
    statusLabel: 'Active',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
    profile: 'patient-profile.html',
    category: 'active'
  },
  {
    id: 'PT-1045',
    name: 'Mark Thompson',
    age: 58,
    gender: 'Male',
    phone: '+1 (555) 336-1124',
    email: 'mark.thompson@email.com',
    lastVisit: 'Jun 10, 2026',
    nextAppointment: 'Today, 14:15',
    status: 'new',
    statusLabel: 'New Patient',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    profile: 'patient-profile.html',
    category: 'new'
  },
  {
    id: 'PT-1038',
    name: 'Eleanor Vance',
    age: 72,
    gender: 'Female',
    phone: '+1 (555) 458-2210',
    email: 'eleanor.vance@email.com',
    lastVisit: 'Jun 08, 2026',
    nextAppointment: 'Thu, 16:00',
    status: 'follow-up',
    statusLabel: 'Follow-up',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80',
    profile: 'patient-profile.html',
    category: 'follow-up'
  },
  {
    id: 'PT-1051',
    name: 'Robert Chen',
    age: 63,
    gender: 'Male',
    phone: '+1 (555) 284-9910',
    email: 'robert.chen@email.com',
    lastVisit: 'Jun 05, 2026',
    nextAppointment: 'Fri, 10:00',
    status: 'active',
    statusLabel: 'Active',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80',
    profile: 'patient-profile.html',
    category: 'active'
  }
];

const PATIENTS_STATE = {
  filter: 'all',
  search: '',
  items: PATIENTS_DATA.map((item) => ({ ...item }))
};

function initPatientsModule() {
  const listEl = document.getElementById('patientsList');
  const summaryEl = document.getElementById('patientsListSummary');
  const searchInput = document.getElementById('patientSearch');
  const filterButtons = document.querySelectorAll('[data-patient-filter]');

  if (!listEl || !summaryEl) return;

  renderPatients(listEl, summaryEl);

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      PATIENTS_STATE.search = event.target.value.trim().toLowerCase();
      renderPatients(listEl, summaryEl);
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => {
        btn.classList.toggle('active', btn === button);
        btn.setAttribute('aria-selected', btn === button ? 'true' : 'false');
      });

      PATIENTS_STATE.filter = button.getAttribute('data-patient-filter') || 'all';
      renderPatients(listEl, summaryEl);
    });
  });

  listEl.addEventListener('click', (event) => {
    const row = event.target.closest('[data-profile-href]');
    if (!row) return;
    const target = row.getAttribute('data-profile-href');
    if (target) window.location.href = target;
  });
}

function renderPatients(listEl, summaryEl) {
  const filtered = PATIENTS_STATE.items.filter((patient) => {
    const matchesFilter = PATIENTS_STATE.filter === 'all' || patient.category === PATIENTS_STATE.filter;
    const haystack = `${patient.name} ${patient.id} ${patient.phone} ${patient.email}`.toLowerCase();
    const matchesSearch = PATIENTS_STATE.search.length === 0 || haystack.includes(PATIENTS_STATE.search);
    return matchesFilter && matchesSearch;
  });

  const total = PATIENTS_STATE.items.length;
  const newPatients = PATIENTS_STATE.items.filter((patient) => patient.category === 'new').length;
  const followUps = PATIENTS_STATE.items.filter((patient) => patient.category === 'follow-up').length;
  const todayVisits = 6;

  document.getElementById('statTotalPatients').textContent = total;
  document.getElementById('statNewPatients').textContent = newPatients;
  document.getElementById('statFollowUp').textContent = followUps;
  document.getElementById('statTodayVisits').textContent = todayVisits;

  if (summaryEl) {
    summaryEl.textContent = `${filtered.length} patient${filtered.length === 1 ? '' : 's'} visible`;
  }

  if (!filtered.length) {
    listEl.innerHTML = '<div class="patients-empty">No patients match the current search or filter.</div>';
    return;
  }

  listEl.innerHTML = filtered.map(createPatientRow).join('');
}

function createPatientRow(patient) {
  return `
    <article class="patient-row" data-profile-href="${patient.profile}">
      <div class="patient-row-main">
        <img class="patient-row-avatar" src="${patient.image}" alt="${escapeHtml(patient.name)}">
        <div class="patient-row-info">
          <div class="patient-row-title">
            <h3 class="patient-row-name">${escapeHtml(patient.name)}</h3>
            <span class="status-badge status-badge-${patient.status}">${escapeHtml(patient.statusLabel)}</span>
          </div>
          <div class="patient-row-meta">
            <span><i class="bi bi-hash"></i>${escapeHtml(patient.id)}</span>
            <span><i class="bi bi-person"></i>${patient.age} yrs • ${escapeHtml(patient.gender)}</span>
            <span><i class="bi bi-telephone"></i>${escapeHtml(patient.phone)}</span>
          </div>
        </div>
      </div>
      <div class="patient-row-actions">
        <div class="patient-row-appointment">Last Visit: ${escapeHtml(patient.lastVisit)}</div>
        <div class="patient-row-appointment">Next: ${escapeHtml(patient.nextAppointment)}</div>
        <a class="btn btn-brand btn-sm" href="patient-profile.html">View Profile</a>
      </div>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
