/**
 * notifications.js
 * ---------------------------------------------------------------------------
 * Page controller for Notifications. Follows the same pattern as
 * appointmentHistory.js: fetch through services/api.js, render with
 * components.js templates, keep all page state local to this module.
 * ---------------------------------------------------------------------------
 */

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from './services/api.js';
import { showToast } from './ui.js';
import { createNotificationCard, createEmptyState } from './components.js';
import { qs, debounce, formatDate, formatTime } from './helpers.js';

/** Full dataset fetched once; filtering/searching happen client-side against this. */
let allNotifications = [];
let activeFilter = 'all';
let searchTerm = '';

/* ---------------------------------------------------------------------
 * Filtering + rendering
 * --------------------------------------------------------------------- */

function getFilteredNotifications() {
  return allNotifications.filter((n) => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'unread' ? !n.read : n.category === activeFilter);
    const haystack = `${n.title} ${n.description}`.toLowerCase();
    const matchesSearch = !searchTerm || haystack.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });
}

function renderList() {
  const listMount = qs('[data-notifications-list]');
  const countEl = qs('[data-notifications-count]');

  if (!allNotifications.length) {
    listMount.innerHTML = createEmptyState({
      icon: 'bi-bell-slash',
      message: "You're all caught up! You have no notifications right now.",
      actionHtml: `<a href="dashboard.html" data-route="dashboard" class="mb-btn mb-btn-primary">Back to Dashboard</a>`,
    });
    countEl.textContent = '0 notifications';
    return;
  }

  const results = getFilteredNotifications();
  countEl.textContent = `${results.length} of ${allNotifications.length}`;

  if (!results.length) {
    listMount.innerHTML = createEmptyState({ icon: 'bi-search', message: 'No notifications match your search or filter.' });
    return;
  }

  listMount.innerHTML = results
    .map((n) =>
      createNotificationCard({
        ...n,
        formattedDateTime: `${formatDate(n.timestamp)} at ${formatTime(n.timestamp)}`,
      })
    )
    .join('');
}

/* ---------------------------------------------------------------------
 * Toolbar: search + filter tabs
 * --------------------------------------------------------------------- */

function initToolbar() {
  qs('[data-notifications-search]').addEventListener(
    'input',
    debounce((e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      renderList();
    }, 200)
  );

  qs('[data-notifications-filters]').addEventListener('click', (e) => {
    const tab = e.target.closest('.mb-filter-tab');
    if (!tab) return;
    activeFilter = tab.dataset.filter;
    qs('[data-notifications-filters]')
      .querySelectorAll('.mb-filter-tab')
      .forEach((t) => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
    renderList();
  });
}

/* ---------------------------------------------------------------------
 * Actions: Mark as Read / Mark All as Read / Delete
 * --------------------------------------------------------------------- */

async function handleMarkRead(notification) {
  const { success } = await markNotificationRead(notification.id);
  if (!success) return showToast('Something went wrong. Please try again.', 'error');
  notification.read = true;
  renderList();
}

async function handleDelete(notification) {
  const { success } = await deleteNotification(notification.id);
  if (!success) return showToast('Something went wrong. Please try again.', 'error');
  allNotifications = allNotifications.filter((n) => n.id !== notification.id);
  renderList();
  showToast('Notification deleted.', 'success');
}

async function handleMarkAllRead() {
  const { success } = await markAllNotificationsRead();
  if (!success) return showToast('Something went wrong. Please try again.', 'error');
  allNotifications.forEach((n) => { n.read = true; });
  renderList();
  showToast('All notifications marked as read.', 'success');
}

function initActions() {
  qs('[data-action="mark-all-read"]').addEventListener('click', handleMarkAllRead);

  qs('[data-notifications-list]').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const card = btn.closest('[data-notification-id]');
    const notification = allNotifications.find((n) => n.id === card?.dataset.notificationId);
    if (!notification) return;

    if (btn.dataset.action === 'mark-read') handleMarkRead(notification);
    else if (btn.dataset.action === 'delete-notification') handleDelete(notification);
  });
}

/* ---------------------------------------------------------------------
 * Init
 * --------------------------------------------------------------------- */

async function initNotifications() {
  initToolbar();
  initActions();
  allNotifications = await getNotifications();
  renderList();
}

document.addEventListener('DOMContentLoaded', initNotifications);
