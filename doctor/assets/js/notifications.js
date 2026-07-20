document.addEventListener('DOMContentLoaded', initNotificationCenter);

const NOTIFICATION_CENTER_DATA = [
  {
    id: 'center-1',
    group: 'Today',
    category: 'Appointments',
    categoryKey: 'appointments',
    title: 'Appointment Request',
    description: 'Sarah J. Mitchell requested a follow-up for tomorrow before noon.',
    time: '12 min ago',
    unread: true,
    status: 'Urgent',
    link: 'appointment-details.html',
    icon: 'bi-calendar-plus',
    iconClass: 'notification-icon-appointment'
  },
  {
    id: 'center-2',
    group: 'Today',
    category: 'Lab Results',
    categoryKey: 'lab-results',
    title: 'Lab Results Ready',
    description: 'Lipid panel results for Mark Thompson are ready for clinician review.',
    time: '34 min ago',
    unread: true,
    status: 'Review',
    link: 'appointment-details.html',
    icon: 'bi-clipboard2-pulse',
    iconClass: 'notification-icon-lab'
  },
  {
    id: 'center-3',
    group: 'Today',
    category: 'Messages',
    categoryKey: 'messages',
    title: 'New Patient Message',
    description: 'Eleanor Vance shared updated blood pressure readings from home monitoring.',
    time: '1 hr ago',
    unread: true,
    status: 'New',
    link: 'messages.html',
    icon: 'bi-chat-left-text',
    iconClass: 'notification-icon-message'
  },
  {
    id: 'center-4',
    group: 'Yesterday',
    category: 'Prescriptions',
    categoryKey: 'prescriptions',
    title: 'Prescription Refill Request',
    description: 'Robert Chen requested a refill for Lisinopril 10mg before the weekend.',
    time: 'Yesterday',
    unread: false,
    status: 'Pending',
    link: 'appointment-details.html',
    icon: 'bi-capsule',
    iconClass: 'notification-icon-prescription'
  },
  {
    id: 'center-5',
    group: 'Yesterday',
    category: 'System',
    categoryKey: 'system',
    title: 'System Maintenance',
    description: 'Scheduled EMR maintenance will begin at 11:00 PM and conclude by 1:00 AM.',
    time: 'Yesterday',
    unread: false,
    status: 'Info',
    link: 'settings.html',
    icon: 'bi-gear',
    iconClass: 'notification-icon-system'
  },
  {
    id: 'center-6',
    group: 'Earlier This Week',
    category: 'Appointments',
    categoryKey: 'appointments',
    title: 'Appointment Reminder',
    description: 'A reminder was sent for Linda Brooks to arrive 15 minutes early for her cardiology consult.',
    time: 'Mon',
    unread: false,
    status: 'Reminder',
    link: 'appointments.html',
    icon: 'bi-calendar2-week',
    iconClass: 'notification-icon-appointment'
  }
];

const NOTIFICATION_CENTER_STATE = {
  filter: 'all',
  items: NOTIFICATION_CENTER_DATA.map((item) => ({ ...item }))
};

function initNotificationCenter() {
  const listEl = document.getElementById('notificationsList');
  const summaryEl = document.getElementById('notificationsSummary');
  const markAllBtn = document.getElementById('markAllReadBtn');
  const filterButtons = document.querySelectorAll('[data-filter]');

  if (!listEl || !summaryEl) return;

  renderNotificationCenter(listEl, summaryEl);

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => {
        btn.classList.toggle('active', btn === button);
        btn.setAttribute('aria-selected', btn === button ? 'true' : 'false');
      });

      NOTIFICATION_CENTER_STATE.filter = button.getAttribute('data-filter') || 'all';
      renderNotificationCenter(listEl, summaryEl);
    });
  });

  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      NOTIFICATION_CENTER_STATE.items = NOTIFICATION_CENTER_STATE.items.map((item) => ({ ...item, unread: false }));
      renderNotificationCenter(listEl, summaryEl);
    });
  }

  listEl.addEventListener('click', (event) => {
    const readButton = event.target.closest('[data-action="read"]');
    const dismissButton = event.target.closest('[data-action="dismiss"]');
    const cardButton = event.target.closest('[data-href]');

    if (readButton) {
      event.preventDefault();
      event.stopPropagation();
      const id = readButton.getAttribute('data-notification-id');
      markNotificationAsRead(id);
      return;
    }

    if (dismissButton) {
      event.preventDefault();
      event.stopPropagation();
      const id = dismissButton.getAttribute('data-notification-id');
      dismissNotification(id);
      return;
    }

    if (cardButton) {
      event.preventDefault();
      const target = cardButton.getAttribute('data-href');
      if (target) {
        window.location.href = target;
      }
    }
  });
}

function renderNotificationCenter(listEl, summaryEl) {
  const filteredItems = NOTIFICATION_CENTER_STATE.items.filter((item) => {
    if (NOTIFICATION_CENTER_STATE.filter === 'all') return true;
    return item.categoryKey === NOTIFICATION_CENTER_STATE.filter;
  });

  const grouped = groupNotifications(filteredItems);
  const unreadCount = NOTIFICATION_CENTER_STATE.items.filter((item) => item.unread).length;
  const totalCount = NOTIFICATION_CENTER_STATE.items.length;

  if (summaryEl) {
    summaryEl.textContent = `${unreadCount} unread • ${totalCount} total notifications`;
  }

  if (filteredItems.length === 0) {
    listEl.innerHTML = '<div class="notifications-empty">No notifications match this filter right now.</div>';
    return;
  }

  listEl.innerHTML = grouped.map((group) => {
    const cards = group.items.map((item) => createNotificationCard(item)).join('');
    return `
      <section class="notifications-group" aria-label="${group.label}">
        <div class="notifications-group-header">
          <h3 class="notifications-group-title">${escapeHtml(group.label)}</h3>
          <span class="notifications-group-count">${group.items.length}</span>
        </div>
        <div class="notifications-group-list">${cards}</div>
      </section>
    `;
  }).join('');
}

function groupNotifications(items) {
  const groups = [
    { label: 'Today', items: [] },
    { label: 'Yesterday', items: [] },
    { label: 'Earlier This Week', items: [] }
  ];

  items.forEach((item) => {
    const group = groups.find((entry) => entry.label === item.group);
    if (group) group.items.push(item);
  });

  return groups.filter((group) => group.items.length > 0);
}

function createNotificationCard(item) {
  return `
    <article class="notification-card${item.unread ? ' notification-card-unread' : ''}">
      <div class="notification-card-inner d-flex flex-column flex-md-row align-items-start justify-content-between gap-3">
        <button class="notification-card-main flex-grow-1" type="button" data-href="${item.link}" data-notification-id="${item.id}">
          <span class="notification-icon ${item.iconClass}" aria-hidden="true">
            <i class="bi ${item.icon}"></i>
          </span>
          <span class="notification-body">
            <span class="notification-heading">
              <span class="notification-title">${escapeHtml(item.title)}</span>
              ${item.unread ? '<span class="notification-dot" aria-label="Unread"></span>' : ''}
            </span>
            <span class="notification-description">${escapeHtml(item.description)}</span>
            <span class="notification-meta">
              <span class="notification-category">${escapeHtml(item.category)}</span>
              <span class="notification-status">${escapeHtml(item.status)}</span>
              <span class="notification-time">${escapeHtml(item.time)}</span>
            </span>
          </span>
        </button>
        <div class="notification-actions">
          ${item.unread ? `<button class="notification-action-btn" type="button" data-action="read" data-notification-id="${item.id}">Mark read</button>` : ''}
          <button class="notification-action-btn notification-action-btn-ghost" type="button" data-action="dismiss" data-notification-id="${item.id}">Dismiss</button>
        </div>
      </div>
    </article>
  `;
}

function markNotificationAsRead(id) {
  const item = NOTIFICATION_CENTER_STATE.items.find((entry) => entry.id === id);
  if (!item || !item.unread) return;

  item.unread = false;
  renderNotificationCenter(document.getElementById('notificationsList'), document.getElementById('notificationsSummary'));
}

function dismissNotification(id) {
  NOTIFICATION_CENTER_STATE.items = NOTIFICATION_CENTER_STATE.items.filter((entry) => entry.id !== id);
  renderNotificationCenter(document.getElementById('notificationsList'), document.getElementById('notificationsSummary'));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
