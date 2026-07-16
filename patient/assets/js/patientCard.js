/**
 * patientCard.js
 * ---------------------------------------------------------------------------
 * Page controller for the Digital Patient Card. Follows the same pattern as
 * dashboard.js/appointments.js: fetch through services/api.js (reusing the
 * existing getPatient() — no new endpoint needed since idCard is just part
 * of the patient record), render with components.js templates.
 * ---------------------------------------------------------------------------
 */

import { getPatient } from './services/api.js';
import { createInitialsAvatar, showToast } from './ui.js';
import { createAllergyTag, createIdField, createBloodGroupField } from './components.js';
import { qs, formatMonthYear } from './helpers.js';

/** Renders the patient photo placeholder (initials avatar) and card number. */
function renderIdentity(patient) {
  const photoMount = qs('[data-card-photo]');
  photoMount.innerHTML = '';
  photoMount.appendChild(createInitialsAvatar(patient.initials, 140, 44));

  qs('[data-card-number]').textContent = patient.idCard.cardNumber;
  qs('[data-card-name]').textContent = patient.idCard.fullName;
  qs('[data-card-citizenship]').textContent = `${patient.idCard.nationality} | ${patient.idCard.citizenStatus}`;
}

/** Renders the four core ID fields: blood group, primary doctor, emergency contact, insurance. */
function renderFields(patient) {
  const { idCard } = patient;
  const fields = [
    createBloodGroupField({ bloodGroup: idCard.bloodGroup, bloodGroupLabel: idCard.bloodGroupLabel }),
    createIdField({ label: 'Primary Doctor', value: idCard.primaryDoctor, icon: 'bi-briefcase-fill' }),
    createIdField({ label: 'Emergency Contact', value: idCard.emergencyContact.name, subValue: `(${idCard.emergencyContact.relation})` }),
    createIdField({ label: 'Insurance', value: idCard.insurance.provider, icon: 'bi-patch-check-fill' }),
  ];
  qs('[data-card-fields]').innerHTML = fields.join('');
}

/** Renders Registered/Expires dates and the mock barcode value. */
function renderDatesAndCode(patient) {
  const { idCard } = patient;
  qs('[data-card-registered]').textContent = formatMonthYear(idCard.registeredDate);
  qs('[data-card-expires]').textContent = formatMonthYear(idCard.expiresDate);
  qs('[data-card-barcode-value]').textContent = idCard.cardNumber.replace(/-/g, '');
}

/** Renders the Critical Allergies tag list. */
function renderAllergies(patient) {
  qs('[data-card-allergies]').innerHTML = patient.idCard.allergies.map(createAllergyTag).join('');
}

/** Renders the Active Patient status pill and verification detail line. */
function renderStatus(patient) {
  qs('[data-card-status]').textContent = patient.idCard.verification.status;
  qs('[data-card-verification]').textContent = patient.idCard.verification.detail;
}

/** Renders the Insurance Details and Emergency Instructions footer cards. */
function renderFooter(patient) {
  const { idCard } = patient;
  qs('[data-card-insurance-provider]').textContent = idCard.insurance.provider;
  qs('[data-card-insurance-policy]').textContent = `Policy: #${idCard.insurance.policyNumber}`;
  qs('[data-card-instructions]').textContent = `“${idCard.emergencyInstructions}”`;
}

/** Wires the header/sidebar action buttons. All are mock actions for this prototype stage. */
function initActions() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    switch (btn.dataset.action) {
      case 'download-card':
      case 'download-pdf':
        showToast('Preparing your card as a PDF…', 'info');
        break;
      case 'print-card':
        window.print();
        break;
      case 'share-qr':
        showToast('Share link copied to clipboard.', 'success');
        break;
      case 'add-to-wallet':
        showToast('Added to your mobile wallet.', 'success');
        break;
      case 'enlarge-qr':
        showToast('Enlarging QR code…', 'info');
        break;
      default:
        break;
    }
  });
}

async function initPatientCard() {
  initActions();
  const patient = await getPatient();
  renderIdentity(patient);
  renderFields(patient);
  renderDatesAndCode(patient);
  renderAllergies(patient);
  renderStatus(patient);
  renderFooter(patient);
}

document.addEventListener('DOMContentLoaded', initPatientCard);
