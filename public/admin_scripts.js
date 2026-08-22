// Simple search filtering simulation
        const searchInput = document.querySelector('input[type="text"]');
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const text = row.innerText.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });

        // Hover effects and click handling for table rows
        document.querySelectorAll('tbody tr').forEach(row => {
            row.addEventListener('click', (e) => {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                    // Row selection logic
                    const checkbox = row.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                    row.classList.toggle('bg-primary-container/10', checkbox.checked);
                }
            });
        });

        // Dynamic styling for status colors based on content
        const statusBadges = document.querySelectorAll('.rounded-full.text-label-sm');
        statusBadges.forEach(badge => {
            const text = badge.innerText.trim();
            if (text === 'Active') {
                badge.className = 'inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-label-sm';
            } else if (text === 'In Surgery') {
                badge.className = 'inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-label-sm';
            } else if (text === 'On Leave') {
                badge.className = 'inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-label-sm';
            }
        });

function showToast() {
        const toast = document.getElementById('saveToast');
        toast.classList.remove('translate-y-20', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
        setTimeout(hideToast, 5000);
    }
    function hideToast() {
        const toast = document.getElementById('saveToast');
        toast.classList.add('translate-y-20', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }

    document.querySelectorAll('button').forEach(btn => {
        if(btn.innerText.includes('Save Changes')) {
            btn.onclick = showToast;
        }
    });

function toggleSidebar() {
            const sidebar = document.getElementById('versionSidebar');
            sidebar.classList.toggle('translate-x-full');
        }

        // Mock interaction: Clicking a version badge in the table opens the sidebar
        document.querySelectorAll('.px-lg.py-lg:nth-child(5) span').forEach(el => {
            el.style.cursor = 'pointer';
            el.addEventListener('click', toggleSidebar);
        });

document.querySelectorAll('.hover\\:bg-surface-container-low').forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.classList.add('shadow-md');
            el.classList.add('-translate-y-0.5');
        });
        el.addEventListener('mouseleave', () => {
            el.classList.remove('shadow-md');
            el.classList.remove('-translate-y-0.5');
        });
    });

// Micro-interactions for table rows
        document.querySelectorAll('tbody tr').forEach(row => {
            row.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    console.log('Opening patient details for row:', row.querySelector('.font-title-md').innerText);
                }
            });
        });

        // Search highlight interaction
        const searchInput = document.querySelector('input[type="text"]');
        searchInput.addEventListener('focus', () => {
            searchInput.parentElement.classList.add('ring-primary/20');
        });
        searchInput.addEventListener('blur', () => {
            searchInput.parentElement.classList.remove('ring-primary/20');
        });

function switchTab(tabId) {
            // Hide all contents
            const contents = document.querySelectorAll('#record-content > div');
            contents.forEach(content => content.classList.add('hidden'));

            // Show selected content
            document.getElementById('content-' + tabId).classList.remove('hidden');

            // Reset tab styles
            const tabs = document.querySelectorAll('[id^="tab-"]');
            tabs.forEach(tab => {
                tab.classList.remove('text-primary', 'font-bold', 'border-primary');
                tab.classList.add('text-on-surface-variant', 'border-transparent');
            });

            // Highlight active tab
            const activeTab = document.getElementById('tab-' + tabId);
            activeTab.classList.add('text-primary', 'font-bold', 'border-primary');
            activeTab.classList.remove('text-on-surface-variant', 'border-transparent');
        }

        // Add some basic interactivity for buttons
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', function(e) {
                if(this.classList.contains('scale-95')) return;
                this.classList.add('scale-95', 'opacity-80');
                setTimeout(() => {
                    this.classList.remove('scale-95', 'opacity-80');
                }, 150);
            });
        });

// Micro-interaction for the chat input auto-resize
        const textarea = document.querySelector('textarea');
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            if (this.scrollHeight > 150) {
                this.style.overflowY = 'scroll';
            } else {
                this.style.overflowY = 'hidden';
            }
        });

        // Simple active state toggle for conversation list
        const convos = document.querySelectorAll('.flex-1.overflow-y-auto > div');
        convos.forEach(convo => {
            convo.addEventListener('click', () => {
                convos.forEach(c => {
                    c.classList.remove('bg-primary/5', 'border-r-4', 'border-primary');
                    c.classList.add('border-b', 'border-surface-container/50');
                });
                convo.classList.add('bg-primary/5', 'border-r-4', 'border-primary');
                convo.classList.remove('border-b', 'border-surface-container/50');
            });
        });

// Simple search feedback
        const searchInputs = document.querySelectorAll('input[type="text"]');
        searchInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('ring-2', 'ring-primary/20');
            });
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('ring-2', 'ring-primary/20');
            });
        });

        // Toggle mobile nav (mock logic)
        function toggleNav() {
            console.log('Toggle navigation');
        }

const days = ["Mon 09", "Tue 10", "Wed 11", "Thu 12", "Fri 13", "Sat 14", "Sun 15"];
                                    const editorContainer = document.currentScript.parentElement;
                                    
                                    days.forEach((day, idx) => {
                                        const isWeekend = idx > 4;
                                        const col = document.createElement('div');
                                        col.className = 'col-span-1 flex flex-col gap-2';
                                        
                                        let html = `<div class="text-center pb-4"><p class="text-[10px] uppercase tracking-wider font-bold ${isWeekend ? 'text-slate-400' : 'text-primary'}">${day.split(' ')[0]}</p><p class="text-lg font-black text-slate-800">${day.split(' ')[1]}</p></div>`;
                                        
                                        // Slots simulation
                                        for(let i=0; i<10; i++) {
                                            let stateClass = 'bg-slate-50 border-slate-100';
                                            let icon = '';
                                            
                                            if(!isWeekend) {
                                                if(i < 4 || (i > 5 && i < 9)) {
                                                    stateClass = 'bg-[#06949420] border-primary/20 hover:bg-primary hover:text-white cursor-pointer';
                                                } else if (i === 4 || i === 5) {
                                                    stateClass = 'bg-orange-50 border-orange-200 text-orange-600';
                                                    icon = '<span class="material-symbols-outlined text-sm">restaurant</span>';
                                                }
                                            } else {
                                                stateClass = 'bg-slate-100 border-slate-200 opacity-50';
                                            }
                                            
                                            html += `<div class="h-12 border rounded-lg transition-all flex items-center justify-center ${stateClass}">${icon}</div>`;
                                        }
                                        col.innerHTML = html;
                                        editorContainer.appendChild(col);
                                    });

function openModal() {
            const modal = document.getElementById('reminderModal');
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.add('opacity-100');
                modal.querySelector('div').classList.remove('scale-95');
                modal.querySelector('div').classList.add('scale-100');
            }, 10);
        }

        function closeModal() {
            const modal = document.getElementById('reminderModal');
            modal.classList.remove('opacity-100');
            modal.querySelector('div').classList.remove('scale-100');
            modal.querySelector('div').classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }

        function showSuccess() {
            alert('Reminders have been sent successfully!');
            closeModal();
        }

        // Attach modal open to the summary button
        document.querySelector('button[class*="Bulk Reminders"]').addEventListener('click', openModal);

        // Simple tab active tracking
        const navLinks = document.querySelectorAll('aside nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                navLinks.forEach(l => {
                    l.classList.remove('text-primary', 'font-bold', 'border-r-4', 'border-primary');
                    l.classList.add('text-on-surface-variant');
                });
                link.classList.add('text-primary', 'font-bold', 'border-r-4', 'border-primary');
                link.classList.remove('text-on-surface-variant');
            });
        });

// Simple hover effects and animations for chart bars
        document.querySelectorAll('.w-8').forEach(bar => {
            bar.addEventListener('mouseenter', () => {
                bar.classList.add('scale-x-110');
            });
            bar.addEventListener('mouseleave', () => {
                bar.classList.remove('scale-x-110');
            });
        });

        // Sticky header background shift on scroll
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 20) {
                header.classList.add('bg-surface-container-lowest', 'shadow-md');
            } else {
                header.classList.remove('bg-surface-container-lowest', 'shadow-md');
            }
        });

function showToast() {
        const toast = document.getElementById('saveToast');
        toast.classList.remove('translate-y-20', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
        setTimeout(hideToast, 5000);
    }
    function hideToast() {
        const toast = document.getElementById('saveToast');
        toast.classList.add('translate-y-20', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }

    // Connect save button
    document.querySelectorAll('button').forEach(btn => {
        if(btn.innerText.includes('Save Schedule')) {
            btn.onclick = showToast;
        }
    });

// Simulating heatmap squares in raw HTML for efficiency
                            document.write(Array(42).fill(0).map(() => {
                                const intensities = ['bg-primary-container/20', 'bg-primary-container/40', 'bg-primary-container/60', 'bg-primary', 'bg-primary-fixed-dim'];
                                const randomIntensity = intensities[Math.floor(Math.random() * intensities.length)];
                                return `<div class="rounded-sm ${randomIntensity} hover:ring-2 hover:ring-white cursor-pointer transition-all"></div>`;
                            }).join(''));

// Tab switching simulation
        const tabs = document.querySelectorAll('.border-b button');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => {
                    t.classList.remove('text-primary', 'font-bold', 'border-primary', 'border-b-2');
                    t.classList.add('text-on-surface-variant', 'font-label-md');
                });
                tab.classList.add('text-primary', 'font-bold', 'border-primary', 'border-b-2');
                tab.classList.remove('text-on-surface-variant');
            });
        });

        // Search highlight effect
        const searchInput = document.querySelector('input[type="text"]');
        searchInput.addEventListener('focus', () => {
            searchInput.parentElement.classList.add('ring-primary/50');
        });
        searchInput.addEventListener('blur', () => {
            searchInput.parentElement.classList.remove('ring-primary/50');
        });

function switchTab(tabId) {
            // Hide all contents
            document.querySelectorAll('section[id^="content-"]').forEach(el => el.classList.add('hidden'));
            
            // Show selected content
            document.getElementById('content-' + tabId).classList.remove('hidden');
            
            // Update button styles
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('text-primary', 'bg-surface-container-lowest', 'shadow-sm');
                btn.classList.add('text-on-surface-variant', 'hover:bg-surface-container-low');
            });
            
            const activeBtn = document.getElementById('tab-' + tabId);
            activeBtn.classList.add('text-primary', 'bg-surface-container-lowest', 'shadow-sm');
            activeBtn.classList.remove('text-on-surface-variant', 'hover:bg-surface-container-low');
        }

// Micro-interaction for Quick Actions FAB
        const fab = document.getElementById('fab-trigger');
        const menu = document.getElementById('quick-actions-menu');
        const icon = document.getElementById('fab-icon');

        fab.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            menu.classList.toggle('flex');
            
            if (!menu.classList.contains('hidden')) {
                icon.textContent = 'close';
                icon.style.transform = 'rotate(90deg)';
            } else {
                icon.textContent = 'bolt';
                icon.style.transform = 'rotate(0deg)';
            }
        });

        // Close menu on outside click
        window.addEventListener('click', (e) => {
            if (!fab.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.add('hidden');
                menu.classList.remove('flex');
                icon.textContent = 'bolt';
                icon.style.transform = 'rotate(0deg)';
            }
        });

// Simple micro-interactions for trend charts
        document.querySelectorAll('.department-card-hover').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const line = card.querySelector('.trend-line');
                if (line) {
                    line.style.animation = 'none';
                    line.offsetHeight; // trigger reflow
                    line.style.animation = 'dash 1.5s ease-out forwards';
                }
            });
        });

