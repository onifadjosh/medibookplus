/**
 * data/doctors.js
 * ---------------------------------------------------------------------------
 * Mock doctor directory. Powers the Dashboard's appointment rows (via
 * doctorName/doctorInitials duplicated there for now — see note below) and
 * the Appointment Booking wizard's Doctor Selection step, filtered by
 * `departmentId`.
 * ---------------------------------------------------------------------------
 */

export const doctors = [
  {
    id: 'DOC-101', name: 'Dr. Sarah Jenkins', initials: 'SJ', departmentId: 'cardiology', department: 'Cardiology',
    rating: 4.9, reviews: 124, experienceYears: 12, fee: 150,
    availableToday: true, nextAvailable: 'Today, 2:00 PM',
  },
  {
    id: 'DOC-102', name: 'Dr. Robert Carter', initials: 'RC', departmentId: 'pediatrics', department: 'Pediatrics',
    rating: 4.7, reviews: 98, experienceYears: 10, fee: 120,
    availableToday: true, nextAvailable: 'Today, 4:30 PM',
  },
  {
    id: 'DOC-103', name: 'Dr. Emily Chen', initials: 'EC', departmentId: 'ophthalmology', department: 'Ophthalmology',
    rating: 4.8, reviews: 76, experienceYears: 9, fee: 135,
    availableToday: false, nextAvailable: 'Tomorrow, 10:00 AM',
  },
  {
    id: 'DOC-104', name: 'Dr. Marcus Thorne', initials: 'MT', departmentId: 'orthopedics', department: 'Orthopedics',
    rating: 4.8, reviews: 152, experienceYears: 15, fee: 180,
    availableToday: false, nextAvailable: 'Tomorrow, 9:00 AM',
  },
  {
    id: 'DOC-105', name: 'Dr. Sophia Al-Khouri', initials: 'SK', departmentId: 'dermatology', department: 'Dermatology',
    rating: 5.0, reviews: 64, experienceYears: 8, fee: 140,
    availableToday: true, nextAvailable: 'Today, 5:00 PM',
  },
  {
    id: 'DOC-106', name: 'Dr. Aisha Bello', initials: 'AB', departmentId: 'oncology', department: 'Oncology',
    rating: 4.9, reviews: 88, experienceYears: 14, fee: 200,
    availableToday: false, nextAvailable: 'Monday, 11:00 AM',
  },
];
