/**
 * data/departments.js
 * ---------------------------------------------------------------------------
 * Mock hospital department directory, shown as the first step of the
 * Appointment Booking wizard. `tone` maps to the same icon-tint modifier
 * classes already used by the Dashboard's Quick Action cards
 * (components.css §8), so department cards reuse that component exactly.
 * ---------------------------------------------------------------------------
 */

export const departments = [
  { id: 'cardiology', name: 'Cardiology', icon: 'bi-heart-pulse', tone: 'solid-primary', description: 'Heart rhythm disorders, vascular disease, and comprehensive cardiac care.' },
  { id: 'pediatrics', name: 'Pediatrics', icon: 'bi-emoji-smile', tone: 'amber-tint', description: 'Specialized medical care for infants, children, and adolescents.' },
  { id: 'ophthalmology', name: 'Ophthalmology', icon: 'bi-eye', tone: 'secondary', description: 'Comprehensive eye exams, vision correction, and surgical eye care.' },
  { id: 'orthopedics', name: 'Orthopedics', icon: 'bi-activity', tone: 'teal-tint', description: 'Bone health, sports medicine, joint replacements, and physical therapy.' },
  { id: 'dermatology', name: 'Dermatology', icon: 'bi-bandaid', tone: 'amber-tint-2', description: 'Skin cancer screenings, medical dermatology, and aesthetic procedures.' },
  { id: 'oncology', name: 'Oncology', icon: 'bi-shield-plus', tone: 'neutral', description: 'Comprehensive cancer treatment, infusion therapy, and genetic counseling.' },
];
