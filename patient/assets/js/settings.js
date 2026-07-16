/**
 * settings.js
 * ---------------------------------------------------------------------------
 * Page controller for Settings. Follows the same pattern as every other
 * page controller: fetch through services/api.js, render with
 * components.js templates, keep all page state local to this module.
 * ---------------------------------------------------------------------------
 */

import {
  getPatient,
  getSettings,
  updateSettings,
  logoutUser,
  deactivateAccount,
} from './services/api.js';
import { languageOptions, themeOptions } from './data/settings.js';
import { openModal, closeModal, showToast } from './ui.js';
import { createToggleRow, createThemeCard } from './components.js';
import { qs, qsAll } from './helpers.js';
import { routes } from './routes.js';

let currentSettings = null;

/* ---------------------------------------------------------------------
 * Account Settings (read-only summary; editing happens on Profile page)
 * --------------------------------------------------------------------- */

async function renderAccountSummary() {
  const patient = await getPatient();
  qs('[data-settings-email]').textContent = patient.contact.email;
  qs('[data-settings-patient-id]').textContent = patient.id;
  qs('[data-settings-account-status]').textContent = patient.account.status;
}

/* ---------------------------------------------------------------------
 * Notification Preferences + Privacy & Security (toggle rows)
 * --------------------------------------------------------------------- */

const NOTIFICATION_TOGGLES = [
  { key: 'notifications.emailNotifications', label: 'Email Notifications', desc: 'Appointment updates and account activity via email.' },
  { key: 'notifications.smsNotifications', label: 'SMS Notifications', desc: 'Text messages for time-sensitive alerts.' },
  { key: 'notifications.pushNotifications', label: 'Push Notifications', desc: 'Browser and mobile app push alerts.' },
  { key: 'notifications.appointmentReminders', label: 'Appointment Reminders', desc: 'Reminders before upcoming appointments.' },
  { key: 'notifications.marketingUpdates', label: 'Marketing Updates', desc: 'News, offers, and product updates from MediBook+.' },
];

const PRIVACY_TOGGLES = [
  { key: 'privacy.shareDataWithProviders', label: 'Share Data with Care Providers', desc: 'Let your care team access relevant health records.' },
  { key: 'privacy.twoFactorEnabled', label: 'Two-Factor Authentication', desc: 'Add an extra verification step when signing in. (Coming soon)' },
];

/** Reads a dotted key like "notifications.smsNotifications" off currentSettings. */
function getSettingValue(dottedKey) {
  return dottedKey.split('.').reduce((obj, part) => obj?.[part], currentSettings);
}

function renderToggleGroup(mountSelector, toggleDefs) {
  const mount = qs(mountSelector);
  mount.innerHTML = toggleDefs
    .map((def) => createToggleRow({ key: def.key, label: def.label, desc: def.desc, checked: !!getSettingValue(def.key) }))
    .join('');
}

/** Builds a partial-update payload for updateSettings() from a dotted key + new value. */
function buildSettingsPatch(dottedKey, value) {
  const [section, field] = dottedKey.split('.');
  return { [section]: { [field]: value } };
}

function initToggleListeners() {
  document.addEventListener('change', async (e) => {
    const input = e.target.closest('[data-setting]');
    if (!input) return;

    const dottedKey = input.dataset.setting;
    const { success, settings } = await updateSettings(buildSettingsPatch(dottedKey, input.checked));

    if (success) {
      currentSettings = settings;
      showToast('Preference saved.', 'success');
    } else {
      input.checked = !input.checked; // revert on failure
      showToast('Could not save your preference. Please try again.', 'error');
    }
  });
}

/* ---------------------------------------------------------------------
 * Language Preference
 * --------------------------------------------------------------------- */

function renderLanguageOptions() {
  const select = qs('[data-language-select]');
  select.innerHTML = languageOptions
    .map((opt) => `<option value="${opt.value}" ${opt.value === currentSettings.preferences.language ? 'selected' : ''}>${opt.label}</option>`)
    .join('');

  select.addEventListener('change', async () => {
    const { success, settings } = await updateSettings({ preferences: { language: select.value } });
    if (success) {
      currentSettings = settings;
      showToast('Language preference saved.', 'success');
    } else {
      showToast('Could not save your language preference.', 'error');
    }
  });
}

/* ---------------------------------------------------------------------
 * Theme Preference (UI placeholder — saves the choice, doesn't re-theme yet)
 * --------------------------------------------------------------------- */

function renderThemeOptions() {
  const mount = qs('[data-theme-options]');
  mount.innerHTML = themeOptions.map((opt) => createThemeCard(opt, opt.value === currentSettings.preferences.theme)).join('');
}

function initThemeListeners() {
  qs('[data-theme-options]').addEventListener('click', async (e) => {
    const card = e.target.closest('[data-theme-value]');
    if (!card) return;
    const value = card.dataset.themeValue;

    const { success, settings } = await updateSettings({ preferences: { theme: value } });
    if (!success) return showToast('Could not save your theme preference.', 'error');

    currentSettings = settings;
    qsAll('[data-theme-value]', e.currentTarget).forEach((c) => c.classList.remove('is-selected'));
    card.classList.add('is-selected');
    showToast('Theme preference saved.', 'success');
  });
}

/* ---------------------------------------------------------------------
 * Logout
 * --------------------------------------------------------------------- */

function initLogout() {
  qs('[data-action="logout"]').addEventListener('click', () => openModal('logoutConfirmModal'));

  qs('[data-action="confirm-logout"]').addEventListener('click', async () => {
    const { success } = await logoutUser();
    closeModal('logoutConfirmModal');
    if (!success) return showToast('Something went wrong. Please try again.', 'error');
    showToast('You have been logged out.', 'success');
    window.location.href = routes.dashboard;
  });
}

/* ---------------------------------------------------------------------
 * Deactivate Account
 * --------------------------------------------------------------------- */

function initDeactivate() {
  qs('[data-action="deactivate"]').addEventListener('click', () => openModal('deactivateConfirmModal'));

  qs('[data-action="confirm-deactivate"]').addEventListener('click', async () => {
    const { success } = await deactivateAccount();
    closeModal('deactivateConfirmModal');
    if (!success) return showToast('Something went wrong. Please try again.', 'error');
    showToast('Your account has been deactivated.', 'success');
    window.location.href = routes.dashboard;
  });
}

/* ---------------------------------------------------------------------
 * Init
 * --------------------------------------------------------------------- */

async function initSettings() {
  initToggleListeners();
  initThemeListeners();
  initLogout();
  initDeactivate();

  currentSettings = await getSettings();
  await renderAccountSummary();
  renderToggleGroup('[data-notification-toggles]', NOTIFICATION_TOGGLES);
  renderToggleGroup('[data-privacy-toggles]', PRIVACY_TOGGLES);
  renderLanguageOptions();
  renderThemeOptions();
}

document.addEventListener('DOMContentLoaded', initSettings);
