/**
 * messages.js
 * ---------------------------------------------------------------------------
 * Page controller for Messages. Follows the same pattern as every other
 * page controller: fetch through services/api.js, render with
 * components.js templates, keep all page state local to this module.
 *
 * Real-time readiness: this file already calls services/api.js's
 * subscribeToMessages() when a conversation opens, and cleans it up
 * (unsubscribe) when switching conversations. That function is a
 * documented no-op today — swapping it for a real WebSocket subscription
 * later requires no changes here, only in the service layer.
 * ---------------------------------------------------------------------------
 */

import {
  getConversations,
  getMessages,
  sendMessage,
  markConversationRead,
  subscribeToMessages,
} from './services/api.js';
import { createConversationItem, createMessageBubble, createEmptyState } from './components.js';
import { qs, debounce, formatConversationTime, formatTime } from './helpers.js';

/** Same mock "today" used across the app, for relative timestamp formatting. */
const MOCK_TODAY = new Date(2023, 9, 24);

let allConversations = [];
let activeConversationId = null;
let searchTerm = '';
let unsubscribeFromActive = null;

/* ---------------------------------------------------------------------
 * Conversation list
 * --------------------------------------------------------------------- */

function getFilteredConversations() {
  if (!searchTerm) return allConversations;
  const term = searchTerm.toLowerCase();
  return allConversations.filter((c) => `${c.doctorName} ${c.department}`.toLowerCase().includes(term));
}

function renderConversationList() {
  const mount = qs('[data-conversations-list]');
  const results = getFilteredConversations();

  mount.innerHTML = results.length
    ? results
        .map((c) =>
          createConversationItem(
            { ...c, formattedTime: formatConversationTime(c.lastMessageAt, MOCK_TODAY) },
            c.id === activeConversationId
          )
        )
        .join('')
    : createEmptyState({ icon: 'bi-search', message: 'No conversations match your search.' });
}

function initConversationSearch() {
  qs('[data-conversations-search]').addEventListener(
    'input',
    debounce((e) => {
      searchTerm = e.target.value.trim();
      renderConversationList();
    }, 200)
  );
}

function initConversationSelection() {
  qs('[data-conversations-list]').addEventListener('click', (e) => {
    const item = e.target.closest('[data-conversation-id]');
    if (!item) return;
    selectConversation(item.dataset.conversationId);
  });
}

/* ---------------------------------------------------------------------
 * Chat pane
 * --------------------------------------------------------------------- */

function renderEmptyChatState() {
  qs('[data-chat-pane]').innerHTML = `
    <div class="mb-chat-empty-state">
      ${createEmptyState({ icon: 'bi-chat-square-text', message: 'Select a conversation to start chatting.' })}
    </div>`;
}

function renderChatPane(conversation) {
  qs('[data-chat-pane]').innerHTML = `
    <div class="mb-chat-header">
      <button type="button" class="mb-row-action mb-chat-back-btn" data-action="back-to-list" aria-label="Back to conversation list">
        <i class="bi bi-arrow-left" aria-hidden="true"></i>
      </button>
      <div class="avatar-initials" style="width:36px;height:36px;font-size:13px;" aria-hidden="true">${conversation.doctorInitials}</div>
      <div>
        <p class="mb-chat-header__name">${conversation.doctorName}</p>
        <span class="mb-chat-header__dept">${conversation.department}</span>
      </div>
    </div>
    <div class="mb-chat-messages" data-chat-messages></div>
    <form class="mb-chat-input-bar" data-chat-input-bar>
      <textarea class="mb-form-control" rows="1" placeholder="Type a message…" data-chat-input aria-label="Message"></textarea>
      <button type="submit" class="mb-btn mb-btn-primary mb-btn-icon-circle" aria-label="Send message">
        <i class="bi bi-send" aria-hidden="true"></i>
      </button>
    </form>`;

  initChatInput(conversation);
  qs('[data-action="back-to-list"]').addEventListener('click', () => {
    qs('[data-messages-shell]').classList.remove('is-chat-open');
  });
}

function renderMessages(messages, doctorInitials) {
  const mount = qs('[data-chat-messages]');
  mount.innerHTML = messages
    .map((m) => createMessageBubble({ ...m, formattedTime: formatTime(m.timestamp), doctorInitials }))
    .join('');
  mount.scrollTop = mount.scrollHeight;
}

function initChatInput(conversation) {
  const form = qs('[data-chat-input-bar]');
  const textarea = qs('[data-chat-input]');

  const submit = async () => {
    const text = textarea.value.trim();
    if (!text) return;

    // Optimistically render the patient's own bubble immediately.
    const optimisticMessage = { sender: 'patient', text, timestamp: new Date().toISOString() };
    const mount = qs('[data-chat-messages]');
    mount.insertAdjacentHTML('beforeend', createMessageBubble({ ...optimisticMessage, formattedTime: formatTime(optimisticMessage.timestamp) }));
    mount.scrollTop = mount.scrollHeight;
    textarea.value = '';

    await sendMessage(conversation.id, text);

    // Reflect the new preview/order in the conversation list without a full re-fetch.
    const updated = allConversations.find((c) => c.id === conversation.id);
    if (updated) {
      updated.lastMessage = text;
      updated.lastMessageAt = optimisticMessage.timestamp;
      allConversations.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
      renderConversationList();
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submit();
  });
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  });
}

/* ---------------------------------------------------------------------
 * Selecting a conversation
 * --------------------------------------------------------------------- */

async function selectConversation(conversationId) {
  if (unsubscribeFromActive) unsubscribeFromActive();

  activeConversationId = conversationId;
  const conversation = allConversations.find((c) => c.id === conversationId);
  if (!conversation) return;

  if (conversation.unreadCount > 0) {
    await markConversationRead(conversationId);
    conversation.unreadCount = 0;
  }
  renderConversationList();
  renderChatPane(conversation);

  const messages = await getMessages(conversationId);
  renderMessages(messages, conversation.doctorInitials);

  // See file header: documented no-op today, real subscription later.
  unsubscribeFromActive = subscribeToMessages(conversationId, (incoming) => {
    renderMessages([...messages, incoming], conversation.doctorInitials);
  });

  qs('[data-messages-shell]').classList.add('is-chat-open');
}

/* ---------------------------------------------------------------------
 * Init
 * --------------------------------------------------------------------- */

async function initMessages() {
  initConversationSearch();
  initConversationSelection();
  renderEmptyChatState();

  allConversations = await getConversations();
  renderConversationList();
}

document.addEventListener('DOMContentLoaded', initMessages);
