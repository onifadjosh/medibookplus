/**
 * app.js
 * ---------------------------------------------------------------------------
 * Global entry point, loaded as a module on every page. Its only job is to
 * bootstrap the shared app-shell chrome (navbar, sidebar, bottom nav) via
 * navigation.js. Page-specific behavior lives in that page's own module
 * (e.g. dashboard.js), loaded alongside this one.
 * ---------------------------------------------------------------------------
 */

import { initNavigation } from './navigation.js';

document.addEventListener('DOMContentLoaded', initNavigation);
