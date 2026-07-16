/**
 * ui.js
 * ---------------------------------------------------------------------------
 * Generic, data-agnostic UI mechanics — the "how", not the "what". These
 * functions don't know about appointments or patients; they just build or
 * toggle DOM chrome. Data-bound templates (stat cards, appointment rows,
 * etc.) live in components.js and call into these where useful.
 * ---------------------------------------------------------------------------
 */

/**
 * Builds a circular "initials avatar" element. Used for the navbar avatar,
 * doctor photos, and anywhere a headshot placeholder is needed — keeps the
 * UI independent of third-party image hosts.
 * @param {string} initials - 1-2 letters to display.
 * @param {number} size - diameter in pixels.
 * @param {number} fontSize - label font-size in pixels.
 * @returns {HTMLDivElement}
 */
export function createInitialsAvatar(initials, size = 40, fontSize = 14) {
  const el = document.createElement('div');
  el.className = 'avatar-initials';
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.fontSize = `${fontSize}px`;
  el.textContent = initials;
  el.setAttribute('aria-hidden', 'true');
  return el;
}

/** Maps an appointment/record status to its badge class + display label. */
const STATUS_BADGE_MAP = {
  confirmed: { cls: 'confirmed', label: 'Confirmed' },
  pending: { cls: 'pending', label: 'Pending' },
  cancelled: { cls: 'cancelled', label: 'Cancelled' },
  completed: { cls: 'completed', label: 'Completed' },
};

/**
 * Resolves a status string to its badge styling info, falling back to a
 * neutral "pending" treatment for any status not yet in the map.
 * @param {string} status
 * @returns {{ cls: string, label: string }}
 */
export function resolveStatusBadge(status) {
  return STATUS_BADGE_MAP[status] || { cls: 'pending', label: status };
}

/**
 * Shows a small, auto-dismissing toast notification. Not used by the
 * dashboard yet, but ready for booking/cancel/save confirmations on
 * upcoming pages.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
export function showToast(message, type = 'info') {
  let container = document.querySelector('[data-toast-container]');
  if (!container) {
    container = document.createElement('div');
    container.setAttribute('data-toast-container', '');
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    container.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      z-index: var(--z-toast); display: flex; flex-direction: column; gap: 8px;
    `;
    document.body.appendChild(container);
  }

  const toneColor = { success: 'var(--success)', error: 'var(--danger)', info: 'var(--primary)' }[type] || 'var(--primary)';
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    background: var(--on-surface); color: #fff; padding: 12px 20px;
    border-radius: var(--radius-sm); font-size: 14px; box-shadow: var(--shadow-lg);
    border-left: 4px solid ${toneColor};
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
    if (!container.children.length) container.remove();
  }, 3200);
}

/**
 * Opens a Bootstrap modal by element id (thin wrapper so callers don't need
 * to know Bootstrap's JS API directly).
 * @param {string} modalId
 */
export function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (!el || typeof bootstrap === 'undefined') return;
  bootstrap.Modal.getOrCreateInstance(el).show();
}

/**
 * Closes a Bootstrap modal by element id.
 * @param {string} modalId
 */
export function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (!el || typeof bootstrap === 'undefined') return;
  bootstrap.Modal.getOrCreateInstance(el).hide();
}

/**
 * Toggles the mobile sidebar's open/closed state via a body class. The
 * Dashboard's current breakpoint behavior (hidden below 768px, static
 * above) doesn't need this yet, but it's wired up for an off-canvas
 * mobile sidebar on future pages.
 */
export function toggleSidebar() {
  document.body.classList.toggle('sidebar-open');
}
