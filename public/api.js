const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocal ? 'https://medium-backend-md5a.onrender.com/api' : '/api';
const TOKEN_KEY = 'medibookplus_token';
const USER_KEY = 'medibookplus_user';

const API = {
    // -------------------------------------------------------------------------
    // AUTH & SESSION MANAGEMENT
    // -------------------------------------------------------------------------

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    getUser() {
        const userStr = localStorage.getItem(USER_KEY);
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            return null;
        }
    },

    setSession(token, user) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    clearSession() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    getHeaders(isFormData = false, method = 'GET') {
        const headers = {};
        if (!isFormData && method !== 'GET' && method !== 'HEAD') {
            headers['Content-Type'] = 'application/json';
        }
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },

    // -------------------------------------------------------------------------
    // CORE FETCH WRAPPER
    // -------------------------------------------------------------------------

    async fetch(endpoint, options = {}, retries = 4) {
        const url = `${API_BASE_URL}${endpoint}`;
        const isFormData = options.body instanceof FormData;
        const method = options.method || 'GET';
        
        const config = {
            method: method,
            headers: {
                ...this.getHeaders(isFormData, method),
                ...options.headers
            },
        };

        if (options.body) {
            config.body = isFormData ? options.body : JSON.stringify(options.body);
        }

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url, config);
                const data = await response.json();
                
                if (!response.ok) {
                    if (response.status === 401) {
                        this.clearSession();
                        window.location.href = 'login_secure_entry.html';
                    }
                    throw new Error(data.message || 'API request failed');
                }
                
                return data;
            } catch (error) {
                console.error(`API Error (attempt ${attempt + 1}/${retries + 1}):`, error);
                if (attempt < retries && (error.message === 'Failed to fetch' || error.name === 'TypeError')) {
                    await new Promise(res => setTimeout(res, 2500));
                    continue;
                }
                throw error;
            }
        }
    },

    // -------------------------------------------------------------------------
    // ROUTING HELPER
    // -------------------------------------------------------------------------

    requireAuth(allowedRoles = []) {
        const token = this.getToken();
        const user = this.getUser();

        if (!token || !user) {
            window.location.href = 'login_secure_entry.html';
            return;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            // Redirect based on role if they end up on the wrong page
            this.redirectByRole(user.role);
        }
    },

    redirectByRole(role) {
        let appRoot = '';
        const path = window.location.pathname;
        if (path.includes('/public/')) {
            appRoot = path.substring(0, path.indexOf('/public/'));
        } else if (path.includes('/a_dm_in/')) {
            appRoot = path.substring(0, path.indexOf('/a_dm_in/'));
        } else {
            // Assume we are in public if neither is present (e.g. Vercel with public as root)
            appRoot = '';
        }

        switch (role) {
            case 'patient':
                window.location.href = appRoot + '/patient/pages/dashboard.html';
                break;
            case 'doctor':
                window.location.href = appRoot + '/public/doctor_dashboard.html';
                break;
            case 'admin':
                window.location.href = appRoot + '/a_dm_in/admin_hospital_management_dashboard.html';
                break;
            case 'superadmin':
                window.location.href = appRoot + '/public/superadmin_dashboard.html';
                break;
            default:
                window.location.href = appRoot + '/public/login_secure_entry.html';
        }
    },

    // -------------------------------------------------------------------------
    // ENDPOINTS
    // -------------------------------------------------------------------------

    auth: {
        login: (email, password) => API.fetch('/auth/login', { method: 'POST', body: { email, password } }),
        logout: () => API.fetch('/auth/logout', { method: 'POST' }),
        me: () => API.fetch('/auth/me'),
        registerPatient: (data) => API.fetch('/auth/register/patient', { method: 'POST', body: data }),
        registerDoctor: (data) => API.fetch('/auth/register/doctor', { method: 'POST', body: data }),
        forgotPassword: (email) => API.fetch('/auth/forgot-password', { method: 'POST', body: { email } }),
        resetPassword: (token, newPassword) => API.fetch('/auth/reset-password', { method: 'POST', body: { token, newPassword } }),
    },

    account: {
        updatePhoto: (formData) => API.fetch('/account/photo', { method: 'PATCH', body: formData }),
        changePassword: (data) => API.fetch('/account/password', { method: 'PATCH', body: data }),
        getPreferences: () => API.fetch('/account/preferences'),
        updatePreferences: (data) => API.fetch('/account/preferences', { method: 'PATCH', body: data }),
        deactivate: (password) => API.fetch('/account/deactivate', { method: 'PATCH', body: { password } }),
    },

    hospitals: {
        register: (data) => API.fetch('/hospitals/register', { method: 'POST', body: data }),
        list: () => API.fetch('/hospitals'), // Public active ones
        getDetails: (id) => API.fetch(`/hospitals/${id}`),
    },

    public: {
        departments: () => API.fetch('/departments'),
        visitTypes: () => API.fetch('/visit-types'),
    },

    // Protected generic booking routes
    doctors: {
        list: (params = '') => API.fetch(`/doctors${params}`), // ?department=...&page=...
        getSlots: (id, date, visitType) => API.fetch(`/doctors/${id}/slots?date=${date}&visitType=${visitType}`),
    },

    patients: {
        getProfile: () => API.fetch('/patients/profile'),
        updateProfile: (data) => API.fetch('/patients/profile', { method: 'PATCH', body: data }),
        getCard: () => API.fetch('/patients/card'),
        // For PDF download, point <a> tags to: API_BASE_URL + '/patients/card/pdf?download=true'
        
        appointments: {
            book: (data) => API.fetch('/patients/appointments', { method: 'POST', body: data }),
            list: (params = '') => API.fetch(`/patients/appointments${params}`), // ?status=...
            cancel: (id) => API.fetch(`/patients/appointments/${id}/cancel`, { method: 'PATCH' }),
            reschedule: (id, data) => API.fetch(`/patients/appointments/${id}/reschedule`, { method: 'PATCH', body: data }),
        }
    },

    doctorRole: {
        patients: {
            getDetail: (id) => API.fetch(`/doctor/patients/${id}`),
        },
        availability: {
            get: () => API.fetch('/doctor/availability'),
            update: (data) => API.fetch('/doctor/availability', { method: 'PATCH', body: data }),
        },
        appointments: {
            list: (params = '') => API.fetch(`/doctor/appointments${params}`),
            approve: (id) => API.fetch(`/doctor/appointments/${id}/approve`, { method: 'PATCH' }),
            reject: (id, reason = '') => API.fetch(`/doctor/appointments/${id}/reject`, { method: 'PATCH', body: reason ? { reason } : {} }),
            startConsultation: (id) => API.fetch(`/doctor/appointments/${id}/start-consultation`, { method: 'PATCH' }),
            endConsultation: (id, notes = '') => API.fetch(`/doctor/appointments/${id}/end-consultation`, { method: 'PATCH', body: notes ? { notes } : {} }),
        }
    },

    messages: {
        send: (data) => API.fetch('/messages', { method: 'POST', body: data }), // data is { doctorId, text } or { patientId, text }
        getConversations: () => API.fetch('/messages/conversations'),
        getThread: (id, params = '') => API.fetch(`/messages/thread/${id}${params}`),
    },

    medicalRecords: {
        create: (data) => API.fetch('/medical-records', { method: 'POST', body: data }),
        getMine: (params = '') => API.fetch(`/medical-records/mine${params}`),
        getForPatient: (patientId, params = '') => API.fetch(`/medical-records/patient/${patientId}${params}`),
        getSingle: (id) => API.fetch(`/medical-records/${id}`),
        update: (id, data) => API.fetch(`/medical-records/${id}`, { method: 'PATCH', body: data }),
    },

    notifications: {
        list: (params = '') => API.fetch(`/notifications${params}`),
        getUnreadCount: () => API.fetch('/notifications/unread-count'),
        markRead: (id) => API.fetch(`/notifications/${id}/read`, { method: 'PATCH' }),
        markAllRead: () => API.fetch('/notifications/read-all', { method: 'PATCH' }),
    },

    admin: {
        dashboard: () => API.fetch('/admin/dashboard'),
        doctors: {
            list: (params = '') => API.fetch(`/admin/doctors${params}`),
            approve: (id) => API.fetch(`/admin/doctors/${id}/approve`, { method: 'PATCH' }),
            reject: (id) => API.fetch(`/admin/doctors/${id}/reject`, { method: 'PATCH' }),
        },
        patients: {
            list: (params = '') => API.fetch(`/admin/patients${params}`),
            update: (id, data) => API.fetch(`/admin/patients/${id}`, { method: 'PATCH', body: data }),
            deactivate: (id) => API.fetch(`/admin/patients/${id}/deactivate`, { method: 'PATCH' }),
            activate: (id) => API.fetch(`/admin/patients/${id}/activate`, { method: 'PATCH' }),
        },
        appointments: {
            list: (params = '') => API.fetch(`/admin/appointments${params}`),
            cancel: (id) => API.fetch(`/admin/appointments/${id}/cancel`, { method: 'PATCH' }),
        },
        auditLogs: (params = '') => API.fetch(`/admin/audit-logs${params}`),
    },

    superadmin: {
        hospitals: {
            list: (params = '') => API.fetch(`/superadmin/hospitals${params}`),
            approve: (id) => API.fetch(`/superadmin/hospitals/${id}/approve`, { method: 'PATCH' }),
            reject: (id) => API.fetch(`/superadmin/hospitals/${id}/reject`, { method: 'PATCH' }),
        }
    }
};

window.API = API;
