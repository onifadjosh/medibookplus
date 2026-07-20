function togglePassword() {
    const input = document.getElementById('password');
    const icon = document.getElementById('pw-toggle');
    if (input && icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.textContent = 'visibility_off';
        } else {
            input.type = 'password';
            icon.textContent = 'visibility';
        }
    }
}

// Form Submission Micro-interaction
var el_loginForm = document.getElementById('loginForm'); 
if (el_loginForm) {
    el_loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        if (!btn) return;
        const originalContent = btn.innerHTML;
        
        btn.disabled = true;
        btn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span> Authenticating...';
        
        setTimeout(() => {
            btn.classList.add('bg-tertiary-container');
            btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Verified';
            setTimeout(() => {
                const role = localStorage.getItem('userRole');
                if (role === 'provider') {
                    window.location.href = '../doctor/dashboard.html';
                } else {
                    window.location.href = '../patient/pages/dashboard.html';
                }
            }, 1000);
        }, 1500);
    });
}
// Simple Micro-interaction: Omnibar highlight focus
        const omnibar = document.querySelector('input');
if(omnibar) {
        const searchIcon = document.querySelector('.material-symbols-outlined.mx-md');
        
        omnibar.addEventListener('focus', () => {
            searchIcon.classList.add('scale-110');
            searchIcon.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });

        omnibar.addEventListener('blur', () => {
            searchIcon.classList.remove('scale-110');
        });
}

        // Search highlight logic for demo
        const cards = document.querySelectorAll('.glass-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0px)';
            });
        });

function switchTab(btn, tabName) {
            // Update Tab Styling
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('text-primary', 'border-b-2', 'border-primary', 'active');
                b.classList.add('text-on-surface-variant');
            });
            btn.classList.add('text-primary', 'border-b-2', 'border-primary', 'active');
            btn.classList.remove('text-on-surface-variant');

            // Toggle Content
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            const content = document.getElementById(tabName + '-content');
            if (content) content.classList.remove('hidden');
        }

        // Simple smooth scroll and intersection observer could be added here for animations
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-4');
                }
            });
        }, observerOptions);

        document.querySelectorAll('section').forEach(section => {
            section.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-4');
            observer.observe(section);
        });

// Micro-interaction for filter buttons
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', function() {
                if(this.classList.contains('bg-surface-container-highest')) {
                    this.classList.remove('bg-surface-container-highest', 'text-on-surface-variant');
                    this.classList.add('bg-primary-container', 'text-on-primary-container', 'border-primary');
                } else if (this.classList.contains('bg-primary-container') && this.parentElement.classList.contains('flex-wrap')) {
                    this.classList.add('bg-surface-container-highest', 'text-on-surface-variant');
                    this.classList.remove('bg-primary-container', 'text-on-primary-container', 'border-primary');
                }
            });
        });

        // Basic toggle logic for favorites/bookmarking could be added here
        // Filtering simulation
        const searchInput = document.querySelector('input[type="text"]');
if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            console.log('Searching for:', e.target.value);
        });
}

// Micro-interaction for timeline items
        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('scale-[1.02]');
                card.style.transition = 'transform 0.3s ease';
            });
            card.addEventListener('mouseleave', () => {
                card.classList.remove('scale-[1.02]');
            });
        });

        // Smooth reveal animation on scroll
        const revealElements = document.querySelectorAll('.clinical-shadow');
        const revealOnScroll = () => {
            revealElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    el.classList.add('opacity-100', 'translate-y-0');
                    el.classList.remove('opacity-0', 'translate-y-10');
                }
            });
        };
        
        // Initial state for reveal
        revealElements.forEach(el => {
            el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
        });

        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Trigger once on load

// Micro-interactions for form focus
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.closest('div').classList.add('scale-[1.01]');
                input.parentElement.closest('div').style.transition = 'transform 0.2s ease-out';
            });
            input.addEventListener('blur', () => {
                input.parentElement.closest('div').classList.remove('scale-[1.01]');
            });
        });

        // Simple form handling
        const regForm = document.getElementById('registration-form');
        if (regForm) {
            regForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const submitBtn = regForm.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin" data-icon="progress_activity">progress_activity</span>';
                setTimeout(() => {
                    window.location.href = 'register_health_profile_step_2.html';
                }, 1000);
            });
        }

function toggleVisibility(id) {
            const el = document.getElementById(id);
            const btn = el.parentElement.previousElementSibling.querySelector('button');
            if (el.type === 'password') {
                el.type = 'text';
                btn.textContent = 'Hide';
            } else {
                el.type = 'password';
                btn.textContent = 'Show';
            }
        }

        function updateRequirement(id, isValid) {
            const el = document.getElementById(id);
            const icon = el.querySelector('.material-symbols-outlined');
            if (isValid) {
                el.classList.remove('text-on-surface-variant');
                el.classList.add('text-primary');
                icon.style.fontVariationSettings = "'FILL' 1";
            } else {
                el.classList.add('text-on-surface-variant');
                el.classList.remove('text-primary');
                icon.style.fontVariationSettings = "'FILL' 0";
            }
        }

        function checkStrength() {
            const passwordEl = document.getElementById('password');
            if (!passwordEl) return;
            const val = passwordEl.value;
            const hasLength = val.length >= 8;
            const hasUpper = /[A-Z]/.test(val);
            const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(val);

            updateRequirement('req-length', hasLength);
            updateRequirement('req-upper', hasUpper);
            updateRequirement('req-symbol', hasSymbol);
            
            validateForm();
        }

        function checkMatch() {
            const pass = document.getElementById('password').value;
            const confirm = document.getElementById('confirm_password').value;
            const error = document.getElementById('match-error');
            
            if (confirm.length > 0 && pass !== confirm) {
                error.classList.remove('hidden');
            } else {
                error.classList.add('hidden');
            }
            validateForm();
        }

        function validateForm() {
            const val = document.getElementById('password').value;
            const confirm = document.getElementById('confirm_password').value;
            const hasLength = val.length >= 8;
            const hasUpper = /[A-Z]/.test(val);
            const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(val);
            const matches = val === confirm && val.length > 0;
            
            const btn = document.getElementById('submit-btn');
            if (hasLength && hasUpper && hasSymbol && matches) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
        }

        // Add some atmospheric micro-interaction for focus states
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.parentElement.classList.add('translate-x-1');
            });
            input.addEventListener('blur', () => {
                input.parentElement.parentElement.classList.remove('translate-x-1');
            });
        });

        // Initialize state
        checkStrength();

function selectRole(role) {
            const providerCard = document.getElementById('role-provider');
            const patientCard = document.getElementById('role-patient');
            const continueBtn = document.getElementById('continue-btn');

            // Remove active classes
            providerCard.classList.remove('role-card-active');
            patientCard.classList.remove('role-card-active');

            // Add active class to selection
            if (role === 'provider') {
                providerCard.classList.add('role-card-active');
            } else {
                patientCard.classList.add('role-card-active');
            }

            // Enable continue button
            continueBtn.disabled = false;
            continueBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            continueBtn.classList.add('opacity-100', 'cursor-pointer');
            
            // Set navigation logic
            continueBtn.onclick = function() {
                localStorage.setItem('userRole', role);
                if (role === 'patient') {
                    window.location.href = 'register_patient_onboarding.html';
                } else if (role === 'provider') {
                    window.location.href = 'register_doctor_basic_info_step_1.html';
                }
            };
        }

// Simple Micro-interactions
        document.querySelectorAll('.notification-card').forEach(card => {
            card.addEventListener('click', function() {
                // Remove unread indicator on click
                const indicator = this.querySelector('.unread-indicator');
                if (indicator) {
                    indicator.remove();
                    this.classList.remove('bg-primary-fixed/5');
                }
            });
        });

        // Tab Switching Simulation
        document.querySelectorAll('button.font-label-md').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('button.font-label-md').forEach(t => t.classList.remove('tab-active', 'text-primary'));
                this.classList.add('tab-active');
            });
        });

// Micro-interactions for the cards
        document.querySelectorAll('.group').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });

        // Basic toggle for mobile/desktop active states
        const navItems = document.querySelectorAll('nav a, aside button');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // In a real app, this would handle routing
                // e.preventDefault();
            });
        });

var el_recoveryForm = document.getElementById('recoveryForm'); if (el_recoveryForm) el_recoveryForm.addEventListener('submit', function(e) {
            const btn = document.getElementById('submitBtn');
            const btnText = document.getElementById('btnText');
            const btnIcon = document.getElementById('btnIcon');
            const loader = document.getElementById('loader');
            const success = document.getElementById('successMessage');

            // Disable button and show loading state
            btn.disabled = true;
            btnText.classList.add('hidden');
            btnIcon.classList.add('hidden');
            loader.classList.remove('hidden');

            // Mock API delay
            setTimeout(() => {
                loader.classList.add('hidden');
                btnText.textContent = "Resend Link";
                btnText.classList.remove('hidden');
                btnIcon.classList.remove('hidden');
                btn.classList.replace('bg-primary', 'bg-secondary');
                btn.disabled = false;
                
                success.classList.remove('hidden');
            }, 1500);
        });

// Simple scroll animation for headers
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 20) {
                header.classList.add('bg-white/90', 'backdrop-blur-md');
            } else {
                header.classList.remove('bg-white/90', 'backdrop-blur-md');
            }
        });

        // CTA hover effects
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0px)';
            });
        });

// Simple Interaction logic
        const interactionForm = document.querySelector('form');
        const feedback = document.getElementById('success-feedback');
if (interactionForm && feedback) {
        
        interactionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            feedback.classList.remove('opacity-0', 'pointer-events-none');
            feedback.querySelector('div').classList.remove('scale-90');
            
            setTimeout(() => {
                feedback.classList.add('opacity-0', 'pointer-events-none');
                feedback.querySelector('div').classList.add('scale-90');
            }, 2000);
        });
}

        // Interactive tag removal
        document.querySelectorAll('.material-symbols-outlined[data-icon="close"]').forEach(btn => {
            btn.addEventListener('click', function() {
                this.parentElement.remove();
            });
        });

// Simple drag and drop visual interaction
        const dropzone = document.getElementById('dropzone');
        const fileList = document.getElementById('file-list');

        if (dropzone) {
            ['dragenter', 'dragover'].forEach(eventName => {
                dropzone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    dropzone.classList.add('bg-primary/10');
                }, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropzone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    dropzone.classList.remove('bg-primary/10');
                }, false);
            });

            dropzone.addEventListener('drop', (e) => {
                // Actual upload behavior simulation
                if (e.dataTransfer && e.dataTransfer.files.length > 0 && fileList) {
                    const fileName = e.dataTransfer.files[0].name;
                    const fileSize = (e.dataTransfer.files[0].size / (1024 * 1024)).toFixed(1) + ' MB';
                    const nameEl = fileList.querySelector('p.text-on-surface');
                    const sizeEl = fileList.querySelector('p.text-on-surface-variant');
                    if (nameEl) nameEl.textContent = fileName;
                    if (sizeEl) sizeEl.textContent = fileSize + ' • 100% Uploaded';
                    fileList.classList.remove('hidden');
                }
            });
        }

        // Listen for input change too
        const dropzoneInput = dropzone ? dropzone.querySelector('input') : null;
        if (dropzoneInput) {
            dropzoneInput.addEventListener('change', (e) => {
                if(e.target.files.length > 0 && fileList) {
                    const fileName = e.target.files[0].name;
                    const fileSize = (e.target.files[0].size / (1024 * 1024)).toFixed(1) + ' MB';
                    const nameEl = fileList.querySelector('p.text-on-surface');
                    const sizeEl = fileList.querySelector('p.text-on-surface-variant');
                    if (nameEl) nameEl.textContent = fileName;
                    if (sizeEl) sizeEl.textContent = fileSize + ' • 100% Uploaded';
                    fileList.classList.remove('hidden');
                }
            });
        }

// OTP Input Logic: Auto-focus next field
        const otpInputs = document.querySelectorAll('.otp-input');
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });

            // Prevent non-numeric input
            input.addEventListener('keypress', (e) => {
                if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                }
            });
        });

        // Resend Timer Logic
        let timeLeft = 59;
        const timerElement = document.getElementById('timer');
        const resendBtn = document.getElementById('resend-btn');

        const countdown = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(countdown);
                timerElement.textContent = "";
                resendBtn.disabled = false;
                resendBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                resendBtn.classList.add('hover:underline', 'cursor-pointer');
            } else {
                timerElement.textContent = `(${timeLeft}s)`;
                timeLeft--;
            }
        }, 1000);

        // Form Submission Interaction
var el_otp_form = document.getElementById('otp-form'); if (el_otp_form) el_otp_form.addEventListener('submit', (e) => {
            e.preventDefault();
            const code = Array.from(otpInputs).map(i => i.value).join('');
            
            if (code.length === 6) {
                const btn = e.target.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = `<span class="material-symbols-outlined animate-spin">progress_activity</span> Authenticating...`;
                
                // Simulate verification delay
                setTimeout(() => {
                    alert('Identity verified. Redirecting to Patient Dashboard...');
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 1500);
            }
        });

let currentSlide = 1;
        const totalSlides = 3;

        function updateSlide() {
            // Hide all slides
            for (let i = 1; i <= totalSlides; i++) {
                document.getElementById(`image-${i}`).classList.remove('active');
                document.getElementById(`content-${i}`).classList.remove('active');
                
                const dot = document.getElementById(`dot-${i}`);
                dot.classList.remove('bg-primary', 'w-8');
                dot.classList.add('bg-outline-variant', 'w-2');
            }

            // Show current slide
            document.getElementById(`image-${currentSlide}`).classList.add('active');
            document.getElementById(`content-${currentSlide}`).classList.add('active');
            
            // Update dot
            const activeDot = document.getElementById(`dot-${currentSlide}`);
            activeDot.classList.remove('bg-outline-variant', 'w-2');
            activeDot.classList.add('bg-primary', 'w-8');

            // Update button text
            const btnText = document.getElementById('btn-text');
            if (currentSlide === totalSlides) {
                btnText.innerText = "Get Started";
            } else {
                btnText.innerText = "Next";
            }
        }

        function nextSlide() {
            if (currentSlide < totalSlides) {
                currentSlide++;
                updateSlide();
            } else {
                // Handle "Get Started" click
                completeOnboarding();
            }
        }

        function skipOnboarding() {
            completeOnboarding();
        }

        function completeOnboarding() {
            // Visual feedback before "redirect"
            const btn = document.getElementById('next-btn');
            btn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span>';
            btn.disabled = true;
            
            setTimeout(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const nextAction = urlParams.get('next');
                if (nextAction === 'login') {
                    window.location.href = 'login_secure_entry.html';
                } else {
                    window.location.href = 'register_role_selection_step_2.html';
                }
            }, 800);
        }

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'Enter') {
                nextSlide();
            }
        });

// Micro-interaction: Form input focus state
        const focusInputs = document.querySelectorAll('input, select');
        focusInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.querySelector('.material-symbols-outlined').style.color = '#006767';
            });
            input.addEventListener('blur', () => {
                input.parentElement.querySelector('.material-symbols-outlined').style.color = '#6d7979';
            });
        });

        // Simple validation visualization
        const validationForm = document.querySelector('form');
        if (validationForm) {
            validationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const originalContent = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span> Validating...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerHTML = '<span class="material-symbols-outlined">check</span> Success';
                btn.classList.add('bg-success'); // Mocking success state
                setTimeout(() => {
                    alert('Moving to Step 4: Work Schedule');
                    btn.innerHTML = originalContent;
                    btn.disabled = false;
                }, 1000);
            }, 1500);
        });
        }

// Contact Form Logic
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('contactSubmitBtn');
        const btnText = document.getElementById('contactBtnText');
        const btnIcon = document.getElementById('contactBtnIcon');
        const successOverlay = document.getElementById('contactSuccess');
        const iconWrap = document.getElementById('successIconWrap');
        const heading = document.getElementById('successHeading');
        const text = document.getElementById('successText');
        const resetBtn = document.getElementById('successResetBtn');

        // Loading state
        btnText.innerText = 'Sending...';
        btnIcon.innerText = 'progress_activity';
        btnIcon.classList.add('animate-spin');
        btn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Reset button
            btnText.innerText = 'Send Message';
            btnIcon.innerText = 'send';
            btnIcon.classList.remove('animate-spin');
            btn.disabled = false;

            // Show success overlay
            successOverlay.classList.remove('hidden');
            successOverlay.classList.add('flex');
            
            // Trigger animations
            setTimeout(() => {
                iconWrap.classList.remove('scale-0');
                iconWrap.classList.add('scale-100');
                
                heading.classList.remove('opacity-0', 'translate-y-4');
                heading.classList.add('opacity-100', 'translate-y-0');
                
                text.classList.remove('opacity-0', 'translate-y-4');
                text.classList.add('opacity-100', 'translate-y-0');
                
                resetBtn.classList.remove('opacity-0');
                resetBtn.classList.add('opacity-100');
            }, 50);

            // Clear form
            contactForm.reset();
        }, 1500);
    });
}

function resetContactForm() {
    const successOverlay = document.getElementById('contactSuccess');
    const iconWrap = document.getElementById('successIconWrap');
    const heading = document.getElementById('successHeading');
    const text = document.getElementById('successText');
    const resetBtn = document.getElementById('successResetBtn');

    // Reset animations
    iconWrap.classList.remove('scale-100');
    iconWrap.classList.add('scale-0');
    
    heading.classList.remove('opacity-100', 'translate-y-0');
    heading.classList.add('opacity-0', 'translate-y-4');
    
    text.classList.remove('opacity-100', 'translate-y-0');
    text.classList.add('opacity-0', 'translate-y-4');
    
    resetBtn.classList.remove('opacity-100');
    resetBtn.classList.add('opacity-0');

    setTimeout(() => {
        successOverlay.classList.add('hidden');
        successOverlay.classList.remove('flex');
    }, 500);
}
