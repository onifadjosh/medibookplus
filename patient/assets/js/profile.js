/**
 * profile.js
 * ---------------------------------------------------------------------------
 * Page controller for the Profile page. Follows the same pattern as every
 * other page: fetch through services/api.js, render into data-* hooks,
 * reuse components.js templates for repeated content (allergy tags).
 *
 * Two independent forms:
 *   - data-profile-form: personal/emergency/medical fields -> updateProfile()
 *   - data-password-form: current/new/confirm password -> changePassword()
 * ---------------------------------------------------------------------------
 */

import { getPatient, updateProfile, changePassword } from './services/api.js';
import { createInitialsAvatar, showToast } from './ui.js';
import { createAllergyTag } from './components.js';
import { qs, formatMonthYear } from './helpers.js';

/** Holds the last-loaded patient record so "Cancel" can restore original values. */
let currentPatient = null;

/* ---------------------------------------------------------------------
 * Read-only summary + display sections
 * --------------------------------------------------------------------- */

function renderSummary(patient) {
  const avatarMount = qs('[data-profile-avatar]');
  avatarMount.innerHTML = '';
  avatarMount.appendChild(createInitialsAvatar(patient.initials, 96, 32));

  qs('[data-profile-name]').textContent = `${patient.firstName} ${patient.lastName}`;
  qs('[data-profile-id]').textContent = patient.id;
  qs('[data-profile-blood-group]').textContent = patient.healthSummary.bloodGroup;
  qs('[data-profile-member-since]').textContent = formatMonthYear(patient.idCard.registeredDate);
  qs('[data-profile-status]').textContent = patient.idCard.verification.status;

  const completionValue = qs('[data-profile-completion-value]');
  const fill = qs('[data-profile-progress-fill]');
  completionValue.textContent = `${patient.profileCompletion}%`;
  qs('[data-profile-progress-track]').setAttribute('aria-valuenow', String(patient.profileCompletion));
  requestAnimationFrame(() => { fill.style.width = `${patient.profileCompletion}%`; });
}

function renderAllergies(patient) {
  qs('[data-profile-allergies]').innerHTML = patient.idCard.allergies.map(createAllergyTag).join('');
}

function renderAccountInfo(patient) {
  qs('[data-account-patient-id]').textContent = patient.id;
  qs('[data-account-member-since]').textContent = formatMonthYear(patient.idCard.registeredDate);
  qs('[data-account-insurance]').textContent = patient.idCard.insurance.provider;
  qs('[data-account-status]').textContent = patient.account.status;
}

/* ---------------------------------------------------------------------
 * Editable form: populate from patient record
 * --------------------------------------------------------------------- */

function populateProfileForm(patient) {
  const form = qs('[data-profile-form]');
  form.elements.firstName.value = patient.firstName;
  form.elements.lastName.value = patient.lastName;
  form.elements.email.value = patient.contact.email;
  form.elements.phone.value = patient.contact.phone;
  form.elements.dateOfBirth.value = patient.personal.dateOfBirth;
  form.elements.gender.value = patient.personal.gender;
  form.elements.addressStreet.value = patient.personal.address.street;
  form.elements.addressCity.value = patient.personal.address.city;
  form.elements.addressState.value = patient.personal.address.state;
  form.elements.addressZip.value = patient.personal.address.zip;

  form.elements.emergencyName.value = patient.idCard.emergencyContact.name;
  form.elements.emergencyRelation.value = patient.idCard.emergencyContact.relation;
  form.elements.emergencyPhone.value = patient.idCard.emergencyContact.phone;

  form.elements.bloodGroup.value = patient.healthSummary.bloodGroup;
  form.elements.chronicConditions.value = patient.medical.chronicConditions.join('\n');
  form.elements.currentMedications.value = patient.medical.currentMedications.join('\n');
}

/** Reads the profile form into a flat payload shaped for updateProfile(). */
function readProfileForm() {
  const form = qs('[data-profile-form]');
  const fd = new FormData(form);
  return {
    firstName: fd.get('firstName').trim(),
    lastName: fd.get('lastName').trim(),
    contact: { email: fd.get('email').trim(), phone: fd.get('phone').trim() },
    personal: {
      dateOfBirth: fd.get('dateOfBirth'),
      gender: fd.get('gender'),
      address: {
        street: fd.get('addressStreet').trim(),
        city: fd.get('addressCity').trim(),
        state: fd.get('addressState').trim(),
        zip: fd.get('addressZip').trim(),
      },
    },
    emergencyContact: {
      name: fd.get('emergencyName').trim(),
      relation: fd.get('emergencyRelation').trim(),
      phone: fd.get('emergencyPhone').trim(),
    },
    healthSummary: { bloodGroup: fd.get('bloodGroup') },
    medical: {
      chronicConditions: fd.get('chronicConditions').split('\n').map((s) => s.trim()).filter(Boolean),
      currentMedications: fd.get('currentMedications').split('\n').map((s) => s.trim()).filter(Boolean),
    },
  };
}

/* ---------------------------------------------------------------------
 * Profile form: Save Changes / Cancel
 * --------------------------------------------------------------------- */

async function handleProfileSubmit(e) {
  e.preventDefault();
  const submitBtn = qs('[data-profile-form] button[type="submit"]');
  const originalLabel = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Saving…';

  try {
    const payload = readProfileForm();
    const { success } = await updateProfile(payload);
    if (success) {
      showToast('Profile updated successfully.', 'success');
    } else {
      showToast('Something went wrong. Please try again.', 'error');
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalLabel;
  }
}

function handleCancelChanges() {
  if (currentPatient) populateProfileForm(currentPatient);
  showToast('Changes discarded.', 'info');
}

/* ---------------------------------------------------------------------
 * Password form
 * --------------------------------------------------------------------- */

async function handlePasswordSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const errorEl = qs('[data-password-error]');
  const { currentPassword, newPassword, confirmPassword } = Object.fromEntries(new FormData(form));

  const showError = (msg) => {
    errorEl.textContent = msg;
    errorEl.hidden = false;
  };

  if (!currentPassword || !newPassword || !confirmPassword) {
    return showError('Please fill in all password fields.');
  }
  if (newPassword.length < 8) {
    return showError('New password must be at least 8 characters.');
  }
  if (newPassword !== confirmPassword) {
    return showError('New password and confirmation do not match.');
  }
  errorEl.hidden = true;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalLabel = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Updating…';

  try {
    const { success } = await changePassword({ currentPassword, newPassword });
    if (success) {
      showToast('Password updated successfully.', 'success');
      form.reset();
    } else {
      showError('Could not update your password. Please try again.');
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalLabel;
  }
}

/* ---------------------------------------------------------------------
 * Init
 * --------------------------------------------------------------------- */

function initForms() {
  qs('[data-profile-form]').addEventListener('submit', handleProfileSubmit);
  qs('[data-action="cancel-changes"]').addEventListener('click', handleCancelChanges);
  qs('[data-password-form]').addEventListener('submit', handlePasswordSubmit);
}

async function initProfile() {
  initForms();
  currentPatient = await getPatient();
  renderSummary(currentPatient);
  renderAllergies(currentPatient);
  renderAccountInfo(currentPatient);
  populateProfileForm(currentPatient);
}

document.addEventListener('DOMContentLoaded', initProfile);
