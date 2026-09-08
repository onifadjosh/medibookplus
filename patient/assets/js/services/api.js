/**
 * services/api.js
 * ---------------------------------------------------------------------------
 * The single boundary between the UI and "the backend". Every function here
 * currently resolves mock data from assets/js/data/*.js, wrapped in a
 * Promise to mirror real network latency.
 *
 * WHEN THE NODE/EXPRESS + MONGODB API IS READY:
 *   Replace each function body with a `fetch(...)` call to the matching
 *   REST endpoint. Because every function already returns a Promise of the
 *   same shape, no calling code (components.js, dashboard.js, future pages)
 *   needs to change — only this file does.
 *
 *   e.g. getAppointments():
 *     mock:  () => mockResponse(appointments)
 *     real:  () => fetch('/api/appointments').then((res) => res.json())
 * ---------------------------------------------------------------------------
 */

import { patient } from '../data/patient.js';
import { appointments, featuredAppointment, nextAppointmentReminder, dashboardStats, appointmentHistory } from '../data/appointments.js';
import { notifications } from '../data/notifications.js';
import { doctors } from '../data/doctors.js';
import { medicalRecords } from '../data/medicalRecords.js';
import { departments } from '../data/departments.js';
import { timeSlotSections } from '../data/timeSlots.js';
import { settings } from '../data/settings.js';
import { conversations, messagesByConversation } from '../data/messages.js';

/** Simulated network latency, in milliseconds. */
const MOCK_LATENCY_MS = 200;

/**
 * Wraps a value in a Promise that resolves after MOCK_LATENCY_MS, so
 * calling code can already `await` it exactly like a real fetch().
 * @template T
 * @param {T} payload
 * @returns {Promise<T>}
 */
function mockResponse(payload) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(payload), MOCK_LATENCY_MS);
  });
}

/* ---------------------------------------------------------------------
 * Reads
 * --------------------------------------------------------------------- */

function getLiveUser() {
  try {
    const raw = localStorage.getItem('medibookplus_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/* ---------------------------------------------------------------------
 * Reads
 * --------------------------------------------------------------------- */

export const getPatient = () => {
  const liveUser = getLiveUser();
  if (liveUser) {
    const fn = liveUser.firstName || patient.firstName;
    const ln = liveUser.lastName || patient.lastName;
    const initials = `${fn[0] || ''}${ln[0] || ''}`.toUpperCase() || patient.initials;
    return mockResponse({
      ...patient,
      id: liveUser.patientId || liveUser._id || patient.id,
      firstName: fn,
      lastName: ln,
      initials,
      contact: {
        ...patient.contact,
        email: liveUser.email || patient.contact.email,
        phone: liveUser.phone || patient.contact.phone,
      },
      healthSummary: {
        bloodGroup: liveUser.bloodGroup || patient.healthSummary.bloodGroup,
        insuranceStatus: liveUser.insuranceProvider || patient.healthSummary.insuranceStatus,
        allergies: liveUser.allergies ? (Array.isArray(liveUser.allergies) ? liveUser.allergies.join(', ') : liveUser.allergies) : patient.healthSummary.allergies,
      },
      profileCompletion: liveUser.bloodGroup ? 100 : 75,
    });
  }
  return mockResponse(patient);
};

export const getAppointments = async () => {
  const token = localStorage.getItem('medibookplus_token');
  if (token) {
    try {
      const res = await fetch('https://medium-backend-md5a.onrender.com/api/patients/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map(apt => ({
          id: apt._id || apt.id,
          doctorName: apt.doctorId ? `Dr. ${apt.doctorId.firstName || ''} ${apt.doctorId.lastName || ''}`.trim() : 'Assigned Doctor',
          department: apt.department || apt.doctorId?.department || 'General Medicine',
          date: apt.date || 'Today',
          time: apt.time || '10:00 AM',
          status: apt.status || 'confirmed',
          doctorInitials: apt.doctorId ? `${apt.doctorId.firstName?.[0] || 'D'}${apt.doctorId.lastName?.[0] || 'R'}` : 'DR'
        }));
      }
    } catch(e) {}
  }
  return appointments;
};

export const getAppointmentHistory = () => mockResponse(appointmentHistory);
export const getFeaturedAppointment = async () => {
  const appts = await getAppointments();
  return appts.length > 0 ? appts[0] : featuredAppointment;
};
export const getNextAppointmentReminder = async () => {
  const appts = await getAppointments();
  if (appts.length > 0) {
    return { label: `Upcoming: ${appts[0].doctorName}`, detail: `${appts[0].date} at ${appts[0].time}` };
  }
  return nextAppointmentReminder;
};
export const getDashboardStats = async () => {
  const appts = await getAppointments();
  const upcomingCount = appts.filter(a => a.status === 'confirmed' || a.status === 'pending').length;
  const completedCount = appts.filter(a => a.status === 'completed').length;
  return [
    { title: 'Upcoming Appointments', value: String(upcomingCount || 1), icon: 'bi-calendar-event', tone: 'solid-primary', badge: 'Active' },
    { title: 'Completed Visits', value: String(completedCount || 3), icon: 'bi-check2-circle', tone: 'secondary', badge: 'Total' },
    { title: 'Pending Reports', value: '0', icon: 'bi-file-earmark-medical', tone: 'amber-tint', badge: 'Up to date' },
    { title: 'Prescriptions', value: '2', icon: 'bi-capsule', tone: 'neutral', badge: 'Active' }
  ];
};
export const getNotifications = () => mockResponse(notifications);

/**
 * @param {number} limit
 * @returns {Promise<object[]>} the most recent notifications, for the
 * Dashboard sidebar's compact preview (full list lives on the
 * Notifications page).
 */
export const getRecentNotifications = (limit = 2) => mockResponse(notifications.slice(0, limit));

/** @returns {Promise<number>} count of unread notifications, for the navbar bell badge. */
export const getUnreadNotificationCount = () => mockResponse(notifications.filter((n) => !n.read).length);
export const getDoctors = () => mockResponse(doctors);
export const getMedicalRecords = () => mockResponse(medicalRecords);
export const getDepartments = () => mockResponse(departments);

/**
 * @param {string} departmentId
 * @returns {Promise<object[]>} doctors belonging to the given department.
 */
export const getDoctorsByDepartment = (departmentId) =>
  mockResponse(doctors.filter((doctor) => doctor.departmentId === departmentId));

/**
 * Mock per-day slot availability for a given doctor/month, deterministically
 * derived so it's stable across reloads without a real backend. A real
 * implementation would hit something like
 * `/api/doctors/:doctorId/availability?year=&month=`.
 * @param {string} doctorId
 * @param {number} year
 * @param {number} monthIndex - 0-11
 * @returns {Promise<Record<number, number>>} day-of-month -> slots remaining (0 = fully booked)
 */
export const getMonthAvailability = (doctorId, year, monthIndex) => {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const doctorSeed = doctorId.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const availability = {};
  for (let day = 1; day <= daysInMonth; day += 1) {
    const isFullyBooked = (day + doctorSeed) % 9 === 0;
    availability[day] = isFullyBooked ? 0 : ((day * 3 + doctorSeed) % 10) + 1;
  }
  return mockResponse(availability);
};

/**
 * @param {string} doctorId
 * @param {string} dateIso - the selected date, e.g. "2023-10-26"
 * @returns {Promise<object[]>} the Morning/Afternoon slot sections
 */
export const getTimeSlots = (doctorId, dateIso) => mockResponse(timeSlotSections);

/* ---------------------------------------------------------------------
 * Writes  (placeholders — wire up to real POST/PATCH/DELETE endpoints)
 * --------------------------------------------------------------------- */

/**
 * @param {object} payload - { doctorId, departmentId, date, time }
 * @returns {Promise<{success: boolean, appointment: object}>}
 */
export const bookAppointment = (payload) =>
  mockResponse({
    success: true,
    appointment: {
      id: `APT-${Date.now()}`,
      referenceNumber: `MB-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'pending',
      ...payload,
    },
  });

/**
 * @param {string} appointmentId
 * @returns {Promise<{success: boolean, appointmentId: string}>}
 */
export const cancelAppointment = (appointmentId) =>
  mockResponse({ success: true, appointmentId });

/**
 * Marks an appointment for rescheduling. In this mock stage the actual new
 * time is chosen by sending the patient back through the Booking wizard
 * (see appointments.js's `?doctorId=` handling) — this call just records
 * the intent, mirroring what a real `PATCH /appointments/:id/reschedule`
 * would acknowledge before the new slot is picked.
 * @param {string} appointmentId
 * @returns {Promise<{success: boolean, appointmentId: string}>}
 */
export const rescheduleAppointment = (appointmentId) =>
  mockResponse({ success: true, appointmentId });

/**
 * @param {string} notificationId
 * @returns {Promise<{success: boolean, notificationId: string}>}
 */
export const markNotificationRead = (notificationId) =>
  mockResponse({ success: true, notificationId });

/** @returns {Promise<{success: boolean}>} */
export const markAllNotificationsRead = () => mockResponse({ success: true });

/**
 * @param {string} notificationId
 * @returns {Promise<{success: boolean, notificationId: string}>}
 */
export const deleteNotification = (notificationId) =>
  mockResponse({ success: true, notificationId });

/**
 * @param {object} updates - partial patient fields to merge
 * @returns {Promise<{success: boolean, patient: object}>}
 */
export const updateProfile = (updates) =>
  mockResponse({ success: true, patient: { ...patient, ...updates } });

/**
 * @param {object} payload - { currentPassword, newPassword }
 * @returns {Promise<{success: boolean}>}
 */
export const changePassword = (payload) => mockResponse({ success: true });

export const getSettings = () => mockResponse(settings);

/**
 * Merges partial updates into the settings object, mirroring
 * updateProfile()'s pattern. One flexible endpoint handles every toggle,
 * select, and preference on the Settings page rather than one per field.
 * @param {object} updates - partial settings fields to merge (can be nested,
 * e.g. { notifications: { smsNotifications: true } })
 * @returns {Promise<{success: boolean, settings: object}>}
 */
export const updateSettings = (updates) =>
  mockResponse({
    success: true,
    settings: {
      ...settings,
      ...updates,
      notifications: { ...settings.notifications, ...updates.notifications },
      privacy: { ...settings.privacy, ...updates.privacy },
      preferences: { ...settings.preferences, ...updates.preferences },
    },
  });

/**
 * Ends the current session. In this mock stage there's no real auth token
 * to invalidate — this call exists so the Settings page's Logout action is
 * already shaped like a real `POST /auth/logout` for when one exists.
 * @returns {Promise<{success: boolean}>}
 */
export const logoutUser = () => {
  localStorage.removeItem('medibookplus_token');
  localStorage.removeItem('medibookplus_user');
  return mockResponse({ success: true });
};

/**
 * Soft-deletes (deactivates) the patient's account. A real implementation
 * would flag the record inactive rather than hard-deleting it.
 * @returns {Promise<{success: boolean}>}
 */
export const deactivateAccount = () => mockResponse({ success: true });

/* ---------------------------------------------------------------------
 * Messages
 * --------------------------------------------------------------------- */

/** @returns {Promise<object[]>} conversation list, sorted most-recent first. */
export const getConversations = () =>
  mockResponse([...conversations].sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)));

/**
 * @param {string} conversationId
 * @returns {Promise<object[]>} the full message thread for one conversation.
 */
export const getMessages = (conversationId) => mockResponse(messagesByConversation[conversationId] || []);

/**
 * Sends a message and appends it to the mock thread, updating that
 * conversation's preview. A real backend would broadcast this over a
 * WebSocket to the doctor's side too — see subscribeToMessages() below
 * for where that would plug in on the receiving end.
 * @param {string} conversationId
 * @param {string} text
 * @returns {Promise<{success: boolean, message: object}>}
 */
export const sendMessage = (conversationId, text) => {
  const message = { id: `MSG-${Date.now()}`, sender: 'patient', text, timestamp: new Date().toISOString() };
  if (!messagesByConversation[conversationId]) messagesByConversation[conversationId] = [];
  messagesByConversation[conversationId].push(message);

  const conversation = conversations.find((c) => c.id === conversationId);
  if (conversation) {
    conversation.lastMessage = text;
    conversation.lastMessageAt = message.timestamp;
  }

  return mockResponse({ success: true, message });
};

/**
 * @param {string} conversationId
 * @returns {Promise<{success: boolean}>}
 */
export const markConversationRead = (conversationId) => {
  const conversation = conversations.find((c) => c.id === conversationId);
  if (conversation) conversation.unreadCount = 0;
  return mockResponse({ success: true });
};

/**
 * PREPARED FOR REAL-TIME, NOT IMPLEMENTED: with a real backend this would
 * open a WebSocket (or long-poll) connection scoped to `conversationId` and
 * invoke `onMessage(newMessage)` whenever the doctor's side sends
 * something, so the chat updates live without a page refresh.
 *
 * It's a deliberate no-op for now — returns an `unsubscribe` function so
 * call sites can already be written the way they'll work once this is
 * real, e.g.:
 *   const unsubscribe = subscribeToMessages(id, (msg) => appendBubble(msg));
 *   // later: unsubscribe();
 * @param {string} conversationId
 * @param {(message: object) => void} onMessage
 * @returns {() => void} unsubscribe
 */
export const subscribeToMessages = (conversationId, onMessage) => {
  return () => {};
};
