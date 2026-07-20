/* ==========================================================================
   MediBook+ | Messages Module
   Vanilla JS interactions only. No backend calls — all data is local/dummy
   and stands in for future API integration.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initActiveNavSync();
  initButtonPressFeedback();
  initGlobalSearch();
  initNewSessionAction();
  initConversationFilters();
  initConversationSearch();
  initConversationSwitching();
  initChatActions();
  initMessageComposer();
  initSummaryOffcanvas();
  renderConversationList();
  selectConversation(MESSAGES_DATA.activeConversationId);
});

/* ---------------------------------------------------------------------------
   Dummy data — stands in for a future backend/API response.
--------------------------------------------------------------------------- */
const MESSAGES_DATA = {
  doctor: {
    name: 'Dr. James Wilson',
    role: 'Senior Cardiologist',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAkSbzdMCV1dVEYlzT5GZpc5O88zYnLGHI4pQ_ZOUeY1b6gSvdvXT77h406Qd2bR1nGIKt9DIkj65ZkQbxy4Dcr7183c9cMQmD-jSV1kXXPI9-a08NePJx_ksInOxusDQVHNUZxuEWOT3TAvOiGw8Pj4KsvYm7hYVgLRPTdEIguW3zVL0LCGzoiTJ6i060fgN6tZ6w8DmjVf48mlJR5PJi7GfiPRIY2lU774C4xoJQMUDe87td404Gt3A',
  },
  notifications: { unreadCount: 3 },
  activeConversationId: 'conv-1',
  conversations: [
    {
      id: 'conv-1',
      patientName: 'Eleanor Vance',
      patientId: 'PX-9921',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBy9mh47NSNhI0FoQ4E93LzbloWZbPiVYTzVN2PCG5MKFMaiPGzDnUaM5NeBCeMxVDVxfAgVSNB5FySOyhz5rJ13Fo1JjyzY14IVaqX40ueqmW8td2_-hwqGKVbZdTqBPk8iYgOXEF9txY_gObDAc8ICpJbLnda2gq4kIJVmr92Q7Z70Y4juf6NVOUTSpJ1ESk0WhTd4OxPDzsiUytnUio_M7Re79P92kb2kbIpIenvp5t8-815jlXtNg',
      lastMessage: 'Thank you, Doctor. I will monitor my BP as advised.',
      time: '10:42 AM',
      unread: true,
      priority: false,
      online: true,
      condition: { label: 'Hypertension', type: 'danger' },
      clinicalSummary: {
        status: 'Stable — post-consultation monitoring. BP trending within target range.',
        bloodPressure: '132/88',
        heartRate: '78',
        heartRateWarning: true,
        conditions: [
          { label: 'Hypertension', type: 'danger' },
          { label: 'Aspirin Sensitivity', type: 'warning' },
        ],
        prescriptions: ['Lisinopril 10mg — Daily', 'Atorvastatin 20mg — Nightly'],
        internalNotes:
          'Patient reports mild dizziness in mornings. Adjusted Lisinopril timing. Follow-up in 2 weeks.',
      },
      messages: [
        { type: 'divider', label: 'Today' },
        {
          type: 'incoming',
          text: 'Good morning, Dr. Wilson. I wanted to follow up on my blood pressure readings from this week.',
          time: '09:15 AM',
        },
        {
          type: 'outgoing',
          text: 'Good morning, Eleanor. I reviewed your home readings — they look much improved. How are you feeling overall?',
          time: '09:22 AM',
        },
        {
          type: 'incoming',
          text: 'Much better than last month. I have been taking the medication at the new time you suggested.',
          time: '09:28 AM',
        },
        {
          type: 'lab-card',
          title: 'Suggested Lab Request',
          body: 'CBC Panel + Lipid Profile — recommended based on recent vitals and medication adjustment.',
          time: '09:30 AM',
        },
        {
          type: 'outgoing',
          text: 'Excellent. I am ordering a CBC panel and lipid profile to confirm. Please schedule at your convenience.',
          time: '09:35 AM',
        },
        {
          type: 'incoming',
          text: 'Thank you, Doctor. I will monitor my BP as advised.',
          time: '10:42 AM',
        },
      ],
    },
    {
      id: 'conv-2',
      patientName: 'Julian Rossi',
      patientId: 'PX-8847',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDxt6mb1SFU954kesK4HjAFHE2k4yTh5U-o_Kq50G4am-0pxpiwkWPeX-VcEXY-QNcgugZNe_qReBRDXwVxilCR7XXDZlwLCo3LJVXsJDaaeGruSj8Wb5Kzgrho0KEZ6Agw5x2ECDHVEjXOKGgeSkJV2GztsieG8UeHyqyIXHNUdC7EVvkSGrzzOFYirphL2sIGTYGGqErMKY1b-WYAeW-4egvonyBno__94qH2-zvi8gvsMuStUjOKDQ',
      lastMessage: 'The chest pain started again after my walk this morning.',
      time: '10:18 AM',
      unread: true,
      priority: true,
      online: true,
      condition: { label: 'Post-op Monitoring', type: 'danger' },
      clinicalSummary: {
        status: 'Critical — post-operative chest pain reported. Requires immediate assessment.',
        bloodPressure: '148/94',
        heartRate: '92',
        heartRateWarning: true,
        conditions: [
          { label: 'Post-op CABG', type: 'danger' },
          { label: 'Hyperlipidemia', type: 'warning' },
        ],
        prescriptions: ['Aspirin 81mg — Daily', 'Metoprolol 25mg — BID'],
        internalNotes:
          'Referred by Dr. Reed. Lipid panel dangerously elevated. Flagged for urgent review.',
      },
      messages: [
        { type: 'divider', label: 'Today' },
        {
          type: 'incoming',
          text: 'Dr. Wilson, I was referred by Dr. Reed regarding my post-operative recovery.',
          time: '08:45 AM',
        },
        {
          type: 'outgoing',
          text: 'I have your referral and recent lab results. How have you been feeling since the procedure?',
          time: '08:52 AM',
        },
        {
          type: 'incoming',
          text: 'The chest pain started again after my walk this morning.',
          time: '10:18 AM',
        },
      ],
    },
    {
      id: 'conv-3',
      patientName: 'Mark Thompson',
      patientId: 'PX-7732',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAsBOapm_Vua8Eh1806E5PqoR9h85YDk3ONxrjmOTCF2Sq2Yjm3ABIvHFXe38egUGf1Jzt9ZHvtQ_zm9Akaqv4-7LSKtjcRbrVyftSxDSuNNkFs-7Rtgx9KTHZRy0OS8Py3kkHtvHBvWa1NdcdRLSDbSH-q_Z6ITa_zMxYdymxLwn61AC9m87QyEZB5rbarqdLVSloGn0WXGCrjPyCM0bMMuOeRIDosjajlemZEJuvCfo_IwTRUsLvVCQ',
      lastMessage: 'When can I expect the lipid panel results?',
      time: 'Yesterday',
      unread: false,
      priority: true,
      online: false,
      condition: { label: 'Abnormal Labs', type: 'warning' },
      clinicalSummary: {
        status: 'Awaiting lab review — critical lipid levels flagged by lab tech.',
        bloodPressure: '128/82',
        heartRate: '72',
        heartRateWarning: false,
        conditions: [
          { label: 'Hyperlipidemia', type: 'warning' },
          { label: 'Type 2 Diabetes', type: 'neutral' },
        ],
        prescriptions: ['Atorvastatin 40mg — Nightly', 'Metformin 500mg — BID'],
        internalNotes: 'Lipid panel completed 09:12 AM. Values dangerously elevated per Lab Tech #42.',
      },
      messages: [
        { type: 'divider', label: 'Yesterday' },
        {
          type: 'outgoing',
          text: 'Mark, your lipid panel has been ordered. Results typically arrive within 24–48 hours.',
          time: '02:15 PM',
        },
        {
          type: 'incoming',
          text: 'When can I expect the lipid panel results?',
          time: '04:30 PM',
        },
      ],
    },
    {
      id: 'conv-4',
      patientName: 'Sarah Higgins',
      patientId: 'PX-6610',
      avatar: null,
      initials: 'SH',
      lastMessage: 'Confirmed for my annual screening at 1:15 PM.',
      time: 'Yesterday',
      unread: false,
      priority: false,
      online: false,
      condition: { label: 'Preventive Care', type: 'neutral' },
      clinicalSummary: {
        status: 'Scheduled — annual screening appointment confirmed.',
        bloodPressure: '118/76',
        heartRate: '68',
        heartRateWarning: false,
        conditions: [{ label: 'No Active Conditions', type: 'neutral' }],
        prescriptions: [],
        internalNotes: 'Checked in at Waiting Room B. Nurse Smith confirmed vitals are normal.',
      },
      messages: [
        { type: 'divider', label: 'Yesterday' },
        {
          type: 'outgoing',
          text: 'Sarah, your annual screening is scheduled for 1:15 PM today. Please arrive 15 minutes early.',
          time: '08:00 AM',
        },
        {
          type: 'incoming',
          text: 'Confirmed for my annual screening at 1:15 PM.',
          time: '08:22 AM',
        },
      ],
    },
    {
      id: 'conv-5',
      patientName: 'Robert Chen',
      patientId: 'PX-5503',
      avatar: null,
      initials: 'RC',
      lastMessage: 'Medication refill request submitted.',
      time: 'Mon',
      unread: false,
      priority: false,
      online: true,
      condition: { label: 'Chronic Care', type: 'neutral' },
      clinicalSummary: {
        status: 'Routine — medication refill pending approval.',
        bloodPressure: '124/80',
        heartRate: '70',
        heartRateWarning: false,
        conditions: [{ label: 'Hypertension', type: 'danger' }],
        prescriptions: ['Lisinopril 10mg — Daily'],
        internalNotes: 'Stable patient. Refill approved for 90-day supply.',
      },
      messages: [
        { type: 'divider', label: 'Monday' },
        {
          type: 'incoming',
          text: 'Hi Dr. Wilson, I need a refill on my Lisinopril prescription.',
          time: '11:00 AM',
        },
        {
          type: 'outgoing',
          text: 'Approved. Your pharmacy will be notified within 24 hours.',
          time: '11:15 AM',
        },
        {
          type: 'incoming',
          text: 'Medication refill request submitted.',
          time: '11:16 AM',
        },
      ],
    },
  ],
};

/* ---------------------------------------------------------------------------
   Module state
--------------------------------------------------------------------------- */
let currentFilter = 'all';
let currentSearchQuery = '';
let activeConversationId = MESSAGES_DATA.activeConversationId;

/* ---------------------------------------------------------------------------
   Utility: show a bottom-right toast with a given message
--------------------------------------------------------------------------- */
function showAppToast(message) {
  const toastEl = document.getElementById('appToast');
  const toastBody = document.getElementById('appToastBody');
  if (!toastEl || !toastBody) return;

  toastBody.textContent = message;
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3200 });
  toast.show();
}

/* ---------------------------------------------------------------------------
   Active nav link syncing (reused from dashboard pattern)
--------------------------------------------------------------------------- */
function initActiveNavSync() {
  const allNavLinks = document.querySelectorAll('[data-nav]');

  allNavLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetKey = link.getAttribute('data-nav');
      if (link.getAttribute('href') === '#') {
        event.preventDefault();
      }

      allNavLinks.forEach((otherLink) => {
        const isMatch = otherLink.getAttribute('data-nav') === targetKey;
        otherLink.classList.toggle('active', isMatch);
      });

      const offcanvasEl = document.getElementById('mobileSidebar');
      if (offcanvasEl) {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (offcanvasInstance) offcanvasInstance.hide();
      }
    });
  });
}

/* ---------------------------------------------------------------------------
   Button press feedback (reused from dashboard pattern)
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
   Global topbar search
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
   New Session buttons
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
   Conversation filter buttons (All / Unread / Priority)
--------------------------------------------------------------------------- */
function initConversationFilters() {
  const buttons = document.querySelectorAll('[data-msg-filter]');
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentFilter = btn.getAttribute('data-msg-filter');
      renderConversationList();
    });
  });
}

/* ---------------------------------------------------------------------------
   Conversation list search
--------------------------------------------------------------------------- */
function initConversationSearch() {
  const searchInput = document.getElementById('conversationSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    currentSearchQuery = searchInput.value.trim().toLowerCase();
    renderConversationList();
  });
}

/* ---------------------------------------------------------------------------
   Filter conversations based on current filter + search query
--------------------------------------------------------------------------- */
function getFilteredConversations() {
  return MESSAGES_DATA.conversations.filter((conv) => {
    if (currentFilter === 'unread' && !conv.unread) return false;
    if (currentFilter === 'priority' && !conv.priority) return false;

    if (currentSearchQuery) {
      const haystack = `${conv.patientName} ${conv.patientId} ${conv.lastMessage}`.toLowerCase();
      if (!haystack.includes(currentSearchQuery)) return false;
    }

    return true;
  });
}

/* ---------------------------------------------------------------------------
   Render the conversation list
--------------------------------------------------------------------------- */
function renderConversationList() {
  const listEl = document.getElementById('conversationList');
  if (!listEl) return;

  const filtered = getFilteredConversations();
  listEl.innerHTML = '';

  if (filtered.length === 0) {
    listEl.innerHTML =
      '<p class="text-center text-muted py-4 small">No conversations match your filter.</p>';
    return;
  }

  filtered.forEach((conv) => {
    const isActive = conv.id === activeConversationId;
    const avatarHtml = conv.avatar
      ? `<img src="${conv.avatar}" alt="${conv.patientName}" class="conversation-item-avatar">`
      : `<div class="conversation-item-avatar conversation-item-avatar-initials">${conv.initials}</div>`;

    const badgeClass = `tag tag-${conv.condition.type}`;
    const unreadDot = conv.unread ? '<span class="conversation-unread-dot" aria-label="Unread"></span>' : '';

    const item = document.createElement('button');
    item.type = 'button';
    item.className = `conversation-item${isActive ? ' active' : ''}`;
    item.setAttribute('data-conversation-id', conv.id);
    item.setAttribute('aria-current', isActive ? 'true' : 'false');
    item.innerHTML = `
      ${avatarHtml}
      <div class="conversation-item-body">
        <div class="conversation-item-top">
          <span class="conversation-item-name">${conv.patientName}</span>
          <span class="conversation-item-time">${conv.time}</span>
        </div>
        <p class="conversation-item-preview">${conv.lastMessage}</p>
        <span class="tag ${badgeClass} conversation-item-badge">${conv.condition.label}</span>
      </div>
      ${unreadDot}
    `;

    item.addEventListener('click', () => {
      selectConversation(conv.id);
      if (window.innerWidth < 768) showMobileChat();
    });
    listEl.appendChild(item);
  });
}

/* ---------------------------------------------------------------------------
   Select and display a conversation
--------------------------------------------------------------------------- */
function selectConversation(conversationId) {
  const conv = MESSAGES_DATA.conversations.find((c) => c.id === conversationId);
  if (!conv) return;

  activeConversationId = conversationId;
  conv.unread = false;

  renderConversationList();
  renderChatHeader(conv);
  renderChatMessages(conv);
  renderClinicalSummary(conv);
}

/* ---------------------------------------------------------------------------
   Wire conversation list clicks (delegation fallback)
--------------------------------------------------------------------------- */
function initConversationSwitching() {
  const backBtn = document.getElementById('chatBackBtn');
  if (backBtn) {
    backBtn.addEventListener('click', showMobileConversationList);
  }
}

/* ---------------------------------------------------------------------------
   Mobile panel toggling
--------------------------------------------------------------------------- */
function showMobileChat() {
  const listPanel = document.getElementById('messagesListPanel');
  const chatPanel = document.getElementById('messagesChatPanel');
  if (!listPanel || !chatPanel) return;

  if (window.innerWidth < 768) {
    listPanel.classList.add('is-hidden-mobile');
    chatPanel.classList.add('is-visible');
  }
}

function showMobileConversationList() {
  const listPanel = document.getElementById('messagesListPanel');
  const chatPanel = document.getElementById('messagesChatPanel');
  if (!listPanel || !chatPanel) return;

  listPanel.classList.remove('is-hidden-mobile');
  chatPanel.classList.remove('is-visible');
}

/* ---------------------------------------------------------------------------
   Render chat header for the active patient
--------------------------------------------------------------------------- */
function renderChatHeader(conv) {
  const avatarEl = document.getElementById('chatHeaderAvatar');
  const nameEl = document.getElementById('chatHeaderName');
  const statusEl = document.getElementById('chatHeaderStatus');
  const onlineDot = document.getElementById('chatOnlineDot');

  if (avatarEl) {
    if (conv.avatar) {
      avatarEl.src = conv.avatar;
      avatarEl.alt = conv.patientName;
      avatarEl.style.display = '';
    }
  }

  if (nameEl) nameEl.textContent = conv.patientName;

  if (statusEl) {
    statusEl.textContent = conv.online ? 'Online' : 'Offline';
    statusEl.classList.toggle('offline', !conv.online);
  }

  if (onlineDot) {
    onlineDot.classList.toggle('offline', !conv.online);
    onlineDot.setAttribute('aria-label', conv.online ? 'Online' : 'Offline');
  }
}

/* ---------------------------------------------------------------------------
   Render chat message history
--------------------------------------------------------------------------- */
function renderChatMessages(conv) {
  const messagesEl = document.getElementById('chatMessages');
  if (!messagesEl) return;

  messagesEl.innerHTML = '';

  conv.messages.forEach((msg) => {
    if (msg.type === 'divider') {
      const divider = document.createElement('div');
      divider.className = 'chat-date-divider';
      divider.textContent = msg.label;
      messagesEl.appendChild(divider);
      return;
    }

    if (msg.type === 'lab-card') {
      const wrapper = document.createElement('div');
      wrapper.className = 'chat-message chat-message-incoming';
      wrapper.innerHTML = `
        <div class="chat-lab-card">
          <div class="chat-lab-card-header">
            <i class="bi bi-clipboard2-pulse"></i>
            <p class="chat-lab-card-title">${msg.title}</p>
          </div>
          <p class="chat-lab-card-body">${msg.body}</p>
          <div class="chat-lab-card-actions">
            <button type="button" class="btn btn-brand btn-sm" data-lab-action="approve">Approve</button>
            <button type="button" class="btn btn-neutral-solid btn-sm" data-lab-action="modify">Modify</button>
          </div>
        </div>
        <span class="chat-message-time">${msg.time}</span>
      `;

      wrapper.querySelectorAll('[data-lab-action]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const action = btn.getAttribute('data-lab-action');
          showAppToast(
            action === 'approve' ? 'Lab request approved.' : 'Lab request opened for modification.'
          );
        });
      });

      messagesEl.appendChild(wrapper);
      return;
    }

    const isOutgoing = msg.type === 'outgoing';
    const wrapper = document.createElement('div');
    wrapper.className = `chat-message chat-message-${isOutgoing ? 'outgoing' : 'incoming'}`;
    wrapper.innerHTML = `
      <div class="chat-message-bubble">${msg.text}</div>
      <span class="chat-message-time">${msg.time}</span>
    `;
    messagesEl.appendChild(wrapper);
  });

  scrollChatToBottom();
}

/* ---------------------------------------------------------------------------
   Auto-scroll chat to the latest message
--------------------------------------------------------------------------- */
function scrollChatToBottom() {
  const messagesEl = document.getElementById('chatMessages');
  if (!messagesEl) return;

  requestAnimationFrame(() => {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  });
}

/* ---------------------------------------------------------------------------
   Render clinical summary panel
--------------------------------------------------------------------------- */
function renderClinicalSummary(conv) {
  const summary = conv.clinicalSummary;
  if (!summary) return;

  const statusEl = document.getElementById('summaryStatus');
  const bpEl = document.getElementById('summaryBP');
  const hrEl = document.getElementById('summaryHR');
  const conditionsEl = document.getElementById('summaryConditions');
  const rxEl = document.getElementById('summaryRx');
  const notesEl = document.getElementById('summaryNotes');

  if (statusEl) statusEl.textContent = summary.status;
  if (bpEl) bpEl.textContent = summary.bloodPressure;

  if (hrEl) {
    hrEl.textContent = summary.heartRate;
    hrEl.classList.toggle('vital-value-warning', summary.heartRateWarning);
  }

  if (conditionsEl) {
    conditionsEl.innerHTML = summary.conditions
      .map((c) => `<span class="tag tag-${c.type}">${c.label}</span>`)
      .join('');
  }

  if (rxEl) {
    if (summary.prescriptions.length === 0) {
      rxEl.innerHTML = '<li class="summary-rx-item text-muted">No active prescriptions</li>';
    } else {
      rxEl.innerHTML = summary.prescriptions
        .map((rx) => `<li class="summary-rx-item"><i class="bi bi-capsule"></i>${rx}</li>`)
        .join('');
    }
  }

  if (notesEl) notesEl.textContent = summary.internalNotes;

  const offcanvasStatus = document.getElementById('offcanvasSummaryStatus');
  const offcanvasBP = document.getElementById('offcanvasSummaryBP');
  const offcanvasHR = document.getElementById('offcanvasSummaryHR');
  const offcanvasConditions = document.getElementById('offcanvasSummaryConditions');
  const offcanvasRx = document.getElementById('offcanvasSummaryRx');
  const offcanvasNotes = document.getElementById('offcanvasSummaryNotes');

  if (offcanvasStatus) offcanvasStatus.textContent = summary.status;
  if (offcanvasBP) offcanvasBP.textContent = summary.bloodPressure;
  if (offcanvasHR) {
    offcanvasHR.textContent = summary.heartRate;
    offcanvasHR.classList.toggle('vital-value-warning', summary.heartRateWarning);
  }
  if (offcanvasConditions) {
    offcanvasConditions.innerHTML = summary.conditions
      .map((c) => `<span class="tag tag-${c.type}">${c.label}</span>`)
      .join('');
  }
  if (offcanvasRx) {
    offcanvasRx.innerHTML =
      summary.prescriptions.length === 0
        ? '<li class="summary-rx-item text-muted">No active prescriptions</li>'
        : summary.prescriptions
            .map((rx) => `<li class="summary-rx-item"><i class="bi bi-capsule"></i>${rx}</li>`)
            .join('');
  }
  if (offcanvasNotes) offcanvasNotes.textContent = summary.internalNotes;
}

/* ---------------------------------------------------------------------------
   Chat header action buttons (video, voice, summary)
--------------------------------------------------------------------------- */
function initChatActions() {
  const videoBtn = document.getElementById('videoCallBtn');
  const voiceBtn = document.getElementById('voiceCallBtn');
  const summaryBtn = document.getElementById('summaryToggleBtn');

  if (videoBtn) {
    videoBtn.addEventListener('click', () => {
      const conv = MESSAGES_DATA.conversations.find((c) => c.id === activeConversationId);
      showAppToast(`Initiating video call with ${conv?.patientName || 'patient'}...`);
    });
  }

  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      const conv = MESSAGES_DATA.conversations.find((c) => c.id === activeConversationId);
      showAppToast(`Initiating voice call with ${conv?.patientName || 'patient'}...`);
    });
  }

  if (summaryBtn) {
    summaryBtn.addEventListener('click', () => {
      const offcanvasEl = document.getElementById('summaryOffcanvas');
      if (offcanvasEl) {
        bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl).show();
      }
    });
  }
}

/* ---------------------------------------------------------------------------
   Message composer (UI only — no send functionality)
--------------------------------------------------------------------------- */
function initMessageComposer() {
  const input = document.getElementById('messageComposerInput');
  const sendBtn = document.getElementById('messageSendBtn');

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      if (input && input.value.trim().length > 0) {
        showAppToast('Message sending is not available in this preview.');
        input.value = '';
      } else {
        showAppToast('Type a message before sending.');
      }
    });
  }

  if (input) {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendBtn?.click();
      }
    });
  }
}

/* ---------------------------------------------------------------------------
   Summary offcanvas for tablet/mobile
--------------------------------------------------------------------------- */
function initSummaryOffcanvas() {
  /* Offcanvas content is synced in renderClinicalSummary() */
}

/* ---------------------------------------------------------------------------
   Re-evaluate mobile layout on resize
--------------------------------------------------------------------------- */
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    const listPanel = document.getElementById('messagesListPanel');
    const chatPanel = document.getElementById('messagesChatPanel');
    listPanel?.classList.remove('is-hidden-mobile');
    chatPanel?.classList.add('is-visible');
  }
});
