/**
 * data/notifications.js
 * ---------------------------------------------------------------------------
 * Mock notification feed. Powers both the Dashboard sidebar's short preview
 * (see services/api.js#getRecentNotifications) and the full Notifications
 * page (pages/notifications.html).
 *
 * `category` drives the filter tabs on the Notifications page and the icon
 * tint (components.css §39): 'appointments' | 'reminders' | 'system'.
 * ---------------------------------------------------------------------------
 */

export const notifications = [
  {
    id: 'NTF-001',
    title: 'Lab results ready',
    description: 'Your recent bloodwork panel results are now available to view.',
    category: 'appointments',
    icon: 'bi-clipboard2-pulse',
    timestamp: '2023-10-24T08:15:00',
    read: false,
  },
  {
    id: 'NTF-002',
    title: 'Appointment confirmed',
    description: 'Your appointment with Dr. Sarah Jenkins on Oct 24 has been confirmed.',
    category: 'appointments',
    icon: 'bi-calendar-check',
    timestamp: '2023-10-23T17:40:00',
    read: false,
  },
  {
    id: 'NTF-003',
    title: 'Upcoming appointment reminder',
    description: 'You have an appointment with Dr. Robert Carter tomorrow at 9:00 AM.',
    category: 'reminders',
    icon: 'bi-alarm',
    timestamp: '2023-10-25T09:00:00',
    read: false,
  },
  {
    id: 'NTF-004',
    title: 'Prescription refill reminder',
    description: 'Your prescription for Lisinopril is due for a refill in 3 days.',
    category: 'reminders',
    icon: 'bi-capsule',
    timestamp: '2023-10-22T12:00:00',
    read: true,
  },
  {
    id: 'NTF-005',
    title: 'Appointment cancelled',
    description: 'Your appointment with Dr. Sophia Al-Khouri on Nov 5 was cancelled.',
    category: 'appointments',
    icon: 'bi-calendar-x',
    timestamp: '2023-10-21T15:20:00',
    read: true,
  },
  {
    id: 'NTF-006',
    title: 'New message from care team',
    description: 'You have a new secure message from the Cardiology department.',
    category: 'system',
    icon: 'bi-chat-dots',
    timestamp: '2023-10-20T11:05:00',
    read: true,
  },
  {
    id: 'NTF-007',
    title: 'Profile update required',
    description: 'Please verify your emergency contact information to keep your profile up to date.',
    category: 'system',
    icon: 'bi-person-exclamation',
    timestamp: '2023-10-19T08:30:00',
    read: false,
  },
  {
    id: 'NTF-008',
    title: 'Insurance verification complete',
    description: 'Your Aetna Health Premium coverage has been verified for upcoming visits.',
    category: 'system',
    icon: 'bi-shield-check',
    timestamp: '2023-10-18T14:10:00',
    read: true,
  },
];
