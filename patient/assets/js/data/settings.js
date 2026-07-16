/**
 * data/settings.js
 * ---------------------------------------------------------------------------
 * Mock user preferences, shaped the way a real "settings" document would
 * come back from the backend. Distinct from data/patient.js — settings are
 * app/account preferences, not medical or personal-identity data.
 * ---------------------------------------------------------------------------
 */

export const settings = {
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    appointmentReminders: true,
    marketingUpdates: false,
  },
  privacy: {
    twoFactorEnabled: false,
    shareDataWithProviders: true,
  },
  preferences: {
    language: 'en',
    theme: 'system',
  },
};

/** Options for the Language Preference select. */
export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'pt', label: 'Português' },
];

/** Options for the Theme Preference cards. Visual theming itself is a
 *  placeholder for now — selecting one only saves the preference. */
export const themeOptions = [
  { value: 'system', label: 'System Default', icon: 'bi-circle-half', desc: 'Matches your device settings.' },
  { value: 'light', label: 'Light', icon: 'bi-sun', desc: 'Bright background, dark text.' },
  { value: 'dark', label: 'Dark', icon: 'bi-moon-stars', desc: 'Dark background, light text.' },
];
