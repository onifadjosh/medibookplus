document.addEventListener('DOMContentLoaded', initPatientProfile);

const PATIENT_PROFILE_DATA = {
  id: 'PT-1042',
  name: 'Sarah J. Mitchell',
  age: 41,
  gender: 'Female',
  bloodGroup: 'O+',
  dob: '14 Apr 1985',
  phone: '+1 (555) 214-7788',
  email: 'sarah.mitchell@email.com',
  address: '128 Willow Creek Rd, Seattle, WA',
  emergencyContact: 'Daniel Mitchell • +1 (555) 221-0144',
  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
  status: 'Active',
  subtitle: 'Cardiology follow-up • Stable post-procedure recovery',
  vitals: [
    { title: 'Blood Pressure', value: '124/78 mmHg' },
    { title: 'Heart Rate', value: '72 bpm' },
    { title: 'Temperature', value: '98.6°F' },
    { title: 'Weight', value: '68 kg' },
    { title: 'BMI', value: '24.1' },
    { title: 'Blood Sugar', value: '96 mg/dL' }
  ],
  history: [
    { title: 'Allergies', value: 'Penicillin, Latex' },
    { title: 'Chronic Diseases', value: 'Hypertension, Hyperlipidemia' },
    { title: 'Previous Surgeries', value: 'Appendectomy (2018)' },
    { title: 'Family History', value: 'Father: hypertension, Mother: myocardial infarction' },
    { title: 'Current Medications', value: 'Atorvastatin 20mg, Lisinopril 10mg' }
  ],
  appointments: [
    { date: 'Jun 12, 2026', department: 'Cardiology', doctor: 'Dr. James Wilson', status: 'Completed', notes: 'Stable recovery; continue current regimen.' },
    { date: 'Apr 18, 2026', department: 'Cardiology', doctor: 'Dr. James Wilson', status: 'Follow-up', notes: 'Discussed diet and exercise plan.' },
    { date: 'Feb 19, 2026', department: 'Emergency', doctor: 'Dr. Laura Kim', status: 'Completed', notes: 'Chest discomfort evaluation; discharged.' }
  ],
  labs: [
    { name: 'Blood Test', result: 'Normal', status: 'Completed', date: 'Jun 11, 2026' },
    { name: 'ECG', result: 'Sinus Rhythm', status: 'Reviewed', date: 'Jun 11, 2026' },
    { name: 'MRI', result: 'No abnormalities', status: 'Reviewed', date: 'May 24, 2026' },
    { name: 'X-Ray', result: 'Clear lungs', status: 'Completed', date: 'May 24, 2026' },
    { name: 'Urinalysis', result: 'Normal', status: 'Completed', date: 'May 24, 2026' }
  ],
  prescriptions: [
    { medicine: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', duration: '30 days', status: 'Active' },
    { medicine: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days', status: 'Active' }
  ],
  notes: [
    { title: 'Consultation Note', text: 'Patient reports improved energy and no chest discomfort. Continue current therapy and monitor blood pressure at home.' },
    { title: 'Care Plan', text: 'Maintain low-sodium diet, 20 minutes of walking per day, and regular follow-up in 2 weeks.' }
  ],
  documents: [
    { title: 'Prescription', kind: 'Uploaded 2 days ago', action: 'View' },
    { title: 'Lab Report', kind: 'Uploaded 1 week ago', action: 'Download' },
    { title: 'Medical Certificate', kind: 'Uploaded 2 weeks ago', action: 'View' }
  ]
};

function initPatientProfile() {
  renderPatientHeader();
  renderOverview();
  renderMedicalHistory();
  renderAppointmentHistory();
  renderLabResults();
  renderPrescriptions();
  renderClinicalNotes();
  renderDocuments();
}

function renderPatientHeader() {
  document.getElementById('patientPhoto').src = PATIENT_PROFILE_DATA.image;
  document.getElementById('patientPhoto').alt = PATIENT_PROFILE_DATA.name;
  document.getElementById('patientName').textContent = PATIENT_PROFILE_DATA.name;
  document.getElementById('patientStatusBadge').textContent = PATIENT_PROFILE_DATA.status;
  document.getElementById('patientSubtitle').textContent = PATIENT_PROFILE_DATA.subtitle;

  const metaList = document.getElementById('patientMetaList');
  metaList.innerHTML = `
    <span><i class="bi bi-hash"></i>${PATIENT_PROFILE_DATA.id}</span>
    <span><i class="bi bi-person"></i>${PATIENT_PROFILE_DATA.age} yrs • ${PATIENT_PROFILE_DATA.gender}</span>
    <span><i class="bi bi-droplet"></i>${PATIENT_PROFILE_DATA.bloodGroup}</span>
    <span><i class="bi bi-cake2"></i>${PATIENT_PROFILE_DATA.dob}</span>
  `;
}

function renderOverview() {
  const overviewCards = document.getElementById('overviewCards');
  overviewCards.innerHTML = PATIENT_PROFILE_DATA.vitals.map((item) => `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="metric-card">
        <p class="metric-card-title">${escapeHtml(item.title)}</p>
        <p class="metric-card-value">${escapeHtml(item.value)}</p>
      </div>
    </div>
  `).join('');
}

function renderMedicalHistory() {
  const list = document.getElementById('medicalHistoryList');
  list.innerHTML = `
    <div class="row g-3">
      ${PATIENT_PROFILE_DATA.history.map((item) => `
        <div class="col-12 col-lg-6">
          <div class="info-card">
            <h3 class="info-card-title">${escapeHtml(item.title)}</h3>
            <div class="info-card-list">
              <div class="info-card-row">
                <span class="info-card-label">Details</span>
                <span>${escapeHtml(item.value)}</span>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderAppointmentHistory() {
  const rows = document.getElementById('appointmentHistoryRows');
  rows.innerHTML = PATIENT_PROFILE_DATA.appointments.map((item) => `
    <tr>
      <td>${escapeHtml(item.date)}</td>
      <td>${escapeHtml(item.department)}</td>
      <td>${escapeHtml(item.doctor)}</td>
      <td><span class="status-badge">${escapeHtml(item.status)}</span></td>
      <td>${escapeHtml(item.notes)}</td>
    </tr>
  `).join('');
}

function renderLabResults() {
  const rows = document.getElementById('labResultsRows');
  rows.innerHTML = PATIENT_PROFILE_DATA.labs.map((item) => `
    <tr>
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.result)}</td>
      <td><span class="status-badge">${escapeHtml(item.status)}</span></td>
      <td>${escapeHtml(item.date)}</td>
      <td><button class="btn btn-neutral-solid btn-sm">View</button></td>
    </tr>
  `).join('');
}

function renderPrescriptions() {
  const rows = document.getElementById('prescriptionsRows');
  rows.innerHTML = PATIENT_PROFILE_DATA.prescriptions.map((item) => `
    <tr>
      <td>${escapeHtml(item.medicine)}</td>
      <td>${escapeHtml(item.dosage)}</td>
      <td>${escapeHtml(item.frequency)}</td>
      <td>${escapeHtml(item.duration)}</td>
      <td><span class="status-badge">${escapeHtml(item.status)}</span></td>
    </tr>
  `).join('');
}

function renderClinicalNotes() {
  const list = document.getElementById('clinicalNotesList');
  list.innerHTML = PATIENT_PROFILE_DATA.notes.map((item) => `
    <div class="info-card mb-3">
      <h3 class="info-card-title">${escapeHtml(item.title)}</h3>
      <p class="mb-0">${escapeHtml(item.text)}</p>
    </div>
  `).join('');
}

function renderDocuments() {
  const list = document.getElementById('documentsList');
  list.innerHTML = PATIENT_PROFILE_DATA.documents.map((item) => `
    <div class="col-12 col-lg-6">
      <div class="document-card">
        <div>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="document-meta">${escapeHtml(item.kind)}</p>
        </div>
        <button class="btn btn-neutral-solid btn-sm">${escapeHtml(item.action)}</button>
      </div>
    </div>
  `).join('');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
