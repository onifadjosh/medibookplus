/**
 * data/quickActions.js
 * ---------------------------------------------------------------------------
 * Unlike the other files in data/, this isn't a mock backend resource — it's
 * static UI configuration (dashboard shortcut links). It still lives here,
 * outside the HTML, so page markup never needs to change to add/reorder
 * shortcuts.
 * ---------------------------------------------------------------------------
 */

export const quickActions = [
  { title: 'Book Appointment', desc: 'Schedule a new visit.', icon: 'bi-calendar-plus', tone: 'solid-primary', href: 'appointments.html' },
  { title: 'Digital Card', desc: 'Insurance and ID.', icon: 'bi-credit-card-2-front', tone: 'secondary', href: 'patient-card.html' },
  { title: 'Medical Records', desc: 'Access your history.', icon: 'bi-folder2-open', tone: 'teal-tint', href: '#' },
  { title: 'Request Prescription', desc: 'Renew your meds.', icon: 'bi-capsule', tone: 'amber-tint', href: '#' },
  { title: 'Update Profile', desc: 'Manage your info.', icon: 'bi-person-gear', tone: 'amber-tint-2', href: 'profile.html' },
  { title: 'Contact Hospital', desc: 'Get in touch with us.', icon: 'bi-telephone', tone: 'neutral', href: '#' },
];
