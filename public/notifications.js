// notifications.js
document.addEventListener('DOMContentLoaded', () => {
    const notifContainer = document.getElementById('global-notif-container');
    if (!notifContainer) return; 

    notifContainer.innerHTML = `
        <div class="relative">
            <button id="notif-bell-btn" class="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container-high rounded-full transition-colors relative">
                notifications
                <span id="notif-badge" class="hidden absolute top-1 right-1 bg-error text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </button>
            <div id="notif-dropdown" class="hidden absolute right-0 mt-2 w-80 bg-surface-bright border border-outline-variant/20 rounded-xl shadow-lg z-50 overflow-hidden flex flex-col max-h-96">
                <div class="p-md border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
                    <h3 class="font-title-md text-on-surface font-semibold">Notifications</h3>
                    <button id="notif-mark-all" class="text-primary font-label-sm hover:underline">Mark all read</button>
                </div>
                <div id="notif-list" class="overflow-y-auto flex-1 divide-y divide-outline-variant/10">
                    <div class="p-md text-center text-on-surface-variant italic text-sm">Loading...</div>
                </div>
            </div>
        </div>
    `;

    const bellBtn = document.getElementById('notif-bell-btn');
    const dropdown = document.getElementById('notif-dropdown');
    const badge = document.getElementById('notif-badge');
    const list = document.getElementById('notif-list');
    const markAllBtn = document.getElementById('notif-mark-all');

    let notifications = [];

    async function fetchUnreadCount() {
        try {
            const res = await window.API.notifications.getUnreadCount();
            if (res.success && res.data) {
                const count = res.data.count;
                if (count > 0) {
                    badge.innerText = count > 99 ? '99+' : count;
                    badge.classList.remove('hidden');
                } else {
                    badge.classList.add('hidden');
                }
            }
        } catch (e) { console.error('Failed to fetch unread count', e); }
    }

    async function fetchNotifications() {
        list.innerHTML = '<div class="p-md text-center text-on-surface-variant italic text-sm">Loading...</div>';
        try {
            const res = await window.API.notifications.list('?limit=10');
            if (res.success && res.data && res.data.notifications) {
                notifications = res.data.notifications;
                renderNotifications();
            }
        } catch (e) {
            console.error('Failed to fetch notifications', e);
            list.innerHTML = '<div class="p-md text-center text-error italic text-sm">Error loading notifications</div>';
        }
    }

    function renderNotifications() {
        if (notifications.length === 0) {
            list.innerHTML = '<div class="p-md text-center text-on-surface-variant italic text-sm py-xl">No notifications</div>';
            return;
        }

        list.innerHTML = notifications.map(notif => {
            const isRead = notif.read;
            const dateStr = new Date(notif.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            
            let icon = 'notifications';
            if (notif.type.includes('approved')) icon = 'check_circle';
            else if (notif.type.includes('rejected') || notif.type.includes('cancelled')) icon = 'cancel';
            else if (notif.type.includes('rescheduled') || notif.type.includes('reminder')) icon = 'event';

            return `
                <div class="p-md flex gap-md items-start ${isRead ? 'opacity-70' : 'bg-primary/5'} hover:bg-surface-container-low transition-colors cursor-pointer notif-item" data-id="${notif.id || notif._id}">
                    <span class="material-symbols-outlined text-primary mt-1">${icon}</span>
                    <div class="flex-1">
                        <p class="font-body-sm text-on-surface ${isRead ? '' : 'font-semibold'}">${notif.message}</p>
                        <p class="text-[11px] text-on-surface-variant mt-1">${dateStr}</p>
                    </div>
                    ${!isRead ? `<button class="material-symbols-outlined text-[18px] text-on-surface-variant hover:text-primary notif-mark-read-btn" data-id="${notif.id || notif._id}" title="Mark as read">mark_email_read</button>` : ''}
                </div>
            `;
        }).join('');
    }

    bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
        if (!dropdown.classList.contains('hidden')) {
            fetchNotifications();
            fetchUnreadCount();
        }
    });

    document.addEventListener('click', (e) => {
        if (!notifContainer.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });

    list.addEventListener('click', async (e) => {
        const markBtn = e.target.closest('.notif-mark-read-btn');
        if (markBtn) {
            e.stopPropagation();
            const id = markBtn.getAttribute('data-id');
            try {
                const res = await window.API.notifications.markRead(id);
                if (res.success) {
                    const notif = notifications.find(n => (n.id || n._id) === id);
                    if (notif) notif.read = true;
                    renderNotifications();
                    fetchUnreadCount();
                }
            } catch (err) { console.error(err); }
        }
    });

    markAllBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
            const res = await window.API.notifications.markAllRead();
            if (res.success) {
                notifications.forEach(n => n.read = true);
                renderNotifications();
                fetchUnreadCount();
            }
        } catch (err) { console.error(err); }
    });

    if (window.API && window.API.fetch) {
        setTimeout(fetchUnreadCount, 500);
        setInterval(fetchUnreadCount, 60000);
    }
});
