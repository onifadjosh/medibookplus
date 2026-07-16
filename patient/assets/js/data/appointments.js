/**
 * data/appointments.js
 * ---------------------------------------------------------------------------
 * Mock appointment records, shaped the way a MongoDB "appointments"
 * collection would realistically come back (populated with a doctor
 * sub-document). Swap the array below for a real API response later —
 * every render function downstream only depends on this shape.
 * ---------------------------------------------------------------------------
 */

/** The appointment highlighted in the dashboard hero ("Join Appointment"). */
export const featuredAppointment = {
  id: 'APT-9001',
  doctorName: 'Dr. Sarah Jenkins',
  doctorInitials: 'SJ',
  department: 'Cardiology Department',
  date: 'Today, Oct 24',
  time: '10:30 AM',
  status: 'confirmed',
};

/** Rows for the "Upcoming Appointments" table. */
export const appointments = [
  { id: 'APT-9002', doctorName: 'Dr. Robert Carter', doctorInitials: 'RC', department: 'Pediatrics', date: 'Oct 26, 2023', time: '09:00 AM', status: 'confirmed' },
  { id: 'APT-9003', doctorName: 'Dr. Emily Chen', doctorInitials: 'EC', department: 'Ophthalmology', date: 'Oct 29, 2023', time: '02:15 PM', status: 'pending' },
  { id: 'APT-9004', doctorName: 'Dr. Marcus Thorne', doctorInitials: 'MT', department: 'Orthopedics', date: 'Nov 02, 2023', time: '11:00 AM', status: 'confirmed' },
  { id: 'APT-9005', doctorName: 'Dr. Sophia Al-Khouri', doctorInitials: 'SK', department: 'Dermatology', date: 'Nov 05, 2023', time: '04:30 PM', status: 'cancelled' },
];

/** Reminder shown in the hero's "Next Appointment" banner. */
export const nextAppointmentReminder = {
  label: 'Next Appointment',
  detail: 'In 3 Days',
};

/** Summary counters for the Quick Stats row. Icon names map to Bootstrap Icons. */
export const dashboardStats = [
  { key: 'upcoming', label: 'Upcoming', value: '03', icon: 'bi-calendar2-week', tone: 'teal' },
  { key: 'completed', label: 'Completed', value: '12', icon: 'bi-check2-circle', tone: 'blue' },
  { key: 'pending', label: 'Pending', value: '01', icon: 'bi-hourglass-split', tone: 'amber' },
  { key: 'records', label: 'Records', value: '24', icon: 'bi-file-earmark-text', tone: 'dark-teal' },
];

/**
 * Full appointment history, shown on pages/appointment-history.html. A
 * superset of `appointments` above (same upcoming rows, plus completed and
 * cancelled ones) — kept as a separate export so the Dashboard's "Upcoming
 * Appointments" table (which renders `appointments` directly) is never
 * affected by adding past records here.
 */
export const appointmentHistory = [
  { id: 'APT-9001', doctorId: 'DOC-101', doctorName: 'Dr. Sarah Jenkins', doctorInitials: 'SJ', department: 'Cardiology', date: 'Oct 24, 2023', time: '10:30 AM', status: 'confirmed', notes: 'Follow-up on recent ECG results. Bring prior lab reports.' },
  { id: 'APT-9002', doctorId: 'DOC-102', doctorName: 'Dr. Robert Carter', doctorInitials: 'RC', department: 'Pediatrics', date: 'Oct 26, 2023', time: '09:00 AM', status: 'confirmed', notes: '' },
  { id: 'APT-9003', doctorId: 'DOC-103', doctorName: 'Dr. Emily Chen', doctorInitials: 'EC', department: 'Ophthalmology', date: 'Oct 29, 2023', time: '02:15 PM', status: 'pending', notes: '' },
  { id: 'APT-9004', doctorId: 'DOC-104', doctorName: 'Dr. Marcus Thorne', doctorInitials: 'MT', department: 'Orthopedics', date: 'Nov 02, 2023', time: '11:00 AM', status: 'confirmed', notes: '' },
  { id: 'APT-9005', doctorId: 'DOC-105', doctorName: 'Dr. Sophia Al-Khouri', doctorInitials: 'SK', department: 'Dermatology', date: 'Nov 05, 2023', time: '04:30 PM', status: 'cancelled', notes: 'Cancelled by patient — scheduling conflict.' },
  { id: 'APT-8991', doctorId: 'DOC-101', doctorName: 'Dr. Sarah Jenkins', doctorInitials: 'SJ', department: 'Cardiology', date: 'Sep 12, 2023', time: '09:30 AM', status: 'completed', notes: 'Annual cardiac checkup. Blood pressure within normal range.' },
  { id: 'APT-8975', doctorId: 'DOC-104', doctorName: 'Dr. Marcus Thorne', doctorInitials: 'MT', department: 'Orthopedics', date: 'Aug 30, 2023', time: '01:00 PM', status: 'completed', notes: 'Physical therapy assessment completed. Continue home exercises.' },
  { id: 'APT-8960', doctorId: 'DOC-105', doctorName: 'Dr. Sophia Al-Khouri', doctorInitials: 'SK', department: 'Dermatology', date: 'Aug 18, 2023', time: '03:45 PM', status: 'completed', notes: '' },
  { id: 'APT-8942', doctorId: 'DOC-102', doctorName: 'Dr. Robert Carter', doctorInitials: 'RC', department: 'Pediatrics', date: 'Aug 05, 2023', time: '10:15 AM', status: 'cancelled', notes: 'Rescheduled to a later date at patient request.' },
  { id: 'APT-8920', doctorId: 'DOC-106', doctorName: 'Dr. Aisha Bello', doctorInitials: 'AB', department: 'Oncology', date: 'Jul 22, 2023', time: '11:30 AM', status: 'completed', notes: 'Routine screening. No follow-up required at this time.' },
];
