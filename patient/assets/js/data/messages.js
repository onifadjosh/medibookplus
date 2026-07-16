/**
 * data/messages.js
 * ---------------------------------------------------------------------------
 * Mock conversations + message threads for the Messages page. Shaped like
 * two separate real endpoints would return:
 *   - conversations: a lightweight list (last message preview, unread count)
 *   - messagesByConversation: the full thread for a given conversation,
 *     fetched only when that conversation is opened
 *
 * Reuses the same doctor pool as data/doctors.js so names/departments stay
 * consistent with the rest of the app.
 * ---------------------------------------------------------------------------
 */

export const conversations = [
  {
    id: 'CONV-001',
    doctorId: 'DOC-101',
    doctorName: 'Dr. Sarah Jenkins',
    doctorInitials: 'SJ',
    department: 'Cardiology',
    lastMessage: 'Your latest ECG results look great — no concerns on my end.',
    lastMessageAt: '2023-10-24T09:12:00',
    unreadCount: 2,
  },
  {
    id: 'CONV-002',
    doctorId: 'DOC-104',
    doctorName: 'Dr. Marcus Thorne',
    doctorInitials: 'MT',
    department: 'Orthopedics',
    lastMessage: 'Continue the home exercises and we\'ll reassess in 2 weeks.',
    lastMessageAt: '2023-10-22T14:35:00',
    unreadCount: 0,
  },
  {
    id: 'CONV-003',
    doctorId: 'DOC-105',
    doctorName: 'Dr. Sophia Al-Khouri',
    doctorInitials: 'SK',
    department: 'Dermatology',
    lastMessage: 'Sure, sending the prescription refill now.',
    lastMessageAt: '2023-10-20T11:02:00',
    unreadCount: 0,
  },
  {
    id: 'CONV-004',
    doctorId: 'DOC-102',
    doctorName: 'Dr. Robert Carter',
    doctorInitials: 'RC',
    department: 'Pediatrics',
    lastMessage: 'Thanks for the update, see you at the next visit.',
    lastMessageAt: '2023-10-15T16:48:00',
    unreadCount: 1,
  },
];

export const messagesByConversation = {
  'CONV-001': [
    { id: 'MSG-1001', sender: 'patient', text: 'Hi Dr. Jenkins, I had my ECG done yesterday. Any updates?', timestamp: '2023-10-24T08:50:00' },
    { id: 'MSG-1002', sender: 'doctor', text: 'Hi John, yes — I just reviewed it.', timestamp: '2023-10-24T09:10:00' },
    { id: 'MSG-1003', sender: 'doctor', text: 'Your latest ECG results look great — no concerns on my end.', timestamp: '2023-10-24T09:12:00' },
  ],
  'CONV-002': [
    { id: 'MSG-2001', sender: 'doctor', text: 'How is the knee feeling after last week\'s session?', timestamp: '2023-10-22T14:20:00' },
    { id: 'MSG-2002', sender: 'patient', text: 'Much better, only mild soreness after exercises.', timestamp: '2023-10-22T14:30:00' },
    { id: 'MSG-2003', sender: 'doctor', text: 'That\'s expected and a good sign.', timestamp: '2023-10-22T14:34:00' },
    { id: 'MSG-2004', sender: 'doctor', text: 'Continue the home exercises and we\'ll reassess in 2 weeks.', timestamp: '2023-10-22T14:35:00' },
  ],
  'CONV-003': [
    { id: 'MSG-3001', sender: 'patient', text: 'Could I get a refill on my prescription?', timestamp: '2023-10-20T10:55:00' },
    { id: 'MSG-3002', sender: 'doctor', text: 'Sure, sending the prescription refill now.', timestamp: '2023-10-20T11:02:00' },
  ],
  'CONV-004': [
    { id: 'MSG-4001', sender: 'doctor', text: 'Everything looked good at today\'s checkup.', timestamp: '2023-10-15T16:40:00' },
    { id: 'MSG-4002', sender: 'patient', text: 'Great, thank you for seeing us today!', timestamp: '2023-10-15T16:45:00' },
    { id: 'MSG-4003', sender: 'doctor', text: 'Thanks for the update, see you at the next visit.', timestamp: '2023-10-15T16:48:00' },
  ],
};
