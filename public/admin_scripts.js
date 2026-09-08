// ============================================================
// admin_scripts.js — Shared admin UI helpers
// All selectors are null-checked to prevent crashes on pages
// where elements don't exist.
// ============================================================

(function () {
    // --- Search filter (table rows) ---
    const searchInput = document.querySelector('input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll('tbody tr').forEach(row => {
                row.style.display = row.innerText.toLowerCase().includes(query) ? '' : 'none';
            });
        });
        searchInput.addEventListener('focus', () => {
            if (searchInput.parentElement) searchInput.parentElement.classList.add('ring-2', 'ring-primary/20');
        });
        searchInput.addEventListener('blur', () => {
            if (searchInput.parentElement) searchInput.parentElement.classList.remove('ring-2', 'ring-primary/20');
        });
    }

    // --- Table row click → checkbox toggle ---
    document.querySelectorAll('tbody tr').forEach(row => {
        row.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                const checkbox = row.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    row.classList.toggle('bg-primary-container/10', checkbox.checked);
                }
            }
        });
    });

    // --- Status badge dynamic styling ---
    document.querySelectorAll('.rounded-full.text-label-sm').forEach(badge => {
        const text = badge.innerText.trim();
        if (text === 'Active') {
            badge.className = 'inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-label-sm';
        } else if (text === 'In Surgery') {
            badge.className = 'inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-label-sm';
        } else if (text === 'On Leave') {
            badge.className = 'inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-label-sm';
        }
    });

    // --- Sticky header shadow on scroll ---
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            header.classList.toggle('shadow-md', window.scrollY > 20);
        }
    });

    // --- FAB quick-actions toggle ---
    const fab = document.getElementById('fab-trigger');
    const menu = document.getElementById('quick-actions-menu');
    const fabIcon = document.getElementById('fab-icon');
    if (fab && menu && fabIcon) {
        fab.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            menu.classList.toggle('flex');
            if (!menu.classList.contains('hidden')) {
                fabIcon.textContent = 'close';
                fabIcon.style.transform = 'rotate(90deg)';
            } else {
                fabIcon.textContent = 'bolt';
                fabIcon.style.transform = 'rotate(0deg)';
            }
        });
        window.addEventListener('click', (e) => {
            if (!fab.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.add('hidden');
                menu.classList.remove('flex');
                fabIcon.textContent = 'bolt';
                fabIcon.style.transform = 'rotate(0deg)';
            }
        });
    }

    // --- Save toast ---
    function showToast() {
        const toast = document.getElementById('saveToast');
        if (!toast) return;
        toast.classList.remove('translate-y-20', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
        setTimeout(hideToast, 5000);
    }
    function hideToast() {
        const toast = document.getElementById('saveToast');
        if (!toast) return;
        toast.classList.add('translate-y-20', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }
    window.showToast = showToast;
    window.hideToast = hideToast;

    document.querySelectorAll('button').forEach(btn => {
        if (btn.innerText && (btn.innerText.includes('Save Changes') || btn.innerText.includes('Save Schedule'))) {
            btn.addEventListener('click', showToast);
        }
    });

    // --- Record/Tab switcher ---
    window.switchTab = function (tabId) {
        document.querySelectorAll('section[id^="content-"], #record-content > div').forEach(el => el.classList.add('hidden'));
        const content = document.getElementById('content-' + tabId);
        if (content) content.classList.remove('hidden');

        document.querySelectorAll('[id^="tab-"]').forEach(tab => {
            tab.classList.remove('text-primary', 'font-bold', 'border-primary', 'bg-surface-container-lowest', 'shadow-sm');
            tab.classList.add('text-on-surface-variant', 'border-transparent');
        });
        const activeTab = document.getElementById('tab-' + tabId);
        if (activeTab) {
            activeTab.classList.add('text-primary', 'font-bold', 'border-primary');
            activeTab.classList.remove('text-on-surface-variant', 'border-transparent');
        }
    };

    // --- Sidebar version toggle ---
    window.toggleSidebar = function () {
        const sidebar = document.getElementById('versionSidebar');
        if (sidebar) sidebar.classList.toggle('translate-x-full');
    };

    // --- Sidebar nav active state ---
    const navLinks = document.querySelectorAll('aside nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => {
                l.classList.remove('bg-secondary-container', 'text-on-secondary-container', 'font-bold');
                l.classList.add('text-on-surface-variant');
            });
            link.classList.add('bg-secondary-container', 'text-on-secondary-container', 'font-bold');
            link.classList.remove('text-on-surface-variant');
        });
    });

    // --- Button micro-interactions ---
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function () {
            if (this.classList.contains('scale-95')) return;
            this.classList.add('scale-95', 'opacity-80');
            setTimeout(() => this.classList.remove('scale-95', 'opacity-80'), 150);
        });
    });

    // --- Textarea auto-resize ---
    const textarea = document.querySelector('textarea');
    if (textarea) {
        textarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 150) + 'px';
            this.style.overflowY = this.scrollHeight > 150 ? 'scroll' : 'hidden';
        });
    }

    // --- Conversation list active state ---
    const convos = document.querySelectorAll('.flex-1.overflow-y-auto > div');
    convos.forEach(convo => {
        convo.addEventListener('click', () => {
            convos.forEach(c => {
                c.classList.remove('bg-primary/5', 'border-r-4', 'border-primary');
                c.classList.add('border-b', 'border-surface-container/50');
            });
            convo.classList.add('bg-primary/5', 'border-r-4', 'border-primary');
            convo.classList.remove('border-b');
        });
    });

    // --- Tab switching (border-b style tabs) ---
    const borderTabs = document.querySelectorAll('.border-b button');
    borderTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            borderTabs.forEach(t => {
                t.classList.remove('text-primary', 'font-bold', 'border-primary', 'border-b-2');
                t.classList.add('text-on-surface-variant');
            });
            tab.classList.add('text-primary', 'font-bold', 'border-primary', 'border-b-2');
            tab.classList.remove('text-on-surface-variant');
        });
    });

})();
