/**
 * data/patient.js
 * ---------------------------------------------------------------------------
 * Mock shape of the "current patient" record. In production this is exactly
 * what GET /api/patients/me would return from the Node/Express + MongoDB
 * backend — nothing in the UI layer should need to change when it's wired
 * up for real, only services/api.js's implementation.
 * ---------------------------------------------------------------------------
 */

export const patient = {
  id: 'PT-20481',
  firstName: 'John',
  lastName: 'Doe',
  initials: 'JD',
  profileCompletion: 85,
  healthSummary: {
    bloodGroup: 'O+',
    insuranceStatus: 'Active',
    allergies: 'Penicillin, Peanuts',
  },
  /**
   * Fields specific to the Digital Patient Card (pages/patient-card.html).
   * Kept separate from healthSummary above so the Dashboard's existing
   * fields/shape are never touched by this addition.
   */
  idCard: {
    cardNumber: 'MB-902-441-20',
    fullName: 'John Michael Doe',
    nationality: 'United States',
    citizenStatus: 'Citizen',
    bloodGroup: 'O+',
    bloodGroupLabel: 'Positive',
    primaryDoctor: 'Dr. Sarah Jenkins',
    emergencyContact: { name: 'Sarah Doe', relation: 'Wife', phone: '+1 (555) 987-6543' },
    insurance: { provider: 'Aetna Health Premium', policyNumber: 'AET-9021-XPR' },
    registeredDate: '2021-10-01',
    expiresDate: '2025-10-01',
    allergies: [
      { name: 'Penicillin', severity: 'critical' },
      { name: 'Peanuts', severity: 'critical' },
      { name: 'Latex', severity: 'mild' },
    ],
    verification: { status: 'Active Patient', detail: 'Last verification: 4 hours ago via General Clinic Check-in.' },
    emergencyInstructions: 'In case of fainting, please refer to allergy bracelet on left wrist. Do not administer aspirin without confirming recent vitals.',
  },
  /**
   * Fields specific to the Profile page (pages/profile.html). Additive,
   * like idCard above — nothing here overlaps with or changes the fields
   * the Dashboard or Patient Card already depend on. Where a value already
   * exists elsewhere on this object (blood group, allergies, registration
   * date, insurance), the Profile page reads it from there directly
   * instead of duplicating it here.
   */
  contact: {
    email: 'john.doe@medibook-demo.com',
    phone: '+1 (555) 123-4567',
  },
  personal: {
    dateOfBirth: '1988-04-12',
    gender: 'Male',
    address: { street: '221B Baker Street', city: 'Springfield', state: 'IL', zip: '62704' },
  },
  medical: {
    chronicConditions: ['Hypertension'],
    currentMedications: ['Lisinopril 10mg — once daily'],
  },
  account: {
    status: 'Active',
  },
};
