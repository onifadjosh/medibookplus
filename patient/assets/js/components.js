/**
 * components.js
 * ---------------------------------------------------------------------------
 * Reusable, data-bound HTML template builders. Each function takes a plain
 * data object (the same shape returned by services/api.js) and returns a
 * markup string ready to inject via .innerHTML. Designed to be shared by
 * the Patient, Doctor, and Admin dashboards — none of these know or care
 * which page renders them.
 * ---------------------------------------------------------------------------
 */

import { resolveStatusBadge } from './ui.js';
import { escapeHtml } from './helpers.js';

/** Statistic card: icon + label + value (e.g. "Upcoming — 03"). */
export function createStatCard({ label, value, icon, tone }) {
  return `
    <div class="mb-stat-card fade-in-up">
      <div class="mb-stat-card__icon ${tone}">
        <i class="bi ${icon}" aria-hidden="true"></i>
      </div>
      <p class="mb-stat-card__label">${escapeHtml(label)}</p>
      <h4 class="mb-stat-card__value">${escapeHtml(value)}</h4>
    </div>`;
}

/** Quick-action shortcut card (icon + title + description, linking out). */
export function createActionCard({ title, desc, icon, tone, href }) {
  return `
    <a href="${escapeHtml(href)}" class="mb-action-card fade-in-up" role="button">
      <div class="mb-action-card__icon ${tone}">
        <i class="bi ${icon}" aria-hidden="true"></i>
      </div>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(desc)}</p>
    </a>`;
}

/** One row of the appointments table (doctor, department, date, time, status). */
export function createAppointmentRow({ doctorName, doctorInitials, department, date, time, status }) {
  const badge = resolveStatusBadge(status);
  return `
    <tr>
      <td>
        <div class="doctor-cell">
          <div class="avatar-initials" style="width:32px;height:32px;font-size:12px;" aria-hidden="true">${escapeHtml(doctorInitials)}</div>
          <span class="doctor-name">${escapeHtml(doctorName)}</span>
        </div>
      </td>
      <td>${escapeHtml(department)}</td>
      <td>${escapeHtml(date)}</td>
      <td>${escapeHtml(time)}</td>
      <td><span class="mb-badge ${badge.cls}">${escapeHtml(badge.label)}</span></td>
      <td>
        <button type="button" class="mb-row-action" aria-label="More actions for appointment with ${escapeHtml(doctorName)}">
          <i class="bi bi-three-dots" aria-hidden="true"></i>
        </button>
      </td>
    </tr>`;
}

/**
 * One row of the Appointment History table. Same doctor-cell/badge markup
 * as createAppointmentRow above, but with three explicit actions (View,
 * Reschedule, Cancel) instead of a single overflow menu — Cancel/Reschedule
 * only render for statuses where they're valid actions.
 */
export function createAppointmentHistoryRow({ id, doctorName, doctorInitials, department, date, time, status }) {
  const badge = resolveStatusBadge(status);
  const canModify = status === 'confirmed' || status === 'pending';

  return `
    <tr data-appointment-id="${escapeHtml(id)}">
      <td>
        <div class="doctor-cell">
          <div class="avatar-initials" style="width:32px;height:32px;font-size:12px;" aria-hidden="true">${escapeHtml(doctorInitials)}</div>
          <span class="doctor-name">${escapeHtml(doctorName)}</span>
        </div>
      </td>
      <td>${escapeHtml(department)}</td>
      <td>${escapeHtml(date)}</td>
      <td>${escapeHtml(time)}</td>
      <td><span class="mb-badge ${badge.cls}">${escapeHtml(badge.label)}</span></td>
      <td>
        <div class="d-flex gap-1">
          <button type="button" class="mb-row-action" data-action="view-appointment" aria-label="View details for appointment with ${escapeHtml(doctorName)}">
            <i class="bi bi-eye" aria-hidden="true"></i>
          </button>
          ${canModify ? `
          <button type="button" class="mb-row-action" data-action="reschedule-appointment" aria-label="Reschedule appointment with ${escapeHtml(doctorName)}">
            <i class="bi bi-arrow-repeat" aria-hidden="true"></i>
          </button>
          <button type="button" class="mb-row-action danger" data-action="cancel-appointment" aria-label="Cancel appointment with ${escapeHtml(doctorName)}">
            <i class="bi bi-x-circle" aria-hidden="true"></i>
          </button>` : ''}
        </div>
      </td>
    </tr>`;
}

/** Compact notification list item used in the sidebar preview. */
export function createMiniNotification({ title }) {
  return `
    <div class="mb-mini-notification">
      <div class="mb-mini-notification__dot" aria-hidden="true"></div>
      <p>${escapeHtml(title)}</p>
    </div>`;
}

/** Sidebar mini-calendar grid (day-of-week header + one week of dates). */
export function createMiniCalendarGrid({ days }) {
  const dowHtml = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => `<div class="dow">${d}</div>`).join('');
  const daysHtml = days.map(({ label, state = '' }) => `<div class="day ${state}">${label}</div>`).join('');
  return dowHtml + daysHtml;
}

/**
 * One notification card (components.css §39). `formattedDateTime` is
 * passed in pre-formatted by the caller (helpers.formatDate/formatTime)
 * so this stays a pure presentation template, consistent with every other
 * create*() function in this file.
 */
export function createNotificationCard({ id, title, description, category, icon, formattedDateTime, read }) {
  return `
    <article class="mb-notification-card${read ? '' : ' is-unread'}" data-notification-id="${escapeHtml(id)}">
      <div class="mb-notification-card__icon ${escapeHtml(category)}">
        <i class="bi ${icon}" aria-hidden="true"></i>
      </div>
      <div class="mb-notification-card__body">
        <div class="mb-notification-card__head">
          <h3 class="mb-notification-card__title">
            ${!read ? '<span class="mb-notification-card__dot" aria-hidden="true"></span>' : ''}
            ${escapeHtml(title)}
          </h3>
          <div class="mb-notification-card__actions">
            ${!read ? `
            <button type="button" class="mb-row-action" data-action="mark-read" aria-label="Mark '${escapeHtml(title)}' as read">
              <i class="bi bi-check2" aria-hidden="true"></i>
            </button>` : ''}
            <button type="button" class="mb-row-action danger" data-action="delete-notification" aria-label="Delete notification: ${escapeHtml(title)}">
              <i class="bi bi-trash3" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <p class="mb-notification-card__desc">${escapeHtml(description)}</p>
        <p class="mb-notification-card__meta">${escapeHtml(formattedDateTime)}</p>
      </div>
    </article>`;
}

/**
 * Empty-state placeholder for lists/tables with no data yet (e.g. no
 * upcoming appointments, or a fully-cleared notification feed).
 * @param {{ icon?: string, message: string, actionHtml?: string }} params
 */
export function createEmptyState({ icon = 'bi-inbox', message, actionHtml = '' }) {
  return `
    <div class="mb-empty-state">
      <i class="bi ${icon}" aria-hidden="true"></i>
      <p>${escapeHtml(message)}</p>
      ${actionHtml}
    </div>`;
}

/**
 * Department selection card. Reuses .mb-action-card (section 8) with the
 * .is-selected modifier (section 18) rather than a new card component.
 * @param {{ id: string, name: string, icon: string, tone: string, description: string }} params
 * @param {boolean} isSelected
 */
export function createDepartmentCard({ id, name, icon, tone, description }, isSelected = false) {
  return `
    <button type="button" class="mb-action-card fade-in-up${isSelected ? ' is-selected' : ''}" data-department-id="${escapeHtml(id)}">
      <div class="mb-action-card__icon ${tone}">
        <i class="bi ${icon}" aria-hidden="true"></i>
      </div>
      <h3>${escapeHtml(name)}</h3>
      <p>${escapeHtml(description)}</p>
    </button>`;
}

/** Doctor selection card for the Booking wizard's "Select Doctor" step. */
export function createDoctorCard({ id, name, initials, department, rating, reviews, experienceYears, fee, availableToday, nextAvailable }, isSelected = false) {
  return `
    <article class="mb-doctor-card fade-in-up${isSelected ? ' is-selected' : ''}" data-doctor-id="${escapeHtml(id)}">
      <div class="mb-doctor-card__avatar">
        <div class="avatar-initials" aria-hidden="true" style="width:64px;height:64px;font-size:20px;">${escapeHtml(initials)}</div>
      </div>
      <div class="mb-doctor-card__body">
        <div class="mb-doctor-card__head">
          <div>
            <h3>${escapeHtml(name)}</h3>
            <p class="specialty">${escapeHtml(department)}</p>
          </div>
          <div class="mb-doctor-card__rating">
            <i class="bi bi-star-fill" aria-hidden="true"></i>
            <span>${rating.toFixed(1)}${reviews ? ` (${reviews})` : ''}</span>
          </div>
        </div>
        <div class="mb-doctor-card__meta">
          <span><i class="bi bi-briefcase" aria-hidden="true"></i> ${experienceYears} years exp.</span>
          <span><i class="bi bi-cash-coin" aria-hidden="true"></i> $${fee} Fee</span>
        </div>
        <div class="mb-doctor-card__footer">
          <div>
            <p class="avail-label">${availableToday ? 'Available today' : 'Next available'}</p>
            <p class="avail-value">${escapeHtml(nextAvailable)}</p>
          </div>
          <button type="button" class="mb-btn mb-btn-outline" data-select-doctor="${escapeHtml(id)}">
            ${isSelected ? 'Selected' : 'Select'}
          </button>
        </div>
      </div>
    </article>`;
}

/**
 * One day cell in the full month calendar (components.css §20). Caller
 * (the page controller) decides availability/selected/past state — this
 * function only renders whatever state it's given.
 */
export function createCalendarDayCell({ day, state = '', slotsAvailable = null }) {
  if (day === null) return '<div class="mb-calendar-day is-empty" aria-hidden="true"></div>';

  const classes = ['mb-calendar-day', state].filter(Boolean).join(' ');
  let meta = '';
  if (state === 'is-full') {
    meta = '<span class="mb-calendar-day__meta"><span class="mb-calendar-day__dot"></span>Full</span>';
  } else if (typeof slotsAvailable === 'number' && state !== 'is-past') {
    meta = `<span class="mb-calendar-day__meta"><span class="mb-calendar-day__dot"></span>${slotsAvailable} slots</span>`;
  }
  const disabledAttr = state === 'is-past' || state === 'is-full' ? 'disabled' : '';

  return `
    <button type="button" class="${classes}" data-day="${day}" ${disabledAttr}>
      <span class="mb-calendar-day__num">${day}</span>
      ${meta}
    </button>`;
}

/** One selectable time slot chip (components.css §21). */
export function createSlotChip({ time, period, occupied = false }, isSelected = false) {
  const classes = ['mb-slot-chip', occupied ? 'is-disabled' : '', isSelected ? 'is-selected' : ''].filter(Boolean).join(' ');
  return `
    <button type="button" class="${classes}" data-time="${escapeHtml(time)}" data-period="${escapeHtml(period)}" ${occupied ? 'disabled' : ''}>
      <span class="time">${escapeHtml(time)}</span>
      <span class="period">${occupied ? 'Occupied' : escapeHtml(period)}</span>
    </button>`;
}

/** Icon + label + value summary line (components.css §22), used in booking summaries. */
export function createDetailRow({ icon, label, value }) {
  return `
    <div class="mb-detail-row">
      <div class="mb-detail-row__icon"><i class="bi ${icon}" aria-hidden="true"></i></div>
      <div>
        <p class="mb-detail-row__label">${escapeHtml(label)}</p>
        <p class="mb-detail-row__value">${escapeHtml(value)}</p>
      </div>
    </div>`;
}

/** Allergy pill, reusing the badge component (components.css §13/§31) with severity modifiers. */
export function createAllergyTag({ name, severity }) {
  const cls = severity === 'critical' ? 'critical' : 'mild';
  return `<span class="mb-badge ${cls}">${escapeHtml(name)}</span>`;
}

/** A stacked label/value field on the Digital Patient Card (components.css §28). */
export function createIdField({ label, value, subValue = '', icon = '' }) {
  return `
    <div class="mb-id-field">
      <p class="k">${escapeHtml(label)}</p>
      <p class="v">${icon ? `<i class="bi ${icon}" aria-hidden="true"></i> ` : ''}${escapeHtml(value)}</p>
      ${subValue ? `<p class="v-sub">${escapeHtml(subValue)}</p>` : ''}
    </div>`;
}

/** The ID card's Blood Group field — same .mb-id-field shell, plus the circular blood-type chip. */
export function createBloodGroupField({ bloodGroup, bloodGroupLabel }) {
  return `
    <div class="mb-id-field">
      <p class="k">Blood Group</p>
      <p class="v"><span class="blood-chip">${escapeHtml(bloodGroup)}</span> ${escapeHtml(bloodGroupLabel)}</p>
    </div>`;
}

/**
 * One settings list item with a toggle switch (components.css §41/§42).
 * `checked` reflects current state; the page controller owns the change
 * handler via the `data-setting` hook.
 */
export function createToggleRow({ key, label, desc, checked }) {
  return `
    <div class="mb-settings-row">
      <div>
        <p class="mb-settings-row__label">${escapeHtml(label)}</p>
        ${desc ? `<p class="mb-settings-row__desc">${escapeHtml(desc)}</p>` : ''}
      </div>
      <label class="mb-toggle mb-settings-row__control">
        <input type="checkbox" class="mb-toggle__input" data-setting="${escapeHtml(key)}" ${checked ? 'checked' : ''} aria-label="${escapeHtml(label)}">
        <span class="mb-toggle__track"><span class="mb-toggle__thumb"></span></span>
      </label>
    </div>`;
}

/** A selectable theme option card — reuses .mb-action-card + .is-selected exactly like Department Selection. */
export function createThemeCard({ value, label, icon, desc }, isSelected) {
  return `
    <button type="button" class="mb-action-card fade-in-up${isSelected ? ' is-selected' : ''}" data-theme-value="${escapeHtml(value)}">
      <div class="mb-action-card__icon teal-tint">
        <i class="bi ${icon}" aria-hidden="true"></i>
      </div>
      <h3>${escapeHtml(label)}</h3>
      <p>${escapeHtml(desc)}</p>
    </button>`;
}

/** One row in the conversation list (components.css §45), with an unread badge when applicable. */
export function createConversationItem({ id, doctorInitials, doctorName, lastMessage, formattedTime, unreadCount }, isActive) {
  const classes = ['mb-conversation-item', unreadCount > 0 ? 'is-unread' : '', isActive ? 'is-active' : ''].filter(Boolean).join(' ');
  return `
    <button type="button" class="${classes}" data-conversation-id="${escapeHtml(id)}">
      <div class="avatar-initials" style="width:40px;height:40px;font-size:14px;" aria-hidden="true">${escapeHtml(doctorInitials)}</div>
      <div class="mb-conversation-item__body">
        <div class="mb-conversation-item__top">
          <p class="mb-conversation-item__name">${escapeHtml(doctorName)}</p>
          <span class="mb-conversation-item__time">${escapeHtml(formattedTime)}</span>
        </div>
        <p class="mb-conversation-item__preview">${escapeHtml(lastMessage)}</p>
      </div>
      ${unreadCount > 0 ? `<span class="mb-unread-badge">${unreadCount}</span>` : ''}
    </button>`;
}

/** One chat bubble (components.css §48). `sender` is 'patient' or 'doctor'. */
export function createMessageBubble({ sender, text, formattedTime, doctorInitials }) {
  const isDoctor = sender === 'doctor';
  return `
    <div class="mb-message-row ${isDoctor ? 'is-doctor' : 'is-patient'}">
      ${isDoctor ? `<div class="avatar-initials" aria-hidden="true">${escapeHtml(doctorInitials)}</div>` : ''}
      <div class="mb-message-bubble">
        ${escapeHtml(text)}
        <span class="mb-message-bubble__time">${escapeHtml(formattedTime)}</span>
      </div>
    </div>`;
}
