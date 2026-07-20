/* ==========================================================================
   MediBook+ | Notification Bell (shared)
   Vanilla JS — dropdown panel with dummy data. No backend calls.
   Include on every page that has the topbar notification bell.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', initNotificationDropdown);

/* ---------------------------------------------------------------------------
   Dummy data — stands in for a future backend/API response.
--------------------------------------------------------------------------- */
const NOTIFICATION_DATA = {
  items: [
    {
      id: 'notif-1',
      type: 'lab',
      title: 'Lab Results Ready',
      description: 'Mark Thompson — Lipid panel results are available for review.',
      time: '12 min ago',
      unread: true,
    },
    {
      id: 'notif-2',
      type: 'appointment',
      title: 'New Appointment Request',
      description: 'Sarah J. Mitchell requested a follow-up on Jul 15, 2026.',
      time: '28 min ago',
      unread: true,
    },
    {
      id: 'notif-3',
      type: 'message',
      title: 'New Patient Message',
      description: 'Eleanor Vance sent a message regarding blood pressure readings.',
      time: '1 hr ago',
      unread: true,
    },
    {
      id: 'notif-4',
      type: 'prescription',
      title: 'Prescription Refill Request',
      description: 'Robert Chen requested a refill for Lisinopril 10mg.',
      time: '2 hrs ago',
      unread: false,
    },
    {
      id: 'notif-5',
      type: 'system',
      title: 'System Maintenance',
      description: 'Scheduled EMR maintenance tonight from 11:00 PM – 1:00 AM.',
      time: '3 hrs ago',
      unread: false,
    },
    {
      id: 'notif-6',
      type: 'appointment',
      title: 'Appointment Cancelled',
      description: 'Linda Brooks cancelled her appointment for Jul 08, 2026.',
      time: 'Yesterday',
      unread: false,
    },
  ],
};

const NOTIF_ICONS = {
  lab: { icon: 'bi-clipboard2-pulse', className: 'notif-icon-lab' },
  appointment: { icon: 'bi-calendar-plus', className: 'notif-icon-appointment' },
  message: { icon: 'bi-chat-left-text', className: 'notif-icon-message' },
  prescription: { icon: 'bi-capsule', className: 'notif-icon-prescription' },
  system: { icon: 'bi-gear', className: 'notif-icon-system' },
};

const NOTIF_DISPLAY_LIMIT = 5;

/* ---------------------------------------------------------------------------
   Initialize notification dropdown
--------------------------------------------------------------------------- */
function initNotificationDropdown() {
  const dropdownEl = document.getElementById('notificationDropdownMenu');
  const listEl = document.getElementById('notifDropdownList');
  if (!dropdownEl || !listEl) return;

  renderNotificationList();
  updateUnreadBadge();

  listEl.addEventListener('click', (event) => {
    const markReadBtn = event.target.closest('[data-mark-read]');
    const itemBtn = event.target.closest('[data-notif-id]');

    if (markReadBtn) {
      event.preventDefault();
      event.stopPropagation();
      markNotificationRead(markReadBtn.getAttribute('data-mark-read'));
      return;
    }

    if (itemBtn && itemBtn.classList.contains('notif-item-unread')) {
      markNotificationRead(itemBtn.getAttribute('data-notif-id'));
    }
  });
}

/* ---------------------------------------------------------------------------
   Render latest notifications into the dropdown
--------------------------------------------------------------------------- */
function renderNotificationList() {
  const listEl = document.getElementById('notifDropdownList');
  const unreadLabel = document.getElementById('notifUnreadLabel');
  if (!listEl) return;

  const unreadCount = getUnreadCount();
  const visible = NOTIFICATION_DATA.items.slice(0, NOTIF_DISPLAY_LIMIT);

  if (unreadLabel) {
    unreadLabel.textContent =
      unreadCount === 0
        ? 'All caught up'
        : `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`;
  }

  if (visible.length === 0) {
    listEl.innerHTML =
      '<p class="notif-dropdown-empty">No notifications to display.</p>';
    return;
  }

  listEl.innerHTML = visible
    .map((notif) => {
      const iconMeta = NOTIF_ICONS[notif.type] || NOTIF_ICONS.system;
      const unreadClass = notif.unread ? ' notif-item-unread' : '';

      return `
        <button type="button" class="notif-item${unreadClass}" data-notif-id="${notif.id}" role="listitem">
          <span class="notif-item-icon ${iconMeta.className}" aria-hidden="true">
            <i class="bi ${iconMeta.icon}"></i>
          </span>
          <span class="notif-item-content">
            <span class="notif-item-top">
              <span class="notif-item-title">${notif.title}</span>
              ${notif.unread ? '<span class="notif-item-dot" aria-label="Unread"></span>' : ''}
            </span>
            <span class="notif-item-desc">${notif.description}</span>
            <span class="notif-item-time">${notif.time}</span>
          </span>
          ${
            notif.unread
              ? `<span class="notif-mark-read" data-mark-read="${notif.id}" role="button" tabindex="-1" aria-label="Mark as read">Mark read</span>`
              : ''
          }
        </button>
      `;
    })
    .join('');
}

/* ---------------------------------------------------------------------------
   Mark a single notification as read
--------------------------------------------------------------------------- */
function markNotificationRead(notifId) {
  const notif = NOTIFICATION_DATA.items.find((item) => item.id === notifId);
  if (!notif || !notif.unread) return;

  notif.unread = false;
  renderNotificationList();
  updateUnreadBadge();
}

/* ---------------------------------------------------------------------------
   Update the bell dot indicator
--------------------------------------------------------------------------- */
function getUnreadCount() {
  return NOTIFICATION_DATA.items.filter((item) => item.unread).length;
}

function updateUnreadBadge() {
  const dot = document.getElementById('notifDot');
  if (!dot) return;

  const unreadCount = getUnreadCount();
  dot.classList.toggle('d-none-dot', unreadCount === 0);
  dot.setAttribute('aria-label', unreadCount > 0 ? `${unreadCount} unread notifications` : '');
}
