# MediBook+ — Patient Frontend

A modular, framework-free frontend (HTML5 + CSS3 + vanilla ES6 modules +
Bootstrap 5) for the MediBook+ Smart Hospital Appointment and Digital
Patient Registration System. Built so a Node.js + Express + MongoDB backend
can be dropped in later by editing a single file — nothing else in the UI
layer needs to change.

Currently implemented: **Patient Dashboard**, **Appointment Booking**,
**Digital Patient Card**, **Appointment History**, **Notifications**,
**Profile**, **Settings**, **Messages**. Remaining pages (Auth, Doctor/Admin
dashboards) reuse this same architecture — see [Adding a new page](#adding-a-new-page).

---

## Running it locally

The JavaScript uses native ES modules (`import`/`export`), which browsers
**block over the `file://` protocol**. You must serve the project over
`http://`:

- **VS Code:** install the "Live Server" extension → right-click
  `pages/dashboard.html` → **Open with Live Server**
- **Python:** `python3 -m http.server 8080` from the project root, then
  visit `http://localhost:8080/pages/dashboard.html`
- **Node:** `npx serve .` from the project root

> The folder structure below must stay intact — relative `import` paths
> depend on it (e.g. `services/api.js` importing `../data/patient.js`).
> If you ever see a wall of `404 (Not Found)` errors in the browser
> console, it almost always means a file landed in the wrong folder.

---

## Project structure

```
medibook/
├── README.md
├── assets/
│   ├── css/
│   │   ├── variables.css     # design tokens: color, spacing, radius, shadow, z-index
│   │   ├── reset.css         # base element resets, focus states, reduced-motion
│   │   ├── utilities.css     # single-purpose helper classes + shared animations
│   │   ├── layout.css        # app shell: navbar, sidebar shell, main region, mobile nav
│   │   ├── components.css    # reusable components: cards, badges, tables, buttons, etc.
│   │   ├── responsive.css    # breakpoint fine-tuning, loaded last so it can override
│   │   ├── style.css         # aggregator — @imports everything above in cascade order
│   │   ├── dashboard.css     # page-specific styles, only used by dashboard.html
│   │   ├── appointments.css  # page-specific styles, only used by appointments.html
│   │   ├── patient-card.css  # page-specific styles, only used by patient-card.html
│   │   ├── appointment-history.css  # page-specific styles, only used by appointment-history.html
│   │   ├── notifications.css # minimal page-specific styles, only used by notifications.html
│   │   ├── profile.css       # page-specific styles, only used by profile.html
│   │   ├── settings.css      # minimal page-specific styles, only used by settings.html
│   │   └── messages.css      # minimal page-specific styles, only used by messages.html
│   │
│   ├── js/
│   │   ├── app.js            # global entry point — boots shared chrome on every page
│   │   ├── routes.js         # single source of truth for internal page paths
│   │   ├── navigation.js     # navbar avatar, notification bell (+ unread badge), active-nav-link sync, route resolution
│   │   ├── ui.js             # generic DOM mechanics (avatar builder, toast, modal, badge map)
│   │   ├── components.js     # reusable, data-bound HTML template functions
│   │   ├── helpers.js        # pure utility functions (formatDate, debounce, qs/qsAll, etc.)
│   │   ├── storage.js        # safe localStorage wrapper for client-only preferences
│   │   ├── dashboard.js      # page controller for the Dashboard screen
│   │   ├── appointments.js   # page controller for the Appointment Booking wizard
│   │   ├── patientCard.js    # page controller for the Digital Patient Card
│   │   ├── appointmentHistory.js  # page controller for Appointment History
│   │   ├── notifications.js  # page controller for Notifications
│   │   ├── profile.js        # page controller for the Profile page (two forms: profile + password)
│   │   ├── settings.js       # page controller for the Settings page
│   │   ├── messages.js       # page controller for Messages (conversation list + chat)
│   │   │
│   │   ├── data/              # mock data, shaped like real API responses
│   │   │   ├── patient.js     # includes idCard, contact, personal, medical, account — see file for the split
│   │   │   ├── appointments.js  # includes appointmentHistory — the full history dataset
│   │   │   ├── notifications.js  # title/description/category/icon per notification
│   │   │   ├── doctors.js
│   │   │   ├── medicalRecords.js
│   │   │   ├── departments.js
│   │   │   ├── timeSlots.js
│   │   │   ├── settings.js    # notification/privacy/language/theme preferences + option lists
│   │   │   ├── messages.js    # conversations + message threads (see note on real-time below)
│   │   │   └── quickActions.js    # UI config (not backend data), see note below
│   │   │
│   │   └── services/
│   │       └── api.js         # THE mock/real API boundary — see "Replacing mock data"
│   │
│   └── images/                 # (currently empty — see "Why no images?" below)
│
└── pages/
    ├── dashboard.html          # Patient Dashboard
    ├── appointments.html       # Appointment Booking (5-step wizard + success state)
    ├── patient-card.html       # Digital Patient Card
    ├── appointment-history.html  # Appointment History (search, filter, modals)
    ├── notifications.html      # Notifications (search, filter, mark read/delete)
    ├── profile.html             # Profile (editable form + change password)
    ├── settings.html            # Settings (preferences, logout, deactivate account)
    └── messages.html            # Messages (conversation list + chat window)
```

### Why no images?

Doctor/patient photos are rendered as CSS-generated "initials avatars"
(`ui.js#createInitialsAvatar`) instead of `<img>` tags pointing at external
image hosts. This keeps the prototype fully self-contained and avoids
broken images if a CDN is unreachable. Swap in real photo URLs by editing
the `doctorInitials` fields in `data/*.js` to real image paths and updating
`components.js`/`ui.js` accordingly once real assets exist.

---

## What each file is responsible for

### CSS

| File | Responsibility |
|---|---|
| `variables.css` | Every color, spacing, radius, shadow, transition, and z-index value as a CSS custom property. **Never hardcode a repeated value** — add a token here instead. |
| `reset.css` | Browser default resets. Page- and component-agnostic. |
| `utilities.css` | Small, single-purpose classes (`.fade-in-up`, `.stagger`, `.card-shadow`, etc.) reused anywhere. |
| `layout.css` | The app shell only: `.mb-navbar`, `.mb-sidebar` (shell), `.mb-main`, `.mb-bottom-nav`, `.mb-fab`. No page content lives here. |
| `components.css` | Reusable components safe to drop into any page: stat cards, action cards, tables, badges, mini calendar, buttons, skeletons, empty states. **This is the shared component library** — start here before writing new CSS. |
| `responsive.css` | Breakpoint overrides that don't belong to one specific component. |
| `dashboard.css` | Only the Dashboard's hero/welcome composition — genuinely page-specific, not reused elsewhere. |
| `appointments.css` | Only the Booking wizard's layout (step grids, success panel) — every visual component it uses (cards, buttons, calendar, slot chips) lives in `components.css`. |
| `patient-card.css` | Only the ID card page's layout (header, two-column grid, footer cards) — the ID card, code boxes, badges, and quick tiles it uses all live in `components.css`. |
| `appointment-history.css` | Only the History page's modal layout — the toolbar, table, badges, and row actions it uses all live in `components.css`. |
| `notifications.css` | Nearly empty — the page header, toolbar, filter tabs, search input, notification cards, and empty state it uses all live in `components.css`. |
| `profile.css` | Only the Profile page's layout (summary row, two-column form grid) — the panels, progress bar, form fields, and badges it uses all live in `components.css`. |
| `settings.css` | Nearly empty — the page header, panels, toggle switches, settings rows, theme cards, and form controls it uses all live in `components.css`. |
| `messages.css` | Nearly empty — the split-view shell, conversation list, chat header/messages/input, and message bubbles it uses all live in `components.css`. |
| `style.css` | Entry point every page links. `@import`s the shared files in the correct cascade order. Pages additionally link their own `<page>.css` for page-specific rules. |

### JavaScript

| File | Responsibility |
|---|---|
| `app.js` | Loaded on **every** page. Only job: call `navigation.js#initNavigation()` on `DOMContentLoaded`. |
| `routes.js` | Single source of truth for internal page paths (`routes.dashboard`, `routes.appointmentHistory`, etc.). Add `data-route="appointmentHistory"` to any `<a>` and `navigation.js` fills in the real `href` on every page load — no page needs to hardcode another page's filename. |
| `navigation.js` | Shared chrome: hydrates the navbar avatar from `getPatient()`, wires the notification bell, syncs `.active` state across the top navbar / sidebar / bottom nav via `data-nav-link` attributes, and resolves every `[data-route]` element's `href` from `routes.js`. |
| `ui.js` | Generic, data-agnostic DOM mechanics: `createInitialsAvatar()`, `resolveStatusBadge()`, `showToast()`, `openModal()`/`closeModal()`, `toggleSidebar()`. Doesn't know what a "patient" or "appointment" is. |
| `components.js` | Data-bound template functions: `createStatCard(data)`, `createActionCard(data)`, `createAppointmentRow(data)`, `createMiniNotification(data)`, `createMiniCalendarGrid(data)`, `createEmptyState(data)`. Each takes a plain object and returns an HTML string. |
| `helpers.js` | Pure functions with no DOM side effects beyond `qs`/`qsAll`: `formatDate()`, `formatTime()`, `debounce()`, `escapeHtml()`, `buildMiniCalendar()`. |
| `storage.js` | `getItem()`/`setItem()`/`removeItem()` — a try/caught, namespaced `localStorage` wrapper for client-only preferences (not patient data). |
| `data/*.js` | Mock data modules — see next section. |
| `services/api.js` | The API boundary — see [Replacing mock data with a real API](#replacing-mock-data-with-a-real-api). |
| `<page>.js` (e.g. `dashboard.js`, `appointments.js`, `patientCard.js`, `appointmentHistory.js`, `notifications.js`, `profile.js`, `settings.js`, `messages.js`) | Page controller. Imports what it needs from `services/api.js`, `components.js`, `ui.js`, `helpers.js`, and orchestrates rendering into the page's DOM hooks (`data-*` attributes). Contains no markup strings of its own beyond what `components.js` returns. `appointments.js` additionally owns the 5-step wizard's state machine, and reads an optional `?doctorId=` URL param so `appointmentHistory.js`'s "Reschedule" action can deep-link straight to the Date step for a given doctor. `patientCard.js` needed no new API endpoint — it just reads more fields off the existing `getPatient()` response. `profile.js` owns two independent `<form>`s (profile fields, password change), each with its own submit handler. `settings.js` uses one flexible `updateSettings()` call for every toggle/select on the page, and its Change Password row deep-links to `profile.html#change-password` rather than duplicating that form. `messages.js` sends optimistically (renders the patient's bubble immediately, then calls the mock API) and calls `subscribeToMessages()` on the active conversation — see [Real-time messaging](#real-time-messaging-not-yet-implemented) below. |

---

## How mock data is organized

Every array/object the UI displays lives in `assets/js/data/`, exported
with `export const`, shaped the way the real MongoDB-backed API would
realistically return it:

```js
// data/patient.js
export const patient = {
  id: 'PT-20481',
  firstName: 'John',
  lastName: 'Doe',
  initials: 'JD',
  profileCompletion: 85,
  healthSummary: { bloodGroup: 'O+', insuranceStatus: 'Active', allergies: 'Penicillin, Peanuts' },
};
```

```js
// data/appointments.js
export const appointments = [
  { id: 'APT-9002', doctorName: 'Dr. Robert Carter', doctorInitials: 'RC',
    department: 'Pediatrics', date: 'Oct 26, 2023', time: '09:00 AM', status: 'confirmed' },
  // ...
];
export const featuredAppointment = { /* today's highlighted appointment */ };
export const nextAppointmentReminder = { label: 'Next Appointment', detail: 'In 3 Days' };
export const dashboardStats = [ /* the four Quick Stat cards */ ];
```

**One exception:** `data/quickActions.js` isn't a mock backend resource —
it's static UI configuration (the six dashboard shortcut cards: labels,
icons, links). It still lives in `data/` so the HTML never needs to change
to add/reorder/rename a shortcut, but it's read directly by `dashboard.js`
rather than going through `services/api.js`.

No HTML file should ever contain a hardcoded appointment, name, or stat —
if you find yourself typing patient-specific text into a `.html` file,
it belongs in a `data/*.js` file instead, rendered via `components.js`.

---

## Replacing mock data with a real API

`services/api.js` is the **only** file that should change when the
Node/Express + MongoDB backend is ready. Every function it exports already
returns a `Promise` (simulating network latency), so no calling code
(`components.js`, `dashboard.js`, or any future page) needs to change —
only the function bodies in this one file do.

**Today (mock):**
```js
// services/api.js
import { patient } from '../data/patient.js';

const MOCK_LATENCY_MS = 200;
const mockResponse = (payload) =>
  new Promise((resolve) => setTimeout(() => resolve(payload), MOCK_LATENCY_MS));

export const getPatient = () => mockResponse(patient);
```

**Later (real):**
```js
// services/api.js
export const getPatient = () =>
  fetch('/api/patients/me').then((res) => {
    if (!res.ok) throw new Error('Failed to load patient');
    return res.json();
  });
```

That's the entire migration for a read endpoint. The write placeholders
(`bookAppointment()`, `cancelAppointment()`, `updateProfile()`) follow the
same pattern — replace the mock resolve with a `fetch()` using the
appropriate method and body:

```js
export const bookAppointment = (payload) =>
  fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then((res) => res.json());
```

Once every function in `services/api.js` is backed by a real endpoint, you
can delete the `data/` folder's mock arrays entirely (or keep them for
local development/tests — they're already decoupled from the UI).

---

## Real-time messaging (not yet implemented)

`pages/messages.html` is built to be ready for real-time updates without
actually having any — there's no WebSocket, no polling, no backend to talk
to yet. Two things make the eventual swap-in low-risk:

1. **`services/api.js#subscribeToMessages(conversationId, onMessage)`** is
   a documented no-op that already returns an `unsubscribe` function.
   `messages.js` already calls it when a conversation opens and calls
   `unsubscribe()` when switching conversations — the calling code is
   already written the way it'll work once this function opens a real
   WebSocket and invokes `onMessage(newMessage)` whenever the doctor's side
   sends something.
2. **Sending is already optimistic.** `messages.js` renders the patient's
   own message bubble immediately, then calls `sendMessage()` — the UI
   doesn't wait on the network round-trip, matching how a real chat feels.

When a real-time backend exists, the only file that should need to change
is `services/api.js`'s `subscribeToMessages()` implementation.

---

## Adding a new page

1. **Create the HTML file** in `pages/`, e.g. `pages/appointments.html`.
   Copy the `<head>`, navbar, sidebar, and bottom-nav markup from
   `dashboard.html` — this is the shared app shell and should stay
   identical across pages (a future step could extract it into an
   include/templating system if the duplication becomes painful).
   - Link `../assets/css/style.css` + a new page-specific stylesheet
     (e.g. `appointments.css`) if the page needs unique layout rules.
   - Set `<body data-page="appointments">` so `navigation.js` highlights
     the correct nav link automatically.
   - Load `app.js` (shared chrome) and a new `assets/js/appointments.js`
     (page controller) as `<script type="module">`.
2. **Add any new mock data** it needs to `assets/js/data/` and expose it
   through `assets/js/services/api.js`, following the existing pattern.
3. **Reuse existing components** from `components.js`/`ui.js` wherever
   possible (e.g. `createAppointmentRow()`, `resolveStatusBadge()`) instead
   of writing new markup strings.
4. **Write the page controller** (`assets/js/appointments.js`) following
   the shape of `dashboard.js`: import from `services/api.js`,
   `components.js`, `ui.js`, `helpers.js`; render into `data-*` DOM hooks;
   run everything from a single `DOMContentLoaded` listener.

## Adding a new reusable component

1. Decide if it's truly reusable (usable by Doctor/Admin dashboards too)
   or page-specific:
   - Reusable → styles go in `components.css`, template function goes in
     `components.js`.
   - Page-specific → styles go in that page's own `<page>.css`; if it
     also needs a template function, put it in the page's own controller
     file rather than `components.js`.
2. Write the CSS using existing design tokens from `variables.css` —
   don't introduce new hardcoded colors, spacing, or radii.
3. Write a template function in `components.js` that takes a plain data
   object and returns an HTML string, matching the style of
   `createStatCard()` / `createActionCard()`. Run any dynamic text through
   `escapeHtml()` (from `helpers.js`) before interpolating it.
4. If the component needs interactive JS behavior (not just markup), add
   generic mechanics to `ui.js` and call them from the page controller.

---

## Naming conventions

- CSS classes: `mb-` prefix (MediBook), BEM-ish `__element` naming, no
  modifier classes beyond semantic ones like `.active`, `.confirmed`.
- JS DOM hooks: `data-*` attributes (e.g. `data-quick-stats`,
  `data-hero-doctor-name`) — never hook JS to a CSS class, so styling can
  change freely without breaking behavior.
- Data files: camelCase exports matching their content (`patient`,
  `appointments`, `dashboardStats`).
- Service functions: verb-first, matching REST intent (`getPatient`,
  `bookAppointment`, `cancelAppointment`, `updateProfile`).
