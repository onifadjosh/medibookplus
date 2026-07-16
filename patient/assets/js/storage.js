/**
 * storage.js
 * ---------------------------------------------------------------------------
 * Thin, safe wrapper around localStorage for client-only preferences that
 * don't belong in the backend (e.g. "sidebar collapsed", "theme"). Every
 * call is try/caught so a locked-down browser (private mode, disabled
 * storage) degrades gracefully instead of throwing.
 *
 * All keys are namespaced under "medibook:" to avoid colliding with other
 * scripts on the same origin.
 * ---------------------------------------------------------------------------
 */

const NAMESPACE = 'medibook';

const namespacedKey = (key) => `${NAMESPACE}:${key}`;

/**
 * Reads and JSON-parses a value from localStorage.
 * @param {string} key
 * @param {*} fallback - returned if the key is missing or unreadable.
 * @returns {*}
 */
export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(namespacedKey(key));
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * JSON-serializes and writes a value to localStorage.
 * @param {string} key
 * @param {*} value
 * @returns {boolean} whether the write succeeded.
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(namespacedKey(key), JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes a namespaced key from localStorage.
 * @param {string} key
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(namespacedKey(key));
  } catch {
    /* no-op: storage unavailable */
  }
}
