/* ==========================================================================
   MediBook+ | Doctor Dashboard
   Vanilla JS interactions only. No backend calls — all data is local/dummy
   and stands in for future API integration.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initActiveNavSync();
  initButtonPressFeedback();
  initGlobalSearch();
  initQueueViewToggle();
  initConsultationTimer();
  initEndSessionAction();
  initNewSessionAction();
  initClinicalNotesAutosave();
  initLoadMoreQueue();
  initRxShortcuts();
});

/* ---------------------------------------------------------------------------
   Dummy data — stands in for a future backend/API response.
--------------------------------------------------------------------------- */
const DASHBOARD_DATA = {
  doctor: {
    name: 'Dr. James Wilson',
    role: 'Senior Cardiologist',
  },
  activeConsultation: {
    patient: 'Eleanor Vance',
    startedMinutesAgo: 12,
    startedSeconds: 45,
  },
  notifications: {
    unreadCount: 3,
  },
};

/* ---------------------------------------------------------------------------
   Utility: show a bottom-right toast with a given message
--------------------------------------------------------------------------- */
function showAppToast(message) {
  const toastEl = document.getElementById('appToast');
  const toastBody = document.getElementById('appToastBody');
  if (!toastEl || !toastBody) return;

  toastBody.textContent = message;

  // bootstrap.Toast is provided by the Bootstrap JS bundle
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3200 });
  toast.show();
}

/* ---------------------------------------------------------------------------
   Active nav link syncing between desktop sidebar, mobile offcanvas,
   and the mobile bottom nav, driven by data-nav attributes.
--------------------------------------------------------------------------- */
function initActiveNavSync() {
  const allNavLinks = document.querySelectorAll('[data-nav]');

  allNavLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetKey = link.getAttribute('data-nav');

      // Placeholder links (href="#") shouldn't navigate away in this demo.
      if (link.getAttribute('href') === '#') {
        event.preventDefault();
      }

      allNavLinks.forEach((otherLink) => {
        const isMatch = otherLink.getAttribute('data-nav') === targetKey;
        otherLink.classList.toggle('active', isMatch);
      });

      // Close the mobile offcanvas after choosing a destination.
      const offcanvasEl = document.getElementById('mobileSidebar');
      if (offcanvasEl) {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (offcanvasInstance) offcanvasInstance.hide();
      }
    });
  });
}

/* ---------------------------------------------------------------------------
   Subtle press feedback for all buttons (mirrors the reference design's
   micro-interaction where buttons briefly "sink" on click).
--------------------------------------------------------------------------- */
function initButtonPressFeedback() {
  document.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('mousedown', () => btn.classList.add('btn-press'));
    ['mouseup', 'mouseleave'].forEach((evt) =>
      btn.addEventListener(evt, () => btn.classList.remove('btn-press'))
    );
  });
}

/* ---------------------------------------------------------------------------
   Global search input — frontend-only demo behavior (highlight on focus,
   simple Enter-key handling). Real search would call an API.
--------------------------------------------------------------------------- */
function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearch');
  if (!searchInput) return;

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && searchInput.value.trim().length > 0) {
      event.preventDefault();
      showAppToast(`Searching for "${searchInput.value.trim()}"...`);
    }
  });
}

/* ---------------------------------------------------------------------------
   Consultation Queue: "Queue View" / "Calendar" segmented control.
   Calendar view is a placeholder for a future scheduling component.
--------------------------------------------------------------------------- */
function initQueueViewToggle() {
  const buttons = document.querySelectorAll('[data-queue-view]');
  const timeline = document.getElementById('queueTimeline');
  if (!buttons.length || !timeline) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const view = btn.getAttribute('data-queue-view');
      if (view === 'calendar') {
        showAppToast('Calendar view is coming soon for this workspace.');
      }
    });
  });
}

/* ---------------------------------------------------------------------------
   Active Consultation timer — counts up from the dummy elapsed time.
   In production this would be driven by the real consultation start time.
--------------------------------------------------------------------------- */
function initConsultationTimer() {
  const timerEl = document.getElementById('consultationTimer');
  if (!timerEl) return;

  let totalSeconds =
    DASHBOARD_DATA.activeConsultation.startedMinutesAgo * 60 +
    DASHBOARD_DATA.activeConsultation.startedSeconds;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  timerEl.textContent = formatTime(totalSeconds);

  window.consultationTimerInterval = setInterval(() => {
    totalSeconds += 1;
    timerEl.textContent = formatTime(totalSeconds);
  }, 1000);
}

/* ---------------------------------------------------------------------------
   End Session action — stops the timer and confirms via toast.
--------------------------------------------------------------------------- */
function initEndSessionAction() {
  const endBtn = document.getElementById('endSessionBtn');
  if (!endBtn) return;

  endBtn.addEventListener('click', () => {
    if (window.consultationTimerInterval) {
      clearInterval(window.consultationTimerInterval);
    }
    showAppToast(`Session with ${DASHBOARD_DATA.activeConsultation.patient} ended.`);
  });
}

/* ---------------------------------------------------------------------------
   New Session buttons (sidebar + mobile FAB)
--------------------------------------------------------------------------- */
function initNewSessionAction() {
  const desktopBtn = document.getElementById('newSessionBtn');
  const mobileBtn = document.getElementById('mobileNewSessionBtn');

  [desktopBtn, mobileBtn].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      showAppToast('Starting a new patient session...');
    });
  });
}

/* ---------------------------------------------------------------------------
   Clinical Notes textarea — simulated "auto-save" indicator on typing pause.
--------------------------------------------------------------------------- */
function initClinicalNotesAutosave() {
  const notesEl = document.getElementById('clinicalNotes');
  const appendBtn = document.getElementById('appendEmrBtn');
  const voiceBtn = document.getElementById('voiceDictateBtn');
  if (!notesEl) return;

  let autosaveTimeout = null;

  notesEl.addEventListener('input', () => {
    clearTimeout(autosaveTimeout);
    autosaveTimeout = setTimeout(() => {
      // Placeholder for a future debounced save-to-EMR API call.
      console.info('Clinical note auto-saved (dummy):', notesEl.value);
    }, 1000);
  });

  if (appendBtn) {
    appendBtn.addEventListener('click', () => {
      if (notesEl.value.trim().length === 0) {
        showAppToast('Add a note before appending to the EMR.');
        return;
      }
      showAppToast('Note appended to patient EMR.');
      notesEl.value = '';
    });
  }

  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      showAppToast('Voice dictation is not available in this preview.');
    });
  }
}

/* ---------------------------------------------------------------------------
   "Load Full Today's Schedule" — placeholder for pagination/API fetch.
--------------------------------------------------------------------------- */
function initLoadMoreQueue() {
  const loadMoreBtn = document.getElementById('loadMoreQueueBtn');
  if (!loadMoreBtn) return;

  loadMoreBtn.addEventListener('click', () => {
    showAppToast('Loading the rest of today\u2019s schedule...');
  });
}

/* ---------------------------------------------------------------------------
   Rx Shortcuts — clicking a shortcut simulates queuing a prescription.
--------------------------------------------------------------------------- */
function initRxShortcuts() {
  document.querySelectorAll('.rx-shortcut-item').forEach((item) => {
    item.addEventListener('click', () => {
      const name = item.querySelector('.rx-name')?.textContent.trim();
      if (name) showAppToast(`${name} added to prescription draft.`);
    });
  });
}
