/**
 * data/timeSlots.js
 * ---------------------------------------------------------------------------
 * Mock time-slot template for the Booking wizard's "Select Time" step.
 * `occupied: true` simulates a slot another patient already booked with
 * this doctor on the selected day (as a real API would return per
 * doctor/date — see services/api.js#getTimeSlots).
 * ---------------------------------------------------------------------------
 */

export const timeSlotSections = [
  {
    id: 'morning',
    label: 'Morning Sessions',
    range: '8:00 AM - 12:00 PM',
    icon: 'bi-brightness-high',
    slots: [
      { time: '08:00', period: 'AM' },
      { time: '08:30', period: 'AM' },
      { time: '09:00', period: 'AM' },
      { time: '09:30', period: 'AM' },
      { time: '10:00', period: 'AM', occupied: true },
      { time: '10:30', period: 'AM', occupied: true },
      { time: '11:00', period: 'AM' },
      { time: '11:30', period: 'AM' },
    ],
  },
  {
    id: 'afternoon',
    label: 'Afternoon Sessions',
    range: '1:00 PM - 5:00 PM',
    icon: 'bi-sun',
    slots: [
      { time: '01:00', period: 'PM' },
      { time: '01:30', period: 'PM', occupied: true },
      { time: '02:00', period: 'PM' },
      { time: '02:30', period: 'PM' },
      { time: '03:00', period: 'PM' },
      { time: '03:30', period: 'PM' },
      { time: '04:00', period: 'PM' },
      { time: '04:30', period: 'PM' },
    ],
  },
];
